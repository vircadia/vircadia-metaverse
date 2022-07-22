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

import { BadRequest, NotAuthenticated } from '@feathersjs/errors';
import { NullableId, Paginated, Params } from '@feathersjs/feathers';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';
import { Application } from '../../declarations';
import { IsNotNullOrEmpty } from '../../utils/Misc';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import { messages } from '../../utils/messages';
import { VKeyedCollection } from '../../utils/vTypes';
import { AccountFields } from '../../common/AccountFields';
import { checkAccessToEntity } from '../../utils/Permissions';
import config from '../../appconfig';

/**
 * Users.
 * @noInheritDoc
 */
export class UsersHeartbeat extends DatabaseService {
    application: Application;
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
        this.application = app;
    }

    /**
     * Update location
     *
     * @remarks
     * This method is part of the update location
     * - Request Type - PUT
     * - End Point - API_URL/api/v1/user/heartbeat
     *
     * @requires -authentication
     * @param requestBody - {
     *                           "location":{
     *                                      "connected" : "true",
     *                                       "path" : ""
     *                                       "place_id" : "",
     *                                       "domain_id" : "",
     *                                       "network_address": "",
     *                                       "node_id" : "",
     *                                       "availability":""
     *                                      }
     *                      }
     * @returns -     {"status": "success","data": {"location": { "root": {"domain": {"id":"","network_address":"","network_port":"","ice_server_address":"","name":""},"name": placeName,},"path": "/X,Y,Z/X,Y,Z,W","online": bool}}} or { status: 'failure', message: 'message'}
     *
     */

    async update(id: NullableId, data: any, params: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const newLoc: VKeyedCollection = {};
        if (IsNotNullOrEmpty(loginUser)) {
            if (data.location) {
                // updates.timeOfLastHeartbeat = new Date();
                for (const field of [
                    'connected',
                    'path',
                    'place_id',
                    'domain_id',
                    'network_address',
                    'node_id',
                    'availability',
                ]) {
                    if (data.location.hasOwnProperty(field)) {
                        if (
                            await checkAccessToEntity(
                                AccountFields[field].set_permissions,
                                loginUser,
                                loginUser
                            )
                        ) {
                            const validatity = await AccountFields[
                                field
                            ].validate(data.location[field]);

                            if (validatity) {
                                newLoc[AccountFields[field].entity_field] =
                                    data.location[field];
                            }
                        } else {
                            throw new BadRequest(
                                messages.common_messsages_cannot_set_field
                            );
                        }
                    }
                }
                await this.patchData(
                    config.dbCollections.accounts,
                    loginUser.id,
                    newLoc
                );

                if (IsNotNullOrEmpty(loginUser.locationNodeId)) {
                    return Promise.resolve(
                        buildSimpleResponse({
                            session_id: loginUser.locationNodeId,
                        })
                    );
                }
            } else {
                throw new BadRequest('location not found');
            }
        } else {
            throw new NotAuthenticated(messages.common_messages_not_logged_in);
        }
    }

    async find(params?: Params | undefined): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const user = {
            username: loginUser.username,
            accountid: loginUser.id,
            xmpp_password: loginUser.xmppPassword,
            discourse_api_key: loginUser.discourseApiKey,
            wallet_id: loginUser.walletId,
        };
        return Promise.resolve(buildSimpleResponse({ user }));
    }
}

