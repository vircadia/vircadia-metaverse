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
import { setupMetaverseAPI, finishMetaverseAPI, finishReturnData  } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';

import { Accounts } from '@Entities/Accounts';
import { Places } from '@Entities/Places';
import { Domains } from '@Entities/Domains';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { PlaceFilterInfo } from '@Entities/EntityFilters/PlaceFilterInfo';

import { IsNotNullOrEmpty, IsNullOrEmpty } from '@Tools/Misc';
import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

const procGetExplore: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  const pager = new PaginationInfo();
  const placer = new PlaceFilterInfo();

  pager.parametersFromRequest(req);
  placer.parametersFromRequest(req);

  const allPlaces: any[] = [];
  for await (const place of Places.enumerateAsync(placer, pager)) {
    const aDomain = await Domains.getDomainWithId(place.domainId);
    if (aDomain && IsNotNullOrEmpty(aDomain.networkAddr)) {
      const placeDesc: VKeyedCollection = {
        'Domain Name': place.name,
      };
      placeDesc.Address = Places.getAddressString(place);
      placeDesc.Visit = 'hifi://' + placeDesc.Address;

      placeDesc.DomainId = aDomain.id;
      placeDesc['Network Address'] = aDomain.networkAddr;
      placeDesc['Network Port'] = aDomain.networkPort;

      // If there is a sponsoring account, add the domain owner to the place description
      placeDesc.Owner = '';
      if (IsNotNullOrEmpty(aDomain.sponsorAccountId)) {
        const aAccount = await Accounts.getAccountWithId(aDomain.sponsorAccountId);
        if (IsNotNullOrEmpty(aAccount)) {
          placeDesc.Owner = aAccount.username;
        };
      };

      // 'People' is number of people at place for old Explore script
      placeDesc.People = aDomain.numUsers + aDomain.anonUsers;

      placeDesc.Attendance = Places.getCurrentAttendance(place);
      placeDesc.CurrentImages = place.currentImages;
      placeDesc.CurrentInfo = place.currentInfo;

      allPlaces.push(placeDesc);
    };
  };
  req.vRestResp.Data = allPlaces;

  placer.addResponseFields(req);
  pager.addResponseFields(req);

  next();
};

export const name = '/explore';

export const router = Router();

router.get(   '/explore.json', [ setupMetaverseAPI,    // req.vRESTResp, req.vAuthToken
                                 accountFromAuthToken, // req.vAuthAccount
                                 procGetExplore,
                                 finishReturnData
                                ] );