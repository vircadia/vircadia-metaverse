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

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';
import { buildPlaceInfo } from '@Route-Tools/Util';

import { Domains } from '@Entities/Domains';
import { Places } from '@Entities/Places';

import { checkAccessToEntity, Perm } from '@Route-Tools/Permissions';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';

import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

// Return places information
// The accounts returned depend on the scope (whether admin) and the search criteria (infoer)
const procGetPlaces: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const pager = new PaginationInfo();

    pager.parametersFromRequest(req);

    // Loop through all the filtered accounts and create array of info
    const places: any[] = [];
    for await (const place of Places.enumerateAsync(pager)) {
      places.push(await buildPlaceInfo(place));
    };

    req.vRestResp.Data = {
      'places': places
    };
  }
  else {
    req.vRestResp.respondFailure('No account specified');
  };
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
          const maybePlace = await Places.getPlaceWithName(requestedName);
          if (IsNullOrEmpty(maybePlace)) {
            const newPlace = Places.createPlace();
            newPlace.name = requestedName;
            newPlace.description = requestedDesc;
            newPlace.address = requestedAddr;
            newPlace.accountId = aDomain.sponsorAccountId;
            newPlace.domainId = aDomain.domainId;
            Places.addPlace(newPlace);

            req.vRestResp.Data = buildPlaceInfo(newPlace, aDomain);
          }
          else {
            req.vRestResp.respondFailure('place name already exists');
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
      req.vRestResp.respondFailure('no domain specified');
    };
  }
  else {
    req.vRestResp.respondFailure('no domain specified');
  };
  next();
};

export const name = '/api/v1/places';

export const router = Router();

router.get(   '/api/v1/places',   [ setupMetaverseAPI,      // req.vRestResp
                                    accountFromAuthToken,   // req.vAuthAccount
                                    procGetPlaces,
                                    finishMetaverseAPI ] );
router.post(   '/api/v1/places',
                                  [ setupMetaverseAPI,   // req.vRESTResp
                                    accountFromAuthToken, // req.vAuthAccount
                                    procPostPlaces,
                                    finishMetaverseAPI ] );
