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
import { PlaceFields } from '../../../common/PlaceFields';
import { checkAccessToEntity } from '../../../utils/Permissions';
/**
 * Places.
 * @noInheritDoc
 */
export class PlacesFeild extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * GET Places
     *
     * @remarks
     * Return a list of Places.
     * - Request Type - GET
     * - End Point - API_URL/{placeId}/field/{fieldname}
     *
     * @requires -authentication
     *
     * @param placeId - Place id
     * @param fieldname = field name
     * @returns -  {"status": "success", "data": {"": [{...},{...},...]} or  { status: 'failure', message: 'message'}
     *
     */

    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const fieldName = params?.route?.fieldName;
        const placeId = params?.route?.placeId;
        const entryDataArray = await this.getData(
            config.dbCollections.places,
            placeId as any
        );

        const fieldAccess = PlaceFields[fieldName as any];

        if (IsNotNullOrEmpty(loginUser)) {
            if (placeId && fieldName) {
                if (fieldAccess) {
                    if (
                        await checkAccessToEntity(
                            PlaceFields[fieldName].get_permissions,
                            loginUser,
                            entryDataArray
                        )
                    ) {
                        const objPlace = await this.getData(
                            config.dbCollections.places,
                            placeId
                        );
                        if (IsNotNullOrEmpty(objPlace)) {
                            const data = await PlaceFields[fieldName].getter(
                                objPlace,
                                PlaceFields[fieldName].entity_field
                            );
                            return Promise.resolve({ data });
                        } else {
                            throw new NotFound(
                                messages.common_messages_no_place_by_placeId
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
     * - End Point - API_URL/{placeId}/field/{fieldname}
     *
     * @requires -authentication
     * @param placeId = Url param
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
        const placeId = params?.route?.placeId;
        const fieldName = params?.route?.fieldName;
        const updates: VKeyedCollection = {};

        if (IsNotNullOrEmpty(loginUser)) {
            if (placeId) {
                const entryDataArray = await this.getData(
                    config.dbCollections.places,
                    placeId
                );
                if (
                    fieldName &&
                    PlaceFields[fieldName] &&
                    typeof PlaceFields[fieldName].setter === 'function'
                ) {
                    if (
                        await checkAccessToEntity(
                            PlaceFields[fieldName].set_permissions,
                            loginUser,
                            entryDataArray
                        )
                    ) {
                        const validity = await PlaceFields[fieldName].validate(
                            data.set,
                            loginUser,
                            entryDataArray
                        );

                        if (validity) {
                            await PlaceFields[fieldName].setter(
                                PlaceFields[fieldName].entity_field,
                                entryDataArray,
                                data.set,
                                updates
                            );
                            const result = await this.patchData(
                                config.dbCollections.places,
                                placeId,
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
                    messages.common_messages_no_place_by_placeId
                );
            }
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }
}

