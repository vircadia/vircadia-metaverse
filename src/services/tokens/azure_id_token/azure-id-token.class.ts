//   Copyright 2025 Vircadia Contributors
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

import {
	DatabaseService,
	noCaseCollation,
} from "../../../common/dbservice/DatabaseService";
import { DatabaseServiceOptions } from "../../../common/dbservice/DatabaseServiceOptions";
import { Application } from "../../../declarations";
import config from "../../../appconfig";
import { BadRequest } from "@feathersjs/errors";
import { VKeyedCollection } from "../../../utils/vTypes";
import { Tokens, TokenScope } from "../../../utils/Tokens";
import { messages } from "../../../utils/messages";
import { GenUUID } from "../../../utils/Misc";
import { Roles } from "../../../common/sets/Roles";
import { getGameUserLevel, getUtcDate } from "../../../utils/Utils";
import { AuthToken } from "../../../common/interfaces/AuthToken";
import { createRemoteJWKSet, jwtVerify, JWTPayload, decodeJwt } from "jose";
import logger from "../../../logger";
import { authRepository } from "../../../redis";

function extractEmailFromClaims(claims: JWTPayload): string | undefined {
	const email =
		(claims.email as string) ||
		(claims.preferred_username as string) ||
		(claims.upn as string);
	return email;
}

function sanitizeUsernameFromEmail(
	email: string,
	fallbackSeed: string,
): string {
	const allowed = /[a-zA-Z0-9.\-_$@*!]/;
	const localPart = (email.split("@")[0] || "").toString();
	let sanitized = "";
	for (const ch of localPart) {
		if (allowed.test(ch)) sanitized += ch;
		else sanitized += "_";
	}
	if (sanitized.length < 2) {
		sanitized =
			"user_" + (fallbackSeed.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6) || "aa");
	}
	if (sanitized.length > 30) sanitized = sanitized.slice(0, 30);
	return sanitized;
}

