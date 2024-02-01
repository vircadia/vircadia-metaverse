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
import { NullableId } from '@feathersjs/feathers';
import config from '../../appconfig';
import { buildLocationInfo } from '../../common/responsebuilder/placesBuilder';
import { IsNotNullOrEmpty } from '../../utils/Misc';
import { BadRequest, NotAuthenticated } from '@feathersjs/errors';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import { messages } from '../../utils/messages';
import { Perm } from '../../utils/Perm';
import { checkAccessToEntity } from '../../utils/Permissions';

/**
 * Location.
 * @noInheritDoc
 */
export class Location extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Update location
     *
     * @remarks
     * This method is part of the update location
     * - Request Type - PUT
     * - End Point - API_URL/location
     *
     * @requires -authentication
     * @param requestBody - {
     *                "networkAddress":"network address",
     *                "nodeId":"",
     *                "availability":[],
     *                "path": "/X,Y,Z/X,Y,Z,W",
     *                "connected": false,
     *                "placeId":"random-place-id",
     *                "domainId":"random-domain-id"}
     * @returns -     {"status": "success","data": {"location": { "root": {"domain": {"id":"","network_address":"","network_port":"","ice_server_address":"","name":""},"name": placeName,},"path": "/X,Y,Z/X,Y,Z,W","online": bool}}} or { status: 'failure', message: 'message'}
     *
     */

    async update(id: NullableId, data: any, params: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (loginUser?.id) {
            if (data) {
                const locationData = data;
                const newDataObject: any = {};
                if (IsNotNullOrEmpty(locationData.networkAddress)) {
                    newDataObject.locationNetworkAddress =
                        locationData.networkAddress;
                }
                if (IsNotNullOrEmpty(locationData.nodeId)) {
                    newDataObject.locationNodeId = locationData.nodeId;
                }
                if (IsNotNullOrEmpty(locationData.path)) {
                    newDataObject.locationPath = locationData.path;
                }
                if (
                    IsNotNullOrEmpty(locationData.connected) &&
                    typeof locationData.connected === 'boolean'
                ) {
                    newDataObject.locationConnected = locationData.connected;
                }
                if (IsNotNullOrEmpty(locationData.placeId)) {
                    newDataObject.locationPlaceId = locationData.placeId;
                }
                if (IsNotNullOrEmpty(locationData.domainId)) {
                    newDataObject.locationDomainId = locationData.domainId;
                }
                if (IsNotNullOrEmpty(locationData.availability)) {
                    newDataObject.availability = locationData.availability;
                }

                await this.patchData(
                    config.dbCollections.accounts,
                    loginUser.id,
                    newDataObject
                );
                const account = await this.getData(
                    config.dbCollections.accounts,
                    loginUser.id
                );
                let DomainInterface: any;
                if (IsNotNullOrEmpty(account.locationDomainId)) {
                    DomainInterface = await this.getData(
                        config.dbCollections.domains,
                        account.locationDomainId
                    );
                }
                const location = await buildLocationInfo(
                    account,
                    DomainInterface
                );
                return Promise.resolve(
                    buildSimpleResponse({ location: location })
                );
            } else {
                throw new BadRequest(
                    messages.common_messages_badly_formed_request
                );
            }
        } else {
            throw new NotAuthenticated(messages.common_messages_not_logged_in);
        }
    }

    /**
     * GET location
     *
     * @remarks
     * This method is part of the get location
     * - Request Type - GET
     * - End Point - API_URL/location
     *
     * @requires -authentication
     * @returns - {"status": "success","data": {"location": { "root": {"domain": {"id":"","network_address":"","network_port":"","ice_server_address":"","name":""},"name": placeName,},"path": "/X,Y,Z/X,Y,Z,W","online": bool}}} or { status: 'failure', message: 'message'}
     *
     */

    async find(params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const accountId = params.route?.accountId;

        const accountEntity = await this.getData(
            config.dbCollections.accounts,
            accountId
        );

        if (loginUser) {
            if (
                await checkAccessToEntity(
                    [Perm.OWNER, Perm.FRIEND, Perm.CONNECTION, Perm.ADMIN],
                    loginUser,
                    accountEntity
                )
            ) {
                const domain = await this.getData(
                    config.dbCollections.domains,
                    loginUser.locationDomainId
                );
                const location = await buildLocationInfo(loginUser, domain);
                return Promise.resolve(buildSimpleResponse({ location }));
            }
        } else {
            throw new NotAuthenticated(messages.common_messages_not_logged_in);
        }
    }
}
