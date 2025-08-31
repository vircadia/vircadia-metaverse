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
        return {
            ...baseData,
            email,
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
            username: email,
            email,
            password: generateRandomNumber(10).toString()
        };
        return (await this.app.service('users').create(createUserData)).data;
    }
}

export default AzureStrategy;


