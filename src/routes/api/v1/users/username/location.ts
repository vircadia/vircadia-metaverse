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
import { buildLocationInfo } from '@Route-Tools/Util';

import { Perm } from '@Route-Tools/Perm';
import { checkAccessToEntity } from '@Route-Tools/Permissions';

const procGetUserLocation: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (req.vAccount) {
      if (checkAccessToEntity(req.vAuthToken, req.vAccount,
                          [ Perm.OWNER, Perm.FRIEND, Perm.CONNECTION, Perm.ADMIN ], req.vAuthAccount)) {
        req.vRestResp.Data = {
          'location': await buildLocationInfo(req.vAccount)
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

export const name = '/api/v1/users/:accountId/location';

export const router = Router();

// Note the user of :accountId which looks up the username
router.get(   '/api/v1/users/:accountId/location', [ setupMetaverseAPI,   // req.vRESTReq
                                                    accountFromAuthToken, // req.vAuthAccount
                                                    accountFromParams,    // req.vAccount
                                                    procGetUserLocation,
                                                    finishMetaverseAPI ]);