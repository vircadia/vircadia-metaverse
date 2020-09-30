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

import { procGetPlacesPlaceId, procDeletePlacesPlaceId } from '../places/placeId';
import { procPostPlaces } from '../places';

import { buildPlaceInfo } from '@Route-Tools/Util';

import { Places } from '@Entities/Places';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { AccountScopeFilter } from '@Entities/EntityFilters/AccountScopeFilter';

const procGetPlaces: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const scoper = new AccountScopeFilter(req.vAuthAccount, 'accountId');
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

export const name = '/api/v1/user/places';

export const router = Router();

// Some of these are under 'user' as that was a legacy configuration.
router.get(   '/api/v1/user/places', [ setupMetaverseAPI,   // req.vRESTResp
                                      accountFromAuthToken, // req.vAuthAccount
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