export class AzureIdTokenExchange extends DatabaseService {
	application: Application;
	constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
		super(options, app);
		this.application = app;
	}

	/**
	 * Exchange an Azure AD ID token for a metaverse OAuth-like token response.
	 * - Request Type - POST
	 * - Endpoint - /oauth/azure/id-token
	 *
	 * @param body { id_token: string }
	 */
	async create(data: any): Promise<any> {
		const idToken: string = (data?.id_token ?? "").toString().trim();
		if (!idToken) {
			throw new BadRequest("Missing id_token");
		}

		const tenant =
			process.env.AZURE_AD_TENANT_ID ||
			config.authentication.oauth.azure.tenant;
		const clientId =
			process.env.AZURE_AD_CLIENT_ID || config.authentication.oauth.azure.key;
		if (!tenant || !clientId) {
			throw new BadRequest("Azure AD is not configured on server");
		}

		const issuer = `https://login.microsoftonline.com/${tenant}/v2.0`;
		const jwksUri = `https://login.microsoftonline.com/${tenant}/discovery/v2.0/keys`;

		const JWKS = createRemoteJWKSet(new URL(jwksUri));
		let claims: JWTPayload;
		try {
			const { payload } = await jwtVerify(idToken, JWKS, {
				issuer,
				audience: clientId,
			});
			claims = payload;
		} catch {
			throw new BadRequest("Invalid Azure ID token");
		}

		const sub = (claims.sub as string) || "";
		const email = extractEmailFromClaims(claims);
		if (!sub) {
			throw new BadRequest("Azure token missing subject");
		}
		if (!email) {
			throw new BadRequest(messages.common_messages_social_error);
		}

		const azureId = `azure:::${sub}`;

		// Find existing account by azureId or email
		let account: any = null;
		try {
			const byAzure: any[] = await this.findDataToArray(
				config.dbCollections.accounts,
				{ query: { azureId: azureId } },
			);
			if (byAzure && byAzure.length > 0) {
				account = byAzure[0];
			} else {
				const byEmail: any[] = await this.findDataToArray(
					config.dbCollections.accounts,
					{ query: { email: email }, collation: noCaseCollation },
				);
				if (byEmail && byEmail.length > 0) {
					account = byEmail[0];
					// Link azureId to existing account
					await this.patchData(config.dbCollections.accounts, account.id, {
						azureId: azureId,
					});
					account.azureId = azureId;
				}
			}
		} catch (err: any) {
			const msg = err?.message
				? `Failed to lookup existing account: ${err.message}`
				: "Failed to lookup existing account";
			logger.error(`[azure-id-token] ${msg}`);
			throw new BadRequest(msg);
		}

		if (!account) {
			try {
				const proposedUsername = sanitizeUsernameFromEmail(email, sub);
				// Directly create account in accounts collection, bypassing users service
				const id = GenUUID();
				const roles = [Roles.USER];
				const friends: string[] = [];
				const connections: string[] = [];
				const whenCreated = new Date();
				const accountIsActive = true;
				const accountWaitingVerification =
					config.metaverseServer.enable_account_email_verification === "true";
				const xp = 0;
				const level = getGameUserLevel(xp);
				const createUser: any = {
					id,
					username: proposedUsername,
					email: email,
					roles,
					whenCreated,
					friends,
					connections,
					accountIsActive,
					accountWaitingVerification,
					lastOnline: getUtcDate(),
					level,
					bio: "",
					xp,
					azureId,
				};
				account = await this.createData(
					config.dbCollections.accounts,
					createUser,
				);
				if (!account) {
					throw new BadRequest("Failed to create account");
				}
			} catch (err: any) {
				const message =
					(err?.message as string) || "Failed to create or link user account";
				logger.error("[azure-id-token] %s", message);
				throw new BadRequest(message);
			}
		}

		// Issue Feathers JWT for API consumption
		let accessTokenStr: string | undefined;
		try {
			const authSvc: any = (this.application as any).service("authentication");
			if (typeof authSvc?.createAccessToken === "function") {
				accessTokenStr = await authSvc.createAccessToken({ sub: account.id });
			} else {
				throw new Error("Authentication service cannot create access token");
			}
		} catch (err: any) {
			logger.error("[azure-id-token] Failed to issue JWT: %s", err?.message);
			throw new BadRequest("Failed to issue access token");
		}

		// Persist the JWT in Redis so downstream user lookups succeed
		try {
			if (accessTokenStr) {
				const jwtPayload = decodeJwt(accessTokenStr);
				await authRepository.createAndSave({
					token: accessTokenStr,
					tokenId: (jwtPayload.jti as string) || "",
					userId: account.id,
					expires: (jwtPayload.exp as number) || 0,
				});
			}
		} catch (err: any) {
			logger.error(
				"[azure-id-token] Failed to persist JWT in Redis: %s",
				err?.message,
			);
			// Do not fail the request solely due to Redis persistence issues
		}

		// Compose OAuth-like response, using Feathers JWT as access_token
		const newToken: AuthToken = await Tokens.createToken(account.id, [
			TokenScope.OWNER,
		]);
		await this.createData(config.dbCollections.tokens, newToken);
		const body: VKeyedCollection = {
			access_token: accessTokenStr,
			token_type: "Bearer",
			expires_in:
				newToken.expirationTime.valueOf() / 1000 -
				newToken.whenCreated.valueOf() / 1000,
			refresh_token: newToken.refreshToken,
			scope: newToken.scope[0],
			created_at: newToken.whenCreated.valueOf() / 1000,
			account_id: account.id,
			account_name: account.username,
			account_roles: account.roles,
		};
		return Promise.resolve(body);
	}

	buildOAuthResponseBody(pAcct: any, pToken: AuthToken): VKeyedCollection {
		const body: VKeyedCollection = {
			access_token: pToken.token,
			token_type: "Bearer",
			expires_in:
				pToken.expirationTime.valueOf() / 1000 -
				pToken.whenCreated.valueOf() / 1000,
			refresh_token: pToken.refreshToken,
			scope: pToken.scope[0],
			created_at: pToken.whenCreated.valueOf() / 1000,
		};
		if (pAcct) {
			body.account_id = pAcct.id;
			body.account_name = pAcct.username;
			body.account_roles = pAcct.roles;
		}
		return body;
	}
}

export default AzureIdTokenExchange;
