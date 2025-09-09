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
import { AuthToken } from "../../../common/interfaces/AuthToken";
import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";

function extractEmailFromClaims(claims: JWTPayload): string | undefined {
	const email =
		(claims.email as string) ||
		(claims.preferred_username as string) ||
		(claims.upn as string);
	return email;
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
		} catch {
			throw new BadRequest("Failed to lookup existing account");
		}

		if (!account) {
			try {
				// Create a new user via users service to reuse hooks/logic
				const createUserData: any = {
					username: email,
					email: email,
					password: GenUUID(),
				};
				const created = await this.application
					.service("users")
					.create({ user: createUserData });
				const createdData = created?.data ?? created;
				const newAccountId = createdData?.id ?? createdData?.accountId;
				if (!newAccountId) {
					throw new BadRequest("User creation did not return account id");
				}
				// Fetch the full account document to ensure correct shape
				const fetched: any[] = await this.findDataToArray(
					config.dbCollections.accounts,
					{ query: { id: newAccountId } },
				);
				if (!fetched || fetched.length === 0) {
					throw new BadRequest("Newly created account not found");
				}
				account = fetched[0];
				// Link azureId to the newly created account record in accounts collection
				await this.patchData(config.dbCollections.accounts, account.id, {
					azureId: azureId,
				});
				account.azureId = azureId;
			} catch {
				throw new BadRequest("Failed to create or link user account");
			}
		}

		// Issue tokens and return standard OAuth response body
		const newToken: AuthToken = await Tokens.createToken(account.id, [
			TokenScope.OWNER,
		]);
		await this.createData(config.dbCollections.tokens, newToken);
		return Promise.resolve(this.buildOAuthResponseBody(account, newToken));
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
