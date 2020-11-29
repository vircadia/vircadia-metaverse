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

import { setupMetaverseAPI, finishMetaverseAPI, domainFromParams } from '@Route-Tools/middleware';
import { accountFromAuthToken, param1FromParams } from '@Route-Tools/middleware';

import { Domains } from '@Entities/Domains';
import { VKeyedCollection } from '@Tools/vTypes';

// Get the scope of the logged in account
const procGetField: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount && req.vDomain) {
    req.vRestResp.Data = await Domains.getField(req.vAuthToken, req.vDomain, req.vParam1);
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  }
  next();
};

// Add a role to my roles collection.
// Not implemented as something needs to be done with request_connection, etc
const procPostField: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount && req.vDomain) {
    const updates: VKeyedCollection = {};
    const success = await Domains.setField(req.vAuthToken, req.vDomain, req.vParam1,
                                      req.body.set, req.vAuthAccount, updates);
    if (success.valid) {
      // Setting worked so update the database
      Domains.updateEntityFields(req.vDomain, updates);
    }
    else {
      req.vRestResp.respondFailure('value could not be set: ' + success.reason);
    };
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

export const name = '/api/v1/domains/:domainId/field/:fieldname';

export const router = Router();

router.get( '/api/v1/domains/:domainId/field/:param1',
                                          [ setupMetaverseAPI,    // req.vRestResp
                                            accountFromAuthToken, // req.vAuthAccount
                                            domainFromParams,     // req.vDomain
                                            param1FromParams,     // req.vParam1
                                            procGetField,
                                            finishMetaverseAPI
                                          ] );
router.post('/api/v1/domains/:domainId/field/:param1',
                                          [ setupMetaverseAPI,    // req.vRestResp
                                            accountFromAuthToken, // req.vAuthAccount
                                            domainFromParams,     // req.vDomain
                                            param1FromParams,     // req.vParam1
                                            procPostField,
                                            finishMetaverseAPI
                                          ] );

