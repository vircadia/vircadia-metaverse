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
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../../../utils/Misc';
import { messages } from '../../../utils/messages';
import {
    buildPaginationResponse,
    buildSimpleResponse,
} from '../../../common/responsebuilder/responseBuilder';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
import { BadRequest, NotAuthenticated, NotFound } from '@feathersjs/errors';
import { VKeyedCollection } from '../../../utils/vTypes';
import { DomainFields } from '../../../common/DomainFields';
import { checkAccessToEntity } from '../../../utils/Permissions';
/**
 * Domains.
 * @noInheritDoc
 */
export class DomainsFeild extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * GET Domains
     *
     * @remarks
     * Return a list of domain.
     * - Request Type - GET
     * - End Point - API_URL/{domainId}/field/{fieldname}
     *
     * @requires -authentication
     *
     * @param domainId - Domain id
     * @param fieldname = field name
     * @returns -  {"status": "success", "data": {"": [{...},{...},...]} or  { status: 'failure', message: 'message'}
     *
     */

    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const fieldName = params?.route?.fieldName;
        const domainId = params?.route?.domainId;
        const entryDataArray = await this.getData(
            config.dbCollections.domains,
            domainId as any
        );

        const fieldAccess = DomainFields[fieldName as any];

        if (IsNotNullOrEmpty(loginUser)) {
            if (domainId && fieldName) {
                if (fieldAccess) {
                    if (
                        await checkAccessToEntity(
                            DomainFields[fieldName].get_permissions,
                            loginUser,
                            entryDataArray
                        )
                    ) {
                        const objDomain = await this.getData(
                            config.dbCollections.domains,
                            domainId
                        );
                        if (IsNotNullOrEmpty(objDomain)) {
                            const data = await DomainFields[fieldName].getter(
                                objDomain,
                                DomainFields[fieldName].entity_field
                            );
                            return Promise.resolve({ data });
                        } else {
                            throw new NotFound(
                                messages.common_messages_target_domain_notfound
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
     * POST domain
     *
     * @remarks
     * This method is part of the edit domain and set value by field
     * - Request Type - POST
     * - End Point - API_URL/{domainId}/field/{fieldname}
     *
     * @requires -authentication
     * @param domainId = Url param
     * @param fieldname = field name
     * @param body =   {
                        "set": "http://mysite.example.com/buff-images/smiling.jpg"
                        } 
                        or
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
        const domainId = params?.route?.domainId;
        const fieldName = params?.route?.fieldName;
        const updates: VKeyedCollection = {};
        const entryDataArray = await this.getData(
            config.dbCollections.domains,
            params.route.domainId
        );

        if (IsNotNullOrEmpty(loginUser)) {
            if (domainId) {
                if (
                    fieldName &&
                    DomainFields[fieldName] &&
                    typeof DomainFields[fieldName].setter === 'function'
                ) {
                    if (
                        await checkAccessToEntity(
                            DomainFields[fieldName].set_permissions,
                            loginUser,
                            entryDataArray
                        )
                    ) {
                        const validity = await DomainFields[fieldName].validate(
                            data.set
                        );

                        if (validity) {
                            await DomainFields[fieldName].setter(
                                DomainFields[fieldName].entity_field,
                                entryDataArray,
                                data.set,
                                updates
                            );
                            const result = await this.patchData(
                                config.dbCollections.domains,
                                domainId,
                                updates
                            );
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
                    messages.common_messages_target_domain_notfound
                );
            }
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }
}

