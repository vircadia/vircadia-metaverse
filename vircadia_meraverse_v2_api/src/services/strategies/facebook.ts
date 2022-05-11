//   Copyright 2020 Vircadia Contributors
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

import CustomOAuthStrategy from './custom-oauth';
import { Params } from '@feathersjs/feathers';
import config from '../../appconfig';
import { Application } from '../../declarations';
import { OAuthProfile } from '@feathersjs/authentication-oauth/lib';
import { AuthenticationRequest } from '@feathersjs/authentication';
import { GenUUID, IsNullOrEmpty } from '../../utils/Misc';
import { generateRandomNumber } from '../../utils/Utils';
import { messages } from '../../utils/messages';
import axios from 'axios';

export class FacebookStrategy extends CustomOAuthStrategy {
    app: Application;
    constructor(app: Application) {
        super();
        this.app = app;
    }

    async getProfile(authResult: AuthenticationRequest) {
        const accessToken = authResult.access_token;

        const { data } = await axios.get('https://graph.facebook.com/me', {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
            params: {
                // There are
                fields: 'id,name,email',
            },
        });
        return data;
    }

    async getEntityData(profile: any, entity: any): Promise<any> {
        const baseData = await super.getEntityData(profile, null, {});
        const id = entity?.id ? entity?.id : GenUUID();
        if (IsNullOrEmpty(profile.email)) {
            throw new Error(messages.common_messages_social_error);
        }
        return {
            ...baseData,
            email: profile.email,
            facebookId: profile.sub
                ? `${this.name}:::${profile.sub as string}`
                : `${this.name}:::${profile.id as string}`,
            id,
        };
    }

    async createEntity(profile: OAuthProfile): Promise<any> {
        const createUserData: any = {
            facebookId: profile.sub
                ? `${this.name}:::${profile.sub as string}`
                : `${this.name}:::${profile.id as string}`,
            username: profile.email,
            email: profile.email,
            password: generateRandomNumber(10).toString(),
        };
        return (await this.app.service('users').create(createUserData)).data;
    }

    async findEntity(profile: OAuthProfile, params: Params): Promise<any> {
        const result = await super.findEntity(profile, params);
        return result;
    }

    async getRedirect(data: any): Promise<string> {
        const redirectHost = config.authentication.callback.facebook;

        if (Object.getPrototypeOf(data) === Error.prototype) {
            const err = data.message as string;
            return redirectHost + `?error=${err}`;
        } else {
            const token = data.accessToken as string;
            const userId = data?.user?.id as string;
            const returned = redirectHost + `?token=${token}&userId=${userId}`;
            return returned;
        }
    }
}
export default FacebookStrategy;
