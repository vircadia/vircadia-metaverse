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
import { buildDomainInfo, buildPlaceInfo } from '@Route-Tools/Util';

import { Domains } from '@Entities/Domains';
import { Places } from '@Entities/Places';

import { Logger } from '@Tools/Logging';
import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { AccountScopeFilter } from '@Entities/EntityFilters/AccountScopeFilter';
import { AccountFilterInfo } from '@Entities/EntityFilters/AccountFilterInfo';

import { IsNotNullOrEmpty } from '@Tools/Misc';

// Return places information
// The accounts returned depend on the scope (whether admin) and the search criteria (infoer)
const procGetPlaces: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const pager = new PaginationInfo();

    pager.parametersFromRequest(req);

    // Loop through all the filtered accounts and create array of info
    const places: any[] = [];
    for await (const place of Places.enumerateAsync(pager)) {
      const placeInfo = await buildPlaceInfo(place);
      if (place.domainId) {
        const aDomain = await Domains.getDomainWithId(place.domainId);
        if (IsNotNullOrEmpty(aDomain)) {
          placeInfo.domain = buildDomainInfo(aDomain);

        }
      }
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

export const name = '/api/v1/places';

export const router = Router();

router.get(   '/api/v1/places',                 [ setupMetaverseAPI,      // req.vRestResp
                                                  accountFromAuthToken,   // req.vAuthAccount
                                                  procGetPlaces,
                                                  finishMetaverseAPI ] );
