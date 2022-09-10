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
import { Params, NullableId, Id } from '@feathersjs/feathers';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../../declarations';
import config from '../../../appconfig';
import { buildPlaceInfo } from '../../../common/responsebuilder/placesBuilder';
import {
    IsNotNullOrEmpty,
    IsNullOrEmpty,
    GenUUID,
    genRandomString,
} from '../../../utils/Misc';
import { messages } from '../../../utils/messages';
import {
    buildPaginationResponse,
    buildSimpleResponse,
} from '../../../common/responsebuilder/responseBuilder';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
import { BadRequest, NotAuthenticated, NotFound } from '@feathersjs/errors';
import { VKeyedCollection } from '../../../utils/vTypes';
import { PlaceInterface } from '../../../common/interfaces/PlaceInterface';
import { Maturity } from '../../../common/sets/Maturity';
import { Perm } from '../../../utils/Perm';
import { checkAccessToEntity } from '../../../utils/Permissions';
import { Tokens, TokenScope } from '../../../utils/Tokens';
import { PlaceFields } from '../../../common/PlaceFields';
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
     * - End Point - API_URL/api/v1/user/places
     *
     * @requires -authentication
     *
     * @returns -  {"status": "success", "data": {"": [{...},{...},...]} or  { status: 'failure', message: 'message'}
     *
     */

    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const perPage = parseInt(params?.query?.per_page) || 10;
        const page = parseInt(params?.query?.page) || 1;
        const skip = (page - 1) * perPage;

        // const places: any[] = [];
        const allPlaces = await this.findData(config.dbCollections.places, {
            query: {
                $skip: skip,
                $limit: perPage,
            },
        });

        const placesData: PlaceInterface[] =
            allPlaces.data as Array<PlaceInterface>;

        const domainIds = (placesData as Array<PlaceInterface>)
            ?.map((item) => item.domainId)
            .filter(
                (value, index, self) =>
                    self.indexOf(value) === index && value !== undefined
            );

        const domains = await this.findDataToArray(
            config.dbCollections.domains,
            {
                query: {
                    id: { $in: domainIds },
                    sponsorAccountId: loginUser.id,
                },
            }
        );

        const places: any[] = [];

        (placesData as Array<PlaceInterface>)?.forEach(async (element) => {
            let DomainInterface: DomainInterface | undefined;
            for (const domain of domains) {
                if (domain && domain.id === element.domainId) {
                    DomainInterface = domain;
                    break;
                }
            }
            if (DomainInterface) {
                places.push(
                    await buildPlaceInfo(this, element, DomainInterface)
                );
            }
        });

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

    /**
     * GET place
     *
     * @remarks
     * Get the place information for one place.
     * - Request Type - GET
     * - End Point - API_URL/api/v1/user/places
     * @requires @param placeId - Place id (Url param)
     * @returns - {"status": "success","data": {"places": [{"placeId": string,"name": string,"displayName": string,"visibility": string,"path": string,"address": string,"description": string,"maturity": string,"tags": string[],"managers": string[],"domain": {"id": domainId,"name": domainName,"sponsorAccountId": string,"network_address": string,"ice_server_address": string,'version': string,'protocol_version': string,'active': boolean,"time_of_last_heartbeat": ISOStringDate,"time_of_last_heartbeat_s": integerUnixTimeSeconds,"num_users": integer},"thumbnail": URL,"images": [ URL, URL, ... ],"current_attendance": number,"current_images": string[],"current_info": string,"current_last_update_time": ISOStringDate,"current_last_update_time_s": integerUnixTimeSeconds},...],"maturity-categories": string[]}} or  { status: 'failure', message: 'message'}
     *
     */

    async get(id: Id, params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
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

            if (
                await checkAccessToEntity(
                    [Perm.DOMAINACCESS, Perm.ADMIN],
                    loginUser,
                    loginUser
                )
            ) {
                let key: string;
                try {
                    const keyToken = await this.getData(
                        config.dbCollections.tokens,
                        placeData.currentAPIKeyTokenId
                    );
                    key = keyToken?.token;
                    newPlaceData.current_api_key = key;
                } catch (err) {}
            }

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
     * POST place
     *
     * @remarks
     * This method is part of the edit place and set value by field
     * - Request Type - POST
     * - End Point - API_URL/api/v1/user/places
     *
     * @requires -authentication
     * - Access - DomainAccess , Admin
     * @param body =   {
     *                   "name": placeName,
     *                   "description": descriptionText,
     *                   "address": addressString,
     *                   "domainId": domainIds
     *                  }
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async create(data: any, params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        let requestedName: string;
        let requestedDesc: string | undefined;
        let requestedAddr: string;
        let requestedDomainId: string;

        if (data?.place) {
            requestedName = data.place.name;
            requestedDesc = data.place.description;
            requestedAddr = data.place.address;
            requestedDomainId = data.place.domainId;
        } else {
            requestedName = data.place_id;
            requestedAddr = data.path;
            requestedDomainId = data.domain_id;
        }

        if (IsNotNullOrEmpty(loginUser)) {
            if (requestedName && requestedAddr && requestedDomainId) {
                const aDomain = await this.getData(
                    config.dbCollections.domains,
                    requestedDomainId
                );

                if (IsNotNullOrEmpty(aDomain)) {
                    if (IsNullOrEmpty(aDomain.networkAddr)) {

                        throw new BadRequest(
                            'Domain does not have a network address'
                        );
                    }
                    if (
                        await checkAccessToEntity(
                            [Perm.SPONSOR, Perm.MANAGER, Perm.ADMIN],
                            loginUser,
                            aDomain
                        )
                    ) {
                        const ifValid = await PlaceFields.name.validate(
                            requestedName,
                            loginUser,
                            loginUser
                        );
                        if (ifValid) {
                            const newPlace: any = {};
                            newPlace.id = GenUUID();
                            newPlace.name = 'UNKNOWN-' + genRandomString(5);
                            newPlace.path = '/0,0,0/0,0,0,1';
                            newPlace.whenCreated = new Date();
                            newPlace.currentAttendance = 0;

                            const APItoken = await Tokens.createToken(
                                aDomain.sponsorAccountId,
                                [TokenScope.PLACE],
                                -1
                            );
                            await this.createData(
                                config.dbCollections.tokens,
                                APItoken
                            );
                            newPlace.currentAPIKeyTokenId = APItoken.id;
                            newPlace.name = requestedName;
                            newPlace.description = requestedDesc;
                            newPlace.path = requestedAddr;
                            newPlace.domainId = aDomain.id;
                            newPlace.maturity =
                                aDomain.maturity ?? Maturity.UNRATED;
                            newPlace.managers = [loginUser.username];

                            await this.createData(
                                config.dbCollections.places,
                                newPlace
                            );
                            const place = await buildPlaceInfo(
                                this,
                                newPlace,
                                aDomain
                            );
                            return Promise.resolve(buildSimpleResponse(place));
                        } else {
							throw new BadRequest("Invalid place name");
						}
                    } else {
						throw new NotAuthenticated(messages.common_messages_unauthorized);
					}
                } else {
					throw new BadRequest(messages.common_domainId_notFound);
				}
            } else {
				throw new BadRequest(messages.common_messages_parameter_missing);
			}
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }

    /**
     * Delete user place
     *
     * @remarks
     * This method is part of the edit place and set value by field
     * - Request Type - DELETE
     * - End Point - API_URL/api/v1/user/places/:placeId
     *
     * @requires -authentication
     * - Access - DomainAccess , Admin
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */
    async remove(id: NullableId, params?: Params | undefined): Promise<any> {
        if (IsNotNullOrEmpty(params?.user)) {
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
}
