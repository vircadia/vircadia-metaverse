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

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI, param1FromParams } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';
import { checkAccessToEntity, Perm } from '@Route-Tools/Permissions';

import { buildPlaceInfo } from '@Route-Tools/Util';

import { Domains } from '@Entities/Domains';
import { Places } from '@Entities/Places';
import { PlaceEntity } from '@Entities/PlaceEntity';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { IsNullOrEmpty } from '@Tools/Misc';

const procGetPlaces: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  const pager = new PaginationInfo();

  pager.parametersFromRequest(req);

  const allPlaces: any[] = [];
  for await (const place of Places.enumerateAsync(pager)) {
    allPlaces.push(await buildPlaceInfo(place));
  };

  req.vRestResp.Data = {
    'places': allPlaces
  };
  next();
};

const procGetPlacesPlaceId: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  const aPlace = await Places.getPlaceWithId(req.vParam1);
  if (aPlace) {
    req.vRestResp.Data = {
      'place': await buildPlaceInfo(aPlace)
    };
  }
  else {
    req.vRestResp.respondFailure('No such place');
  };
  next();
};

// Create a Place
const procPostPlaces: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (req.body.place) {
      const placeSpec: any = req.body.place;
      if (placeSpec.name && placeSpec.address && placeSpec.domainId) {
        const aDomain = await Domains.getDomainWithId(req.body.place.domainId);
        if (aDomain) {
          if (checkAccessToEntity(req.vAuthToken, aDomain, [ Perm.SPONSOR, Perm.ADMIN ], req.vAuthAccount)) {
            const maybePlace = Places.getPlaceWithName(placeSpec.name);
            if (IsNullOrEmpty(maybePlace)) {
              const newPlace = Places.createPlace();
              newPlace.name = placeSpec.name;
              newPlace.description = placeSpec.description;
              newPlace.address = placeSpec.address;
              newPlace.accountId = aDomain.sponsorAccountId;
              newPlace.domainId = aDomain.domainId;
              Places.addPlace(newPlace);

              req.vRestResp.Data = buildPlaceInfo(newPlace);
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
    const pPlace = Places.getPlaceWithId(req.vParam1);
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

// Delete a Place
const procDeletePlacesPlaceId: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount && req.vParam1) {
    const aPlace = await Places.getPlaceWithId(req.vParam1);
    if (aPlace) {
      const aDomain = await Domains.getDomainWithId(aPlace.domainId);
      if (aDomain) {
        if (checkAccessToEntity(req.vAuthToken, aDomain, [ Perm.SPONSOR, Perm.ADMIN ], req.vAuthAccount)) {
          Places.removePlace(aPlace);
        }
        else {
          req.vRestResp.respondFailure('unauthorized');
        };
      }
      else {
        req.vRestResp.respondFailure('associated domain not found');
      };
    }
    else {
      req.vRestResp.respondFailure('no such place');
    };
  }
  else {
    req.vRestResp.respondFailure('no authorization or parameter');
  };
  next();
};

export const name = '/api/v1/user/places';

export const router = Router();

router.get(   '/api/v1/user/places', [ setupMetaverseAPI,   // req.vRESTResp
                                      procGetPlaces,
                                      finishMetaverseAPI ] );
router.post(   '/api/v1/user/places',
                                     [ setupMetaverseAPI,   // req.vRESTResp
                                      accountFromAuthToken, // req.vAuthAccount
                                      procPostPlaces,
                                      finishMetaverseAPI ] );
router.get(   '/api/v1/user/places/:param1',
                                     [ setupMetaverseAPI,   // req.vRESTResp
                                      param1FromParams,     // req.vParam1
                                      procGetPlacesPlaceId,
                                      finishMetaverseAPI ] );
router.delete(   '/api/v1/user/places/:param1',
                                     [ setupMetaverseAPI,   // req.vRESTResp
                                      accountFromAuthToken, // req.vAuthAccount
                                      param1FromParams,     // req.vParam1
                                      procDeletePlacesPlaceId,
                                      finishMetaverseAPI ] );

