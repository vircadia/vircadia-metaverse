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

import Config from '@Base/config';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI, param1FromParams } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';

import { procGetPlacesPlaceId, procDeletePlacesPlaceId } from '../places/placeId';
import { procPostPlaces } from '../places';

import { buildPlaceInfo } from '@Route-Tools/Util';

import { Places } from '@Entities/Places';
import { Maturity } from '@Entities/Sets/Maturity';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { PlaceFilterInfo } from '@Entities/EntityFilters/PlaceFilterInfo';
import { Domains } from '@Entities/Domains';

const procGetPlaces: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const pager = new PaginationInfo();
    const placer = new PlaceFilterInfo();

    pager.parametersFromRequest(req);
    placer.parametersFromRequest(req);

    const allPlaces: any[] = [];
    for await (const place of Places.enumerateAsync(placer, pager)) {
      // Make sure the place "belongs" to the requestor
      if (place.domainId) {
        const aDomain = await Domains.getDomainWithId(place.domainId);
        if (aDomain && aDomain.sponsorAccountId === req.vAuthAccount.id) {
          allPlaces.push(await buildPlaceInfo(place));
        };
      };
    };

    req.vRestResp.Data = {
      'places': allPlaces,
      'maturity-categories': Maturity.MaturityCategories
    };

    pager.addResponseFields(req);
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

