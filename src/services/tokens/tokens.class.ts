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

'use strict';

import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import config from '../../appconfig';
import fsPromises from 'fs/promises';
import {
    GenUUID,
    IsNotNullOrEmpty,
    IsNullOrEmpty,
    Clamp,
} from '../../utils/Misc';
import path from 'path';
import { TokenScope, Tokens } from '../../utils/Tokens';
import { BadRequest, NotAuthenticated } from '@feathersjs/errors';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import { messages } from '../../utils/messages';
import { Params } from '@feathersjs/feathers';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';

/**
 * token.
 * @noInheritDoc
 */
export class Token extends DatabaseService {
    application: Application;
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
        this.application = app;
    }

    /**
     * Returns the new token
     *
     * @remarks
     * This method is part of the get new token based on scope
     * - Request Type - POST
     * - End Point - API_URL/api/v1/token/new
     *
     * @param scope - scope
     * @returns -  : { data:{status:success:[{...},{...}]},}
     *
     */

    async create(data: any, params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (IsNotNullOrEmpty(loginUser)) {
            let scope = TokenScope.OWNER;

            if (params?.query?.scope) {
                scope = params?.query?.scope;
            }
            if (TokenScope.KnownScope(scope)) {
                const tokenInfo = await Tokens.createToken(loginUser.id, [
                    scope,
                ]);

                const result = await this.createData(
                    config.dbCollections.tokens,
                    tokenInfo
                );

                const tokenData = {
                    token: tokenInfo.token,
                    token_id: tokenInfo.id,
                    refresh_token: tokenInfo.refreshToken,
                    token_expiration_seconds:
                        (tokenInfo.expirationTime.valueOf() -
                            tokenInfo.whenCreated.valueOf()) /
                        1000,
                    account_name: loginUser.username,
                    account_roles: loginUser.roles,
                    account_id: loginUser.id,
                };
                return Promise.resolve(buildSimpleResponse(tokenData));
            }
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }

    /**
     * Returns the Users
     *
     * @remarks
     * This method is part of the get list of users
     * - Request Type - GET
     * - End Point - API_URL/user/tokens/new
     *
     * @returns -
     *
     */
    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (IsNotNullOrEmpty(loginUser)) {
            const forDomainServer = params?.query?.for_domain_server;
            const scope = forDomainServer
                ? TokenScope.DOMAIN
                : TokenScope.OWNER;
            const tokenInfo = await Tokens.createToken(loginUser.id, [scope]);
            await this.createData(config.dbCollections.tokens, tokenInfo);
            const body = `<center><h2>Your domain's access token is ${tokenInfo.token}</h2></center>`;
            return Promise.resolve({ body });
        } else {
            // if the user is not logged in, go to a page to login and set things up
            const tokengenURL = path.join(
                __dirname,
                '../..',
                config.metaverseServer.tokengen_url
            );
            // tokengenURL = tokengenURL.replace('METAVERSE_SERVER_URL', Config.metaverse['metaverse-server-url']);
            // tokengenURL = tokengenURL.replace('DASHBOARD_URL', Config.metaverse['dashboard-url']);
            const htmlBody = await fsPromises.readFile(tokengenURL, 'utf-8');
            return Promise.resolve({ htmlBody });
        }
    }
}

