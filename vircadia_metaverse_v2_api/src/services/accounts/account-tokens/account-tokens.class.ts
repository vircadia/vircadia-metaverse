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

import { DomainInterface } from '../../../common/interfaces/DomainInterface';
import { Params, NullableId } from '@feathersjs/feathers';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../../declarations';
import config from '../../../appconfig';
import { buildTokenInfo } from '../../../common/responsebuilder/accountsBuilder';
import { isAdmin } from '../../../utils/Utils';
import { AccountInterface } from '../../../common/interfaces/AccountInterface';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../../../utils/Misc';
import { messages } from '../../../utils/messages';
import {
    buildPaginationResponse,
    buildSimpleResponse,
} from '../../../common/responsebuilder/responseBuilder';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
import { BadRequest, NotAuthenticated, NotFound } from '@feathersjs/errors';
import { VKeyedCollection } from '../../../utils/vTypes';
import { AccountFields } from '../../../common/AccountFields';
import { checkAccessToEntity } from '../../../utils/Permissions';
/**
 * accounts.
 * @noInheritDoc
 */
export class AccountTokens extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * GET accounts
     *
     * @remarks
     * Return a list of accounts.
     * - Request Type - GET
     * - End Point - API_URL/account/{accountId}/tokens
     *
     * @requires -authentication
     *
     * @param accountId - Account id
     * @returns -  {"status": "success", "data": {"": [{...},{...},...]} or  { status: 'failure', message: 'message'}
     *
     */

    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const accountId = params?.route?.accountId;
        const perPage = parseInt(params?.query?.per_page) || 10;
        const page_num = parseInt(params?.query?.page_num) || 1;
        const skip = (page_num - 1) * perPage;

        const tokensData = await this.findData(config.dbCollections.tokens, {
            query: { accountId: accountId, $skip: skip, $limit: perPage },
        });

        let tokensList: AccountInterface[] = [];

        tokensList = tokensData.data as Array<AccountInterface>;

        const tokens: Array<any> = [];

        (tokensList as Array<AccountInterface>)?.forEach(async (element) => {
            tokens.push(await buildTokenInfo(element));
        });

        return Promise.resolve(
            buildPaginationResponse(
                { tokens },
                page_num,
                perPage,
                Math.ceil(tokensData.total / perPage),
                tokensData.total
            )
        );
    }

    /**
     * delete account token
     *
     * @remarks
     * - Request Type - DELETE
     * - End Point - API_URL/account/{accountId}/tokens/{tokenId}
     *
     * @requires -authentication
     *
     * @param accountId - Account id
     * @param tokenId - token id
     * @returns -  {"status": "success", "data": {"": [{...},{...},...]} or  { status: 'failure', message: 'message'}
     *
     */

    async remove(id: NullableId, params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        let asAdmin = params?.query?.asAdmin === 'true' ? true : false;
        const accountId = params?.route?.accountId;

        const account = await this.findDataToArray(
            config.dbCollections.accounts,
            {
                query: { id: accountId },
            }
        );

        if (IsNotNullOrEmpty(accountId) && IsNotNullOrEmpty(account)) {
            if (IsNotNullOrEmpty(id) && id) {
                const tokenId = id;

                const token = await this.findDataToArray(
                    config.dbCollections.tokens,
                    {
                        query: { id: tokenId },
                    }
                );

                if (
                    asAdmin &&
                    IsNotNullOrEmpty(loginUser) &&
                    isAdmin(loginUser as AccountInterface)
                ) {
                    asAdmin = true;
                } else {
                    asAdmin = false;
                }

                if (IsNotNullOrEmpty(token)) {
                    if (
                        (asAdmin && isAdmin(loginUser)) ||
                        loginUser.id === token[0].accountId
                    ) {
                        if (accountId === token[0].accountId) {
                            await this.deleteData(
                                config.dbCollections.tokens,
                                tokenId
                            );
                            return Promise.resolve({});
                        } else {
                            throw new BadRequest(
                                messages.common_messages_token_account_not_match
                            );
                        }
                    } else {
                        throw new BadRequest(
                            messages.common_messages_unauthorized
                        );
                    }
                } else {
                    throw new BadRequest(
                        messages.common_messages_token_not_found
                    );
                }
            } else {
                throw new BadRequest(messages.common_messages_tokenid_missing);
            }
        } else {
            throw new BadRequest(
                messages.common_messages_target_account_notfound
            );
        }
    }
}
