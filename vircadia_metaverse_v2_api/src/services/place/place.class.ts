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

import { AuthToken } from './../../common/interfaces/AuthToken';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import { messages } from '../../utils/messages';
import config from '../../appconfig';
import { PlaceInterface } from '../../common/interfaces/PlaceInterface';
import { DomainInterface } from '../../common/interfaces/DomainInterface';
import { Maturity } from '../../common/sets/Maturity';
import { GenUUID, IsNotNullOrEmpty } from '../../utils/Misc';
import { buildPlaceInfo } from '../../common/responsebuilder/placesBuilder';
import { Id, NullableId, Params } from '@feathersjs/feathers';
import trim from 'trim';
import { Tokens, TokenScope } from '../../utils/Tokens';
import {
    buildPaginationResponse,
    buildSimpleResponse,
} from '../../common/responsebuilder/responseBuilder';
import { getUtcDate, isAdmin } from '../../utils/Utils';
import {
    NotAcceptable,
    BadRequest,
    NotFound,
    NotAuthenticated,
} from '@feathersjs/errors';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import { AccountInterface } from '../../common/interfaces/AccountInterface';
import _ from 'lodash';
import { Visibility } from '../../common/sets/Visibility';
/**
 * Place.
 * @noInheritDoc
 */
export class Place extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * POST place
     *
     * @remarks
     * This method is part of the POST place
     * - Create a place entry. A place points to a domain so creation information contains a domainId of the domain the place points to.
     * - The address is formatted as "/x,y,z/x,y,z,w".
     * - Request Type - POST
     * - End Point - API_URL/place
     * - Access - DomainAccess , Admin
     * - The requestor must be either an admin account or the account associated with the domain.
     *
     * @requires -authentication
     * @param requestBody -  {"name": placeName,"description": descriptionText,"address": addressString,"domainId": domainId}
     * @returns - {"status": "success","data": {"places": [{"placeId": string,"name": string,"displayName": string,"visibility": string,"path": string,"address": string,"description": string,"maturity": string,"tags": string[],"managers": string[],"domain": {"id": domainId,"name": domainName,"sponsorAccountId": string,"network_address": string,"ice_server_address": string,'version': string,'protocol_version': string,'active': boolean,"time_of_last_heartbeat": ISOStringDate,"time_of_last_heartbeat_s": integerUnixTimeSeconds,"num_users": integer},"thumbnail": URL,"images": [ URL, URL, ... ],"current_attendance": number,"current_images": string[],"current_info": string,"current_last_update_time": ISOStringDate,"current_last_update_time_s": integerUnixTimeSeconds},...],"maturity-categories": string[]}} or  { status: 'failure', message: 'message'}
     *
     */

    async create(data: any, params: any): Promise<any> {
        if (params.user) {
            const requestedName = trim(data.name);
            const requestedDesc = trim(data.description);
            const requestedAddr = trim(data.address);
            const requestedDomainId = trim(data.domainId);

            if (requestedName && requestedAddr && requestedDomainId) {
                const domainData = await this.getData(
                    config.dbCollections.domains,
                    requestedDomainId
                );
                if (domainData) {
                    const placeData = await this.findDataToArray(
                        config.dbCollections.places,
                        { name: requestedName }
                    );
                    const placeName = (placeData as Array<PlaceInterface>)?.map(
                        (item) => item.name
                    );
                    if (!placeName.includes(requestedName)) {
                        const aToken: AuthToken = await Tokens.createToken(
                            domainData.sponsorAccountId,
                            [TokenScope.PLACE],
                            -1
                        );
                        const TokenData = await this.createData(
                            config.dbCollections.tokens,
                            aToken
                        );
                        if (IsNotNullOrEmpty(TokenData)) {
                            const postPlace: any = {};
                            postPlace.id = GenUUID();
                            postPlace.whenCreated = getUtcDate();
                            postPlace.currentAttendance = 0;
                            postPlace.currentAPIKeyTokenId = TokenData.id;
                            postPlace.name = requestedName;
                            postPlace.description = requestedDesc;
                            postPlace.path = requestedAddr;
                            postPlace.domainId = domainData.id;
                            postPlace.maturity =
                                domainData.maturity ?? Maturity.UNRATED;
                            postPlace.managers = [params.user.username];

                            await this.createData(
                                config.dbCollections.places,
                                postPlace
                            );
                            const place = await buildPlaceInfo(
                                this,
                                postPlace,
                                domainData
                            );
                            return Promise.resolve(buildSimpleResponse(place));
                        }
                    } else {
                        throw new NotAcceptable(
                            messages.common_messages_place_exists
                        );
                    }
                } else {
                    throw new NotFound(
                        messages.common_messages_name_address_domainId_not_specific
                    );
                }
            } else {
                throw new BadRequest(
                    messages.common_messages_name_address_domainId_must_specific
                );
            }
        } else {
            throw new BadRequest(messages.common_messages_not_logged_in);
        }
    }

    /**
     * GET place
     *
     * @remarks
     * Get the place information for one place.
     * - Request Type - GET
     * - End Point - API_URL/place/{placeId}
     * - Access - DomainAccess , Admin
     * - The requestor must be either an admin account or the account associated with the domain.
     *
     * @requires @param placeId - Place id (Url param)
     * @returns - {"status": "success","data": {"places": [{"placeId": string,"name": string,"displayName": string,"visibility": string,"path": string,"address": string,"description": string,"maturity": string,"tags": string[],"managers": string[],"domain": {"id": domainId,"name": domainName,"sponsorAccountId": string,"network_address": string,"ice_server_address": string,'version': string,'protocol_version': string,'active': boolean,"time_of_last_heartbeat": ISOStringDate,"time_of_last_heartbeat_s": integerUnixTimeSeconds,"num_users": integer},"thumbnail": URL,"images": [ URL, URL, ... ],"current_attendance": number,"current_images": string[],"current_info": string,"current_last_update_time": ISOStringDate,"current_last_update_time_s": integerUnixTimeSeconds},...],"maturity-categories": string[]}} or  { status: 'failure', message: 'message'}
     *
     */

    async get(id: Id): Promise<any> {
        if (IsNotNullOrEmpty(id) && id) {
            const placeData = await this.getData(
                config.dbCollections.places,
                id
            );
            const DomainData = await this.getData(
                config.dbCollections.domains,
                placeData.domainId
            );

            const newPlaceData = await buildPlaceInfo(
                this,
                placeData,
                DomainData
            );
            const data = {
                place: newPlaceData,
                'maturity-categories': Maturity.MaturityCategories,
            };
            return Promise.resolve(buildSimpleResponse(data));
        } else {
            throw new NotFound(messages.common_messages_no_such_place);
        }
    }

    /**
     * Delete Place
     *
     * @remarks
     * This method is part of the delete place
     * - Delete the place entry.
     * - The requestor must be either an admin account or the account associated with the domain.
     * - Request Type - DELETE
     * - End Point - API_URL/place/{placeId}
     * - Access - DomainAccess , Admin
     *
     * @requires @param acct  Place id (Url param)
     * @requires -authentication
     * @returns - {status: 'success'} or { status: 'failure', message: 'message'}
     *
     */

    async remove(id: NullableId, params: any): Promise<any> {
        if (IsNotNullOrEmpty(params.user)) {
            if (IsNotNullOrEmpty(id) && id) {
                await this.deleteData(config.dbCollections.places, id);
            } else {
                throw new NotFound(
                    messages.common_messages_target_place_notfound
                );
            }
        } else {
            throw new NotAuthenticated(messages.common_messages_not_logged_in);
        }
    }

    /**
     * Update place
     *
     * @remarks
     * Update the place information.
     * - If the field "place.pointee_query" is passed, that is presumed to be the ID of the domain that should be associated with the Place.
     * - Request Type - Update
     * - End Point - API_URL/place/{placeId}
     * - Access - DomainAccess , Admin
     * - The requestor must be either an admin account or the account associated with the domain.
     *
     * @requires @param placeId - Place id (Url param)
     * @param requestBody - {'pointee_query': domainId,'path': stringAddress,'description': string,'thumbnail': stringURL}
     * @returns - {"status": "success"} or  { status: 'failure', message: 'message'}
     *
     */

    async update(id: Id, data: any, params: Params): Promise<any> {
        if (params.user) {
            if (IsNotNullOrEmpty(id) && id) {
                if (IsNotNullOrEmpty(data)) {
                    const updatePlace: any = {};

                    const getPlaceData = await this.getData(
                        config.dbCollections.places,
                        id
                    );
                    // The caller specified a domain. Either the same domain or changing
                    if (data.place.pointee_query !== getPlaceData.domainId) {
                        updatePlace.domainId = trim(data.place.pointee_query);
                    }
                    if (IsNotNullOrEmpty(data?.place.description)) {
                        updatePlace.description = trim(data.place.description);
                    }
                    if (IsNotNullOrEmpty(data?.place.path)) {
                        updatePlace.path = trim(data.place.path);
                    }
                    if (IsNotNullOrEmpty(data?.place.thumbnail)) {
                        updatePlace.thumbnail = trim(data.place.thumbnail);
                    }
                    await this.patchData(
                        config.dbCollections.places,
                        id,
                        updatePlace
                    );
                } else {
                    throw new BadRequest(
                        messages.common_messages_badly_formed_data
                    );
                }
            } else {
                throw new NotFound(
                    messages.common_messages_target_place_notfound
                );
            }
        } else {
            throw new NotAuthenticated(messages.common_messages_not_logged_in);
        }
    }

    /**
     * GET all place
     *
     * @remarks
     * Get the list of places. Returns all the places.
     * - Request Type - GET
     * - End Point - API_URL/place
     *
     * @params order - ascending or decending
     * @params maturity - adult or unrated or everyone or teen or mature
     * @params tag - get places that have specified tags - (it can , separated).
     * @params search - placeName
     * @param per_page - page size
     * @param page_num - page number
     * @param status - "online" - filter domains that have heartbeat, "active" - filter domains with connected users/avatars
     * @param active_threshold - filter by minutes past since last heartbeat
     * @returns - {"status": "success","data": {"places": [{"placeId": string,"name": string,"displayName": string,"visibility": string,"path": string,"address": string,"description": string,"maturity": string,"tags": string[],"managers": string[],"domain": {"id": domainId,"name": domainName,"sponsorAccountId": string,"network_address": string,"ice_server_address": string,'version': string,'protocol_version': string,'active': boolean,"time_of_last_heartbeat": ISOStringDate,"time_of_last_heartbeat_s": integerUnixTimeSeconds,"num_users": integer},"thumbnail": URL,"images": [ URL, URL, ... ],"current_attendance": number,"current_images": string[],"current_info": string,"current_last_update_time": ISOStringDate,"current_last_update_time_s": integerUnixTimeSeconds},...],"maturity-categories": string[]}} or  { status: 'failure', message: 'message'}
     *
     */

    async find(params: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const perPage = parseInt(params?.query?.per_page) || 10;
        const page = parseInt(params?.query?.page) || 1;
        const skip = (page - 1) * perPage;
        const maturity = params?.query?.maturity || '';
        const order = params?.query?.order || '';
        const search = params?.query?.search || '';
        const status = params?.query?.status;
        const activeThreshold = params?.query?.active_threshold;
        const tag = params?.query?.tag?.split(',');
        const filterQuery: any = {};
        const domainFilterQuery: any = {};
        let asAdmin = params?.query?.asAdmin;
        if (
            asAdmin &&
            IsNotNullOrEmpty(loginUser) &&
            isAdmin(loginUser as AccountInterface)
        ) {
            asAdmin = true;
        } else {
            asAdmin = false;
        }

        if (status === "online") {
            domainFilterQuery.active = true;
        } else if (status === "active") {
            filterQuery.currentAttendance = { $gt: 0 };
        }

        if (undefined !== activeThreshold) {
            var activeThresholdTime = new Date();
            activeThresholdTime.setMinutes(activeThresholdTime.getMinutes() - activeThreshold);
            domainFilterQuery.timeOfLastHeartbeat = {
                $gt: activeThresholdTime
            };
        }

        if (IsNotNullOrEmpty(maturity)) {
            filterQuery.maturity = maturity;
        }

        if (IsNotNullOrEmpty(search)) {
            filterQuery.name = search;
        }

        if (IsNotNullOrEmpty(tag)) {
            filterQuery.tag = { $in: tag };
        }

        if (IsNotNullOrEmpty(order)) {
            filterQuery.$sort = {
                whenCreated: order == 'descending' ? -1 : 1,
            };
        }

        const allDomains = await this.findDataToArray(config.dbCollections.domains, {
			query: {
                ...domainFilterQuery,
				networkAddr: { $exists: true },
				$limit: 1000
			}
		});
		const allDomainIds = allDomains.map(domain => domain.id);

        const myDomains = await this.findDataToArray(config.dbCollections.domains, {
			query: {
				networkAddr: { $exists: true },
				sponsorAccountId: loginUser?.id,
				$limit: 1000
			}
		});
		const myDomainIds = myDomains.map(domain => domain.id);

		if (!asAdmin)
		{
			filterQuery.$or = [
				{ visibility: { $exists: false } }, // if 'visibility' is not specified, assume "OPEN"
				{ visibility: Visibility.OPEN },
				{ visibility: Visibility.PRIVATE, domainId: { $in: myDomainIds } }
			];
		}

        const allPlaces = await this.findData(config.dbCollections.places, {
            query: {
                ...filterQuery,
                domainId: { $in: allDomainIds },
                $skip: skip,
                $limit: perPage,
            },
        });

        const placesData: PlaceInterface[] =
            allPlaces.data as Array<PlaceInterface>;

        const places = await Promise.all(placesData.map(data =>
            buildPlaceInfo(this, data, allDomains.find(domain => domain.id === data.domainId))
        ));

        const data = {
            places: places,
            'maturity-categories': Maturity.MaturityCategories,
        };
        return Promise.resolve(
            buildPaginationResponse(
                data,
                page,
                perPage,
                Math.ceil(allPlaces.total / perPage),
                allPlaces.total
            )
        );
    }
}
