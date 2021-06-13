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

import { setupMetaverseAPI, finishMetaverseAPI, tokenFromParams, accountFromParams, placeFromParams } from '@Route-Tools/middleware';
import { accountFromAuthToken, param1FromParams, param2FromParams } from '@Route-Tools/middleware';

import { Places } from '@Entities/Places';

import { VKeyedCollection } from '@Tools/vTypes';
import { IsNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

// Get a field from a place entry
const procGetField: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vPlace && req.vParam1) {
    req.vRestResp.Data = await Places.getField(req.vAuthToken, req.vPlace, req.vParam1, req.vAuthAccount);
  }
  else {
    req.vRestResp.respondFailure('no such place');
  };
  next();
};

// Change a field in a place
const procPostField: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vAuthAccount) {
        if (req.vPlace && req.vParam1) {
            if (req.body.hasOwnProperty('set')) {
                const updates: VKeyedCollection = {};
                const success = await Places.setField(req.vAuthToken, req.vPlace, req.vParam1, req.body.set, req.vAuthAccount, updates);
                if (success.valid) {
                    // Setting worked so update the database
                    Places.updateEntityFields(req.vPlace, updates);
                }
                else {
                    req.vRestResp.respondFailure('value could not be set: ' + success.reason);
                };
            }
            else {
                req.vRestResp.respondFailure('no set value given');
            };
        }
        else {
            req.vRestResp.respondFailure('no such place');
        };
    }
    else {
        req.vRestResp.respondFailure(req.vAccountError ?? 'Not logged in');
    };
    next();
};

export const name = '/api/v1/places/:placeId/field/:fieldname';

export const router = Router();

router.get( '/api/v1/places/:placeId/field/:param1',
                                          [ setupMetaverseAPI,    // req.vRestResp
                                            placeFromParams,      // req.vPlace
                                            param1FromParams,     // req.vParam1 (field name)
                                            procGetField,
                                            finishMetaverseAPI
                                          ] );
router.post('/api/v1/places/:placeId/field/:param1',
                                          [ setupMetaverseAPI,    // req.vRestResp
                                            accountFromAuthToken, // req.vAuthAccount
                                            placeFromParams,      // req.vPlace
                                            param1FromParams,     // req.vParam1 (field name)
                                            procPostField,
                                            finishMetaverseAPI
                                          ] );

