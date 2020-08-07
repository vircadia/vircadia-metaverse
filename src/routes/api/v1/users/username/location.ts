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
import { accountFromAuthToken, accountFromParams } from '@Route-Tools/middleware';
import { AccountEntity } from '@Entities/AccountEntity';
import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
import { Accounts } from '@Entities/Accounts';
import { Domains } from '@Entities/Domains';

const procGetUserLocation: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (req.vAccount) {
      if (Accounts.CanAccess(req.vAuthAccount, req.vAccount)) {
        req.vRestResp.Data = {
          'location': await buildLocationInfo(req)
        };
      }
      else {
        req.vRestResp.respondFailure('unauthorized');
      }
    }
    else {
      req.vRestResp.respondFailure('target account not found');
    };
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

// The returned location info has many options depending on whether
//    the account has set location and/or has an associated domain.
// Return a structure that represents the target account's domain
async function buildLocationInfo(pReq: Request): Promise<any> {
  const ret: any = {};
  if (IsNotNullOrEmpty(pReq.vAccount.location)) {
    if (pReq.vAccount.location.domainId) {
      const aDomain = await Domains.getDomainWithId(pReq.vAccount.location.domainId);
      if (IsNotNullOrEmpty(aDomain)) {
        return {
          'node_id': pReq.vSession.sessionId,
          'root': {
            'domain': {
              'id': aDomain.domainId,
              'name': aDomain.placeName,
              'network_address': aDomain.networkAddr,
              'ice_server_address': aDomain.iceServerAddr
            },
            'name': aDomain.placeName
          },
          'path': pReq.vAuthAccount.location.path,
          'online': Accounts.isOnline(pReq.vAccount)
        };
      }
      else {
        // The domain doesn't have an ID
        return {
          'node_id': pReq.vSession.sessionId,
          'online': Accounts.isOnline(pReq.vAccount),
          'root': {
            'domain': {
              'network_address': pReq.vAccount.location.networkAddress,
              'network_port': pReq.vAccount.location.networkPort
            }
          }
        };
      };
    };
  };
  ret.node_id = pReq.vSession.sessionId,
  ret.online = Accounts.isOnline(pReq.vAccount)
  return ret;

}

export const name = '/api/v1/users/:username/location';

export const router = Router();

router.get(   '/api/v1/users/:username/location', [ setupMetaverseAPI,    // req.vRESTReq
                                                    accountFromAuthToken, // req.vAuthAccount
                                                    accountFromParams,    // req.vAccount
                                                    procGetUserLocation,
                                                    finishMetaverseAPI ]);