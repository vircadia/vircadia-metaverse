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
import {
    buildDomainInfoV1,
    buildDomainInfo,
} from '../../../common/responsebuilder/domainsBuilder';
import { isAdmin } from '../../../utils/Utils';
import { AccountInterface } from '../../../common/interfaces/AccountInterface';
import {
    IsNotNullOrEmpty,
    IsNullOrEmpty,
    isValidUUID,
} from '../../../utils/Misc';
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
export class AccountFeild extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * GET accounts
     *
     * @remarks
     * Return a list of accounts.
     * - Request Type - GET
     * - End Point - API_URL/{accountId}/field/{fieldname}
     *
     * @requires -authentication
     *
     * @param accountId - Account id
     * @param fieldname = field name
     * @returns -  {"status": "success", "data": {"": [{...},{...},...]} or  { status: 'failure', message: 'message'}
     *
     */

    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const fieldName = params?.route?.fieldName;
        const accountId:any = params?.route?.accountId;

        let entryDataArray = null;
        if (isValidUUID(accountId)) {
            entryDataArray = await this.getData(
                config.dbCollections.accounts,
                accountId
            );
        } else {
            entryDataArray = await this.findDataToArray(
                config.dbCollections.accounts,
                { query: { username: accountId } }
            );

            if (IsNotNullOrEmpty(entryDataArray)) {
                entryDataArray = entryDataArray[0];
            }
        }

        const fieldAccess = AccountFields[fieldName as any];

        if (IsNotNullOrEmpty(loginUser)) {
            if (accountId && fieldName) {
                if (fieldAccess) {
                    if (
                        await checkAccessToEntity(
                            AccountFields[fieldName].get_permissions,
                            loginUser,
                            entryDataArray
                        )
                    ) {
                        let objAccount = null;
                        if (isValidUUID(accountId)) {
                            objAccount = await this.getData(
                                config.dbCollections.accounts,
                                accountId
                            );
                        } else {
                            objAccount = await this.findDataToArray(
                                config.dbCollections.accounts,
                                { query: { username: accountId } }
                            );

                            if (IsNotNullOrEmpty(objAccount)) {
                                objAccount = objAccount[0];
                            }
                        }

                        if (IsNotNullOrEmpty(objAccount)) {
                            if (AccountFields[fieldName].getter) {
                                const data = await AccountFields[
                                    fieldName
                                ].getter(
                                    objAccount,
                                    AccountFields[fieldName].entity_field
                                );
                                return Promise.resolve({ data });
                            } else {
                                return Promise.reject(
                                    new BadRequest(
                                        messages.common_messsages_cannot_get_field
                                    )
                                );
                            }
                        } else {
                            throw new NotFound(
                                messages.common_messages_no_place_by_accountId
                            );
                        }
                    } else {
                        throw new BadRequest(
                            messages.common_messages_account_cannot_access_this_field
                        );
                    }
                } else {
                    throw new BadRequest(
                        messages.common_messages_field_not_found
                    );
                }
            } else {
                throw new BadRequest(
                    messages.common_messages_field_name_require
                );
            }
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }

    /**
     * POST place
     *
     * @remarks
     * This method is part of the edit place and set value by field
     * - Request Type - POST
     * - End Point - API_URL/{accountId}/field/{fieldname}
     *
     * @requires -authentication
     * @param accountId = Url param
     * @param fieldname = field name
     * @param body =   {
                        "set": "http://mysite.example.com/buff-images/smiling.jpg"
                        } or

                        {
                            "set": {
                                "set": [ "friend1", "friend2" ],
                                "add": [ "friend3" ],
                                "remove": [ "friend2" ]
                            }
                        }
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async create(data: any, params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const accountId = params?.route?.accountId;
        const fieldName = params?.route?.fieldName;
        const updates: VKeyedCollection = {};

        if (IsNotNullOrEmpty(loginUser)) {
            if (accountId) {
                let entryDataArray = null;
                if (isValidUUID(accountId)) {
                    entryDataArray = await this.getData(
                        config.dbCollections.accounts,
                        accountId
                    );
                } else {
                    entryDataArray = await this.findDataToArray(
                        config.dbCollections.accounts,
                        { query: { username: accountId } }
                    );

                    if (IsNotNullOrEmpty(entryDataArray)) {
                        entryDataArray = entryDataArray[0];
                    }
                }

                if (
                    fieldName &&
                    AccountFields[fieldName] &&
                    typeof AccountFields[fieldName].setter === 'function'
                ) {
                    if (
                        await checkAccessToEntity(
                            AccountFields[fieldName].set_permissions,
                            loginUser,
                            entryDataArray
                        )
                    ) {
                        const validity = await AccountFields[
                            fieldName
                        ].validate(data.set, loginUser, entryDataArray);

                        if (validity) {
                            await AccountFields[fieldName].setter(
                                AccountFields[fieldName].entity_field,
                                entryDataArray,
                                data.set,
                                updates
                            );

                            const result = await this.patchData(
                                config.dbCollections.accounts,
                                entryDataArray.id,
                                updates
                            );
                            // if update password then dont show password in response
                            if (fieldName === 'password') {
                                delete updates['passwordSalt'];
                                delete updates['passwordHash'];
                                updates.password =
                                    'Password changed successfully';
                            }

                            return Promise.resolve(
                                buildSimpleResponse({ updates })
                            );
                        } else {
                            throw new BadRequest(
                                messages.common_messages_validation_error
                            );
                        }
                    } else {
                        throw new BadRequest(
                            messages.common_messages_account_cannot_set_this_field
                        );
                    }
                } else {
                    throw new BadRequest(
                        messages.common_messsages_cannot_set_field
                    );
                }
            } else {
                throw new BadRequest(
                    messages.common_messages_no_place_by_accountId
                );
            }
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }
}
