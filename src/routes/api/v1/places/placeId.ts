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

import { Accounts } from '@Entities/Accounts';
import { Places } from '@Entities/Places';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { AccountScopeFilter } from '@Entities/EntityFilters/AccountScopeFilter';
import { IsNullOrEmpty } from '@Tools/Misc';

const procGetPlaces: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const scoper = new AccountScopeFilter(req.vAuthAccount);
    const pager = new PaginationInfo();

    scoper.parametersFromRequest(req);
    pager.parametersFromRequest(req);

    const allPlaces: any[] = [];
    for await (const place of Places.enumerateAsync(scoper, pager)) {
      allPlaces.push(await buildPlaceInfo(place));
    };

    req.vRestResp.Data = {
      'places': allPlaces
    };
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

export const procGetPlacesPlaceId: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  let aPlace = await Places.getPlaceWithId(req.vParam1);
  if (IsNullOrEmpty(aPlace)) {
    // the request can be made for the ID or the placename
    aPlace = await Places.getPlaceWithName(req.vParam1);
  }
  if (aPlace) {
    if (checkAccessToEntity(req.vAuthToken, aPlace, [ Perm.OWNER, Perm.ADMIN ], req.vAuthAccount)) {
      req.vRestResp.Data = {
        'place': await buildPlaceInfo(aPlace)
      };
    }
    else {
      req.vRestResp.respondFailure('unauthorized');
    };
  }
  else {
    req.vRestResp.respondFailure('No such place');
  };
  next();
};

// Delete a Place
export const procDeletePlacesPlaceId: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount && req.vParam1) {
    const aPlace = await Places.getPlaceWithId(req.vParam1);
    if (aPlace) {
      if (req.vAuthAccount.id === aPlace.accountId || Accounts.isAdmin(req.vAuthAccount)) {
          await Places.removePlace(aPlace);
      }
      else {
        req.vRestResp.respondFailure('unauthorized');
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

export const name = '/api/v1/places/:placeId';

export const router = Router();

router.get(   '/api/v1/places/:param1',
                                     [ setupMetaverseAPI,   // req.vRESTResp
                                      param1FromParams,     // req.vParam1
                                      procGetPlacesPlaceId,
                                      finishMetaverseAPI ] );
router.delete( '/api/v1/places/:param1',
                                     [ setupMetaverseAPI,   // req.vRESTResp
                                      accountFromAuthToken, // req.vAuthAccount
                                      param1FromParams,     // req.vParam1
                                      procDeletePlacesPlaceId,
                                      finishMetaverseAPI ] );


