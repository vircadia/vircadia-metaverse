//   Copyright 2024 Vircadia Contributors
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

'use strict';

import CustomOAuthStrategy from './custom-oauth';
import { Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { OAuthProfile } from '@feathersjs/authentication-oauth/lib';
import { GenUUID } from '../../utils/Misc';
import { generateRandomNumber } from '../../utils/Utils';
import { messages } from '../../utils/messages';
import axios from 'axios';
import config from '../../appconfig';
import logger from '../../logger';

function extractEmailFromProfile(profile: any): string | undefined {
    if (!profile) return undefined;
    // Common fields: email, emails: [{ value }], preferred_username, upn
    if (profile.email) return profile.email as string;
    if (Array.isArray(profile.emails) && profile.emails.length > 0) {
        const first = profile.emails[0];
        if (typeof first === 'string') return first;
        if (first?.value) return first.value as string;
    }
    if (profile.preferred_username) return profile.preferred_username as string;
    if (profile.upn) return profile.upn as string;
    return undefined;
}

/**
 * Generate Azure username from email: uses local part + .AZURE suffix
 * This format avoids @ symbol conflicts with domain servers.
 */
function generateAzureUsername(email: string): string {
    const localPart = email.split('@')[0] || '';
    // Sanitize local part - allow alphanumeric and .-_
    let sanitized = localPart.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    if (sanitized.length < 2) sanitized = 'user_' + sanitized;
    // Truncate to leave room for .AZURE suffix (max username 30 chars)
    if (sanitized.length > 24) sanitized = sanitized.slice(0, 24);
    return sanitized + '.AZURE';
}

/**
 * Check if an account's username needs migration to .AZURE format.
 * Old formats:
 *   - Full email: "user@domain.com"
 *   - Local part only: "user" (without .AZURE suffix)
 */
function needsUsernameMigration(account: any, email: string): boolean {
    if (!account?.username || !email) return false;
    
    const currentUsername = account.username.toString();
    
    // Already in correct format
    if (currentUsername.endsWith('.AZURE')) {
        return false;
    }
    
    const emailLower = email.toLowerCase();
    const localPart = emailLower.split('@')[0] || '';
    
    // Username contains @ (full email format) - needs migration
    if (currentUsername.includes('@')) {
        return true;
    }
    
    // Username matches local part without .AZURE suffix - needs migration
    if (currentUsername.toLowerCase() === localPart) {
        return true;
    }
    
    // Sanitized version of local part without .AZURE suffix - needs migration
    const sanitizedLocalPart = localPart.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    if (currentUsername.toLowerCase() === sanitizedLocalPart.toLowerCase()) {
        return true;
    }
    
    return false;
}

export class AzureStrategy extends CustomOAuthStrategy {
    app: Application;
    constructor(app: Application) {
        super();
        this.app = app;
        // this.name defaults to 'azure' from registration.
    }

    async getProfile(authResult: any): Promise<any> {
        const accessToken = authResult.access_token;
        // Azure AD v2.0 OIDC userinfo endpoint is on Microsoft Graph
        // Requires openid/profile scopes
        const { data } = await axios.get('https://graph.microsoft.com/oidc/userinfo', {
            headers: { authorization: `Bearer ${accessToken}` }
        });
        return data;
    }

    async getEntityData(profile: any, entity: any): Promise<any> {
        const baseData = await super.getEntityData(profile, null, {} as Params);
        const id = entity?.id ? entity?.id : GenUUID();
        const email = extractEmailFromProfile(profile);
        if (!email) {
            throw new Error(messages.common_messages_social_error);
        }

        // Check if existing entity needs username migration to .AZURE format
        const newUsername = generateAzureUsername(email);
        if (entity && needsUsernameMigration(entity, email)) {
            const oldUsername = entity.username;
            try {
                // Perform the migration by updating the account directly
                const db = this.app.get('mongoClient');
                if (db) {
                    await db.collection(config.dbCollections.accounts).updateOne(
                        { id: entity.id },
                        { $set: { username: newUsername } }
                    );
                    logger.info(
                        `[azure-oauth] Migrated username from "${oldUsername}" to "${newUsername}" for account ${entity.id}`
                    );
                }
            } catch (migrationErr: any) {
                // Log but don't fail - username migration is best-effort
                logger.warn(
                    `[azure-oauth] Failed to migrate username for account ${entity.id}: ${migrationErr?.message}`
                );
            }
        }

        return {
            ...baseData,
            email,
            username: newUsername,
            // Use a deterministic provider-specific id to handle accounts without email changes
            azureId: profile.sub
                ? `${this.name}:::${profile.sub as string}`
                : `${this.name}:::${(profile.id as string) ?? (profile.oid as string)}`,
            id
        };
    }

    async createEntity(profile: OAuthProfile): Promise<any> {
        const email = extractEmailFromProfile(profile);
        if (!email) {
            throw new Error(messages.common_messages_social_error);
        }
        const createUserData: any = {
            azureId: profile.sub
                ? `${this.name}:::${profile.sub as string}`
                : `${this.name}:::${(profile.id as string) ?? (profile.oid as string)}`,
            username: generateAzureUsername(email),
            email,
            password: generateRandomNumber(10).toString()
        };
        return (await this.app.service('users').create(createUserData)).data;
    }
}

export default AzureStrategy;


