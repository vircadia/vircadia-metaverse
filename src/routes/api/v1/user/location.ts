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

import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';

import { Accounts } from '@Entities/Accounts';
import { setDiscoverability } from '@Entities/AccountEntity';

import { VKeyedCollection } from '@Tools/vTypes';
import { IsNotNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

const procPutUserLocation: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (req.body.location) {
      try {
        // build location from what is in the account already
        const newLoc: VKeyedCollection = IsNotNullOrEmpty(req.vAuthAccount.location) ? req.vAuthAccount.location : {};
        const loc = req.body.location;
        if (loc.hasOwnProperty('connected'))       newLoc.connected = loc.connected;
        if (loc.hasOwnProperty('place'))           newLoc.place = loc.place;
        if (loc.hasOwnProperty('place_id'))        newLoc.placeId = loc.place_id;
        if (loc.hasOwnProperty('domain_id'))       newLoc.domainId = loc.domain_id;
        if (loc.hasOwnProperty('network_address')) newLoc.networkAddress = loc.network_address;
        if (loc.hasOwnProperty('network_port'))    newLoc.networkPort = loc.network_port;
        if (loc.hasOwnProperty('node_id'))         newLoc.nodeId = loc.node_id;
        if (loc.hasOwnProperty('discoverability')) {
          if (! setDiscoverability(req.vAuthAccount, loc.discoverability)) {
            const disc = loc.discoverability;
            Logger.debug(`procPutUserLocation: defaulting discoverability to "none" because passed odd value ${disc} by ${req.vAuthAccount.username}`);
            setDiscoverability(req.vAuthAccount, 'none');
          };
        };
        await Accounts.updateEntityFields(req.vAuthAccount, { 'location': newLoc });
      }
      catch ( err ) {
        Logger.error(`procPutUserLocation: exception parsing put from ${req.vAuthAccount.username}: ${err}`);
        req.vRestResp.respondFailure(`exception parsing request: ${err}`);
      };
    };
  }
  else {
    req.vRestResp.respondFailure('auth token did not work');
  };
  next();
};

export const name = '/api/v1/user/location';

export const router = Router();

router.put( '/api/v1/user/location',  [ setupMetaverseAPI,
                                        accountFromAuthToken,
                                        procPutUserLocation,
                                        finishMetaverseAPI
                                      ] );
