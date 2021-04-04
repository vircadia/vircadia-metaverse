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

import { setupMetaverseAPI, finishMetaverseAPI, tokenFromParams, accountFromParams } from '@Route-Tools/middleware';
import { accountFromAuthToken, param1FromParams } from '@Route-Tools/middleware';

import { Accounts } from '@Entities/Accounts';
import { VKeyedCollection } from '@Tools/vTypes';

// Get the scope of the logged in account
const procGetField: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (req.vAccount) {
      req.vRestResp.Data = await Accounts.getField(req.vAuthToken, req.vAccount, req.vParam1, req.vAuthAccount);
    }
    else {
      req.vRestResp.respondFailure('Target account not found');
    };
  }
  else {
    req.vRestResp.respondFailure(req.vAccountError ?? 'Not logged in');
  };
  next();
};

// Add a role to my roles collection.
// Not implemented as something needs to be done with request_connection, etc
const procPostField: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vAuthAccount) {
        if (req.vAccount) {
            if (req.body.hasOwnProperty('set')) {
                const updates: VKeyedCollection = {};
                const success = await Accounts.setField(req.vAuthToken, req.vAccount, req.vParam1, req.body.set, req.vAuthAccount, updates);
                if (success.valid) {
                    // Setting worked so update the database
                    Accounts.updateEntityFields(req.vAccount, updates);
                }
                else {
                    req.vRestResp.respondFailure('value could not be set:' + success.reason);
                };
            }
            else {
                req.vRestResp.respondFailure('no set value given');
            };
        }
        else {
            req.vRestResp.respondFailure('Target account not found');
        };
    }
    else {
        req.vRestResp.respondFailure(req.vAccountError ?? 'Not logged in');
    };
    next();
};

export const name = '/api/v1/account/:accountId/field/:fieldname';

export const router = Router();

router.get( '/api/v1/account/:accountId/field/:param1',
                                          [ setupMetaverseAPI,    // req.vRestResp, req.vAuthToken
                                            accountFromAuthToken, // req.vAuthAccount
                                            accountFromParams,    // req.vAccount
                                            param1FromParams,     // req.vParam1
                                            procGetField,
                                            finishMetaverseAPI
                                          ] );
router.post('/api/v1/account/:accountId/field/:param1',
                                          [ setupMetaverseAPI,    // req.vRestResp, req.vAuthToken
                                            accountFromAuthToken, // req.vAuthAccount
                                            accountFromParams,    // req.vAccount
                                            param1FromParams,     // req.vParam1
                                            procPostField,
                                            finishMetaverseAPI
                                          ] );
