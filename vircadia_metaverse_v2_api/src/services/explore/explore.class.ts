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

import { RequestType } from '../../common/sets/RequestType';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import config from '../../appconfig';
import { Params } from '@feathersjs/feathers';
import {
    buildPlaceInfoSmall,
    buildPlaceInfo,
    getAddressString,
} from '../../common/responsebuilder/placesBuilder';

import { AccountInterface } from '../../common/interfaces/AccountInterface';
import { GenUUID, IsNotNullOrEmpty, IsNullOrEmpty } from '../../utils/Misc';
import { Roles } from '../../common/sets/Roles';
import { BadRequest, NotAuthenticated } from '@feathersjs/errors';
import { SArray } from '../../utils/vTypes';
import { sendEmail } from '../../utils/mail';
import path from 'path';
import fsPromises from 'fs/promises';
import {
    buildCreateUserInfo,
    buildUserInfo,
} from '../../common/responsebuilder/accountsBuilder';
import { PlaceInterface } from '../../common/interfaces/PlaceInterface';
import { DomainInterface } from '../../common/interfaces/DomainInterface';
import { VKeyedCollection } from '../../utils/vTypes';
import { RequestInterface } from '../../common/interfaces/RequestInterface';
import {
    buildSimpleResponse,
    buildPaginationResponse,
} from '../../common/responsebuilder/responseBuilder';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import {
    dateWhenNotOnline,
    couldBeDomainId,
    isAdmin,
    isValidateEmail,
    getGameUserLevel,
    getUtcDate,
} from '../../utils/Utils';
import { messages } from '../../utils/messages';

/**
 * explore.
 * @noInheritDoc
 */
export class Explore extends DatabaseService {
    application: Application;
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
        this.application = app;
    }

    /**
     * Returns the explore
     *
     * @remarks
     * This method is part of the get list of explore
     * - Request Type - GET
     * - End Point - API_URL/explore?per_page=10&filter=friends&status=online ....
     *
     * @params order - ascending or decending
     * @params maturity - adult or unrated or everyone or teen or mature
     * @params tag - get places that have specified tags - (it can , separated).
     * @params search - placeName
     * @param per_page - page size
     * @param page_num - page number
     * @returns - Paginated explore: { data:{explore:[{...},{...}]},current_page:1,per_page:10,total_pages:1,total_entries:5}
     *
     */
    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (IsNotNullOrEmpty(loginUser)) {
            const perPage = parseInt(params?.query?.per_page) || 10;
            const page_num = parseInt(params?.query?.page_num) || 1;
            const skip = (page_num - 1) * perPage;
            const maturity = params?.query?.maturity || '';
            const order = params?.query?.order || '';
            const search = params?.query?.search || '';
            const tag = params?.query?.tag?.split(',');
            const filterQuery: any = {};

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

            const allPlaces = await this.findData(config.dbCollections.places, {
                query: {
                    ...filterQuery,
                    $skip: skip,
                    $limit: perPage,
                },
            });
            const allPlacesData: any[] = [];

            const placesData: PlaceInterface[] =
                allPlaces.data as Array<PlaceInterface>;

            await Promise.all(
                (placesData as Array<PlaceInterface>)?.map(async (place) => {
                    const aDomain = await this.getData(
                        config.dbCollections.domains,
                        place.domainId
                    );

                    if (aDomain && IsNotNullOrEmpty(aDomain.networkAddr)) {
                        const placeDesc: VKeyedCollection = {
                            Domain_Name: place.name,
                        };
                        placeDesc.Address = await getAddressString(place);
                        placeDesc.Visit = 'hifi://' + placeDesc.Address;

                        placeDesc.DomainId = aDomain.id;
                        placeDesc['Network_Address'] = aDomain.networkAddr;
                        placeDesc['Network_Port'] = aDomain.networkPort;

                        placeDesc.Owner = '';
                        if (IsNotNullOrEmpty(aDomain.sponsorAccountId)) {
                            const aAccount = await this.getData(
                                config.dbCollections.accounts,
                                aDomain.sponsorAccountId
                            );

                            if (IsNotNullOrEmpty(aAccount)) {
                                placeDesc.Owner = aAccount.username;
                            }
                        }
                        placeDesc.People = place.currentAttendance ?? 0;

                        placeDesc.Place = await buildPlaceInfoSmall(
                            this,
                            place,
                            aDomain
                        );

                        allPlacesData.push(placeDesc);
                    }
                })
            );

            return Promise.resolve(
                buildPaginationResponse(
                    allPlacesData,
                    page_num,
                    perPage,
                    Math.ceil(allPlaces.total / perPage),
                    allPlaces.total
                )
            );
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }
}

