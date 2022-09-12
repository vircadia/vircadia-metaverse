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

import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../../declarations';
import config from '../../../appconfig';
import { AccountInterface } from '../../../common/interfaces/AccountInterface';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../../../utils/Misc';
import { messages } from '../../../utils/messages';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
import { BadRequest, NotAuthenticated, NotFound } from '@feathersjs/errors';
import { VKeyedCollection } from '../../../utils/vTypes';
import { Tokens, TokenScope } from '../../../utils/Tokens';
import { isValidateEmail } from '../../../utils/Utils';
import { AuthToken } from '../../../common/interfaces/AuthToken';
/**
 * oauth token.
 * @noInheritDoc
 */
export class AccountFeild extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * POST oauth token
     *
     * @remarks
     * This method is return an initial access token for a user
     * - Request Type - POST
     * - End Point - API_URL/oauth/token
     *
     * @requires -authentication

     * @param body =       {
                                "grant_type": "password",
                                "username": "Metaverse13",
                                "password": "Metaverse13"
                            }
                            or
                            {
                                "grant_type": "refresh_token",
                                "refresh_token": "59bf706e-10c4-4ec2-b7fd-c130b032954a",
                                "scope": "owner"
                            }
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async create(data: any, params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const accessGrantType = data.grant_type;
        switch (accessGrantType) {
            case 'password': {
                let userLogin = data.username;
                const userPassword = data.password;
                const userScope: string = data.scope ?? TokenScope.OWNER;

                params.headers['content-type'] = 'application/json';
                if (TokenScope.KnownScope(userScope)) {
                    if (!isValidateEmail(userLogin))
                    {
                        const accountsByUsername = await this.findDataToArray(
                            config.dbCollections.accounts,
                            { query: { username: userLogin } }
                        );
                        if (accountsByUsername.length == 1) {
                            userLogin = accountsByUsername[0].email;
                        }
                    }
                    const tokenData = await this.app
                        ?.service('authentication')
                        .create(
                            {
                                email: userLogin,
                                password: userPassword,
                                strategy: 'local',
                            },
                            params
                        );
                    return Promise.resolve(tokenData);
                } else {
                    throw new BadRequest(
                        messages.common_messages_invalid_scope
                    );
                }
                break;
            }
            case 'authorization_code': {
                throw new BadRequest(
                    'Do not know what to do with an authorization_code'
                );
                break;
            }
            case 'refresh_token': {
                const refreshingToken = data.refresh_token;
                const refreshToken = await this.findDataToArray(
                    config.dbCollections.tokens,
                    { query: { refreshToken: refreshingToken } }
                );

                if (Tokens.hasNotExpired(refreshToken[0])) {
                    const tokenInfo = await this.findDataToArray(
                        config.dbCollections.tokens,
                        {
                            query: {
                                refreshToken: refreshingToken,
                                accountId: loginUser.id,
                            },
                        }
                    );

                    if (IsNotNullOrEmpty(tokenInfo)) {
                        const requestingAccount = await this.findDataToArray(
                            config.dbCollections.accounts,
                            { query: { id: tokenInfo[0].accountId } }
                        );
                        if (
                            IsNotNullOrEmpty(requestingAccount) &&
                            refreshToken[0].accountId ===
                                requestingAccount[0].id
                        ) {
                            // refresh token has not expired and requestor is owner of the token so make new
                            const newToken = await Tokens.createToken(
                                loginUser.id,
                                refreshToken[0].scope
                            );

                            await this.createData(
                                config.dbCollections.tokens,
                                newToken
                            );

                            return Promise.resolve(
                                this.buildOAuthResponseBody(
                                    requestingAccount[0],
                                    newToken
                                )
                            );
                        } else {
                            throw new BadRequest(
                                'refresh token not owned by accessing account'
                            );
                        }
                    } else {
                        throw new BadRequest(
                            messages.common_messages_target_account_notfound
                        );
                    }
                } else {
                    throw new BadRequest(
                        messages.common_messages_refresh_token_expired
                    );
                }
                break;
            }
            default: {
                throw new BadRequest('Unknown grant_type :' + accessGrantType);
                break;
            }
        }
    }

    buildOAuthResponseBody(
        pAcct: AccountInterface,
        pToken: AuthToken
    ): VKeyedCollection {
        const body: VKeyedCollection = {
            access_token: pToken.token,
            token_type: 'Bearer',
            expires_in:
                pToken.expirationTime.valueOf() / 1000 -
                pToken.whenCreated.valueOf() / 1000,
            refresh_token: pToken.refreshToken,
            scope: pToken.scope[0],
            created_at: pToken.whenCreated.valueOf() / 1000,
        };
        if (pAcct) {
            (body.account_id = pAcct.id),
                (body.account_name = pAcct.username),
                (body.account_roles = pAcct.roles);
        }
        return body;
    }
}
