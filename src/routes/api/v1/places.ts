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

'use strict'

import Config from '@Base/config';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';
import { buildPlaceInfo } from '@Route-Tools/Util';

import { Domains } from '@Entities/Domains';
import { Places } from '@Entities/Places';

import { Perm } from '@Route-Tools/Perm';
import { checkAccessToEntity } from '@Route-Tools/Permissions';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { PlaceFilterInfo } from '@Entities/EntityFilters/PlaceFilterInfo';
import { VisibilityFilter } from '@Entities/EntityFilters/VisibilityFilter';
import { Maturity } from '@Entities/Sets/Maturity';

import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';
import { placeFields } from '@Entities/PlaceFields';

// Return places information
// As of 20210501, the Places information is public and the requestor does not need to
//    be logged in to fetch all the information about Places. This request is used to
//    create the list of places to explore. This is also related to the fact that scripts
//    do not have authentication information for fetching.
const procGetPlaces: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  // if (req.vAuthAccount) {
    const pager = new PaginationInfo();
    const placer = new PlaceFilterInfo();
    // you can only see friends, connections, etc
    const visibilitier = new VisibilityFilter(req.vAuthAccount);

    pager.parametersFromRequest(req);
    placer.parametersFromRequest(req);
    // NOTE: until the DB uses aggregation queries, visibilitier cannot be used as a criteriaFilter
    visibilitier.parametersFromRequest(req);

    // Loop through all the filtered accounts and create array of info
    const places: any[] = [];
    for await (const place of Places.enumerateAsync(placer, pager)) {
        const aDomain = await Domains.getDomainWithId(place.domainId);
        if (aDomain && IsNotNullOrEmpty(aDomain.networkAddr)) {
            if (await visibilitier.criteriaTestAsync(place, aDomain)) {
                places.push(await buildPlaceInfo(place, aDomain));
            };
        };
    };

    req.vRestResp.Data = {
      'places': places,
      // Maturity catagories added so client knows what is defined in the metaverse-server
      'maturity-categories': Maturity.MaturityCategories
    };

    visibilitier.addResponseFields(req);
    placer.addResponseFields(req);
    pager.addResponseFields(req);
  // }
  // else {
  //   req.vRestResp.respondFailure(req.vAccountError ?? 'Not logged in');
  // };
  next();
};

// Create a Place.
// We receive either the new request with the data under 'place' or
//    the legacy request with some of the data at the top level.
// { 'place_id': id, 'path': path, 'domain_id': id }
export const procPostPlaces: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vAuthAccount) {
        let requestedName: string;
        let requestedDesc: string;
        let requestedAddr: string;
        let requestedDomainId: string;

        if (req.body.place) {
            requestedName = req.body.place.name;
            requestedDesc = req.body.place.description;
            requestedAddr = req.body.place.address;
            requestedDomainId = req.body.place.domainId;
        }
        else {
            requestedName = req.body.place_id;
            requestedAddr = req.body.path;
            requestedDomainId = req.body.domain_id;
        };

        if (requestedName && requestedAddr && requestedDomainId) {
            const aDomain = await Domains.getDomainWithId(requestedDomainId);
            if (aDomain) {
                if (await checkAccessToEntity(req.vAuthToken, aDomain, [ Perm.SPONSOR, Perm.ADMIN ], req.vAuthAccount)) {
                    const ifValid = await placeFields.name.validate(placeFields.name, req.vAuthAccount, requestedName);
                    if (ifValid.valid) {
                        const newPlace = await Places.createPlace(aDomain.sponsorAccountId);
                        newPlace.name = requestedName;
                        newPlace.description = requestedDesc;
                        newPlace.path = requestedAddr;
                        newPlace.domainId = aDomain.id;
                        newPlace.maturity = aDomain.maturity ?? Maturity.UNRATED;
                        newPlace.managers = [ req.vAuthAccount.username ];
                        Places.addPlace(newPlace);

                        req.vRestResp.Data = buildPlaceInfo(newPlace, aDomain);
                    }
                    else {
                        req.vRestResp.respondFailure(ifValid.reason ?? 'place name already exists or is too long');
                    };
                }
                else {
                    req.vRestResp.respondFailure('unauthorized');
                };
            }
            else {
                req.vRestResp.respondFailure('name/address/domainId not specified');
            };
        }
        else {
            req.vRestResp.respondFailure('name, address, and domainId must be specified');
        };
    }
    else {
        req.vRestResp.respondFailure(req.vAccountError ?? 'Not logged in');
    };
    next();
};

export const name = '/api/v1/places';

export const router = Router();

router.get(   '/api/v1/places',   [ setupMetaverseAPI,      // req.vRestResp, req.vAuthToken
                                    accountFromAuthToken,   // req.vAuthAccount
                                    procGetPlaces,
                                    finishMetaverseAPI ] );
router.post(   '/api/v1/places',
                                  [ setupMetaverseAPI,   // req.vRESTResp, req.vAuthToken
                                    accountFromAuthToken, // req.vAuthAccount
                                    procPostPlaces,
                                    finishMetaverseAPI ] );
