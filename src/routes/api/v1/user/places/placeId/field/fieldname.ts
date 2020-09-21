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
import { accountFromAuthToken, param1FromParams, param2FromParams } from '@Route-Tools/middleware';

import { Places } from '@Entities/Places';
import { getPlaceField, setPlaceField } from '@Entities/PlaceEntity';

import { checkAccessToEntity } from '@Route-Tools/Permissions';

import { VKeyedCollection } from '@Tools/vTypes';
import { IsNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

// Get the scope of the logged in account
const procGetField: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vParam1 && req.vParam2) {
    const aPlace = await Places.getPlaceWithId(req.vParam1);
    if (aPlace) {
      req.vRestResp.Data = await getPlaceField(req.vAuthToken, aPlace, req.vParam2, req.vAuthAccount);
    }
    else {
        req.vRestResp.respondFailure('no such place');
    };
  }
  else {
    req.vRestResp.respondFailure('bad format');
  };
  next();
};

// Add a role to my roles collection.
// Not implemented as something needs to be done with request_connection, etc
const procPostField: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount && req.vParam1 && req.vParam2) {
    let aPlace = await Places.getPlaceWithId(req.vParam1);
    if (IsNullOrEmpty(aPlace)) {
      // Places can be looked up by their name as well as their ID.
      Logger.debug(`procPostField: couldn't find with placeId. Trying name of "${req.vParam1}"`);
      aPlace = await Places.getPlaceWithName(req.vParam1);
    };
    if (aPlace) {
      if (req.body.hasOwnProperty('set')) {
        const updates: VKeyedCollection = {};
        if (await setPlaceField(req.vAuthToken, aPlace, req.vParam2, req.body.set, req.vAuthAccount, updates)) {
          // Setting worked so update the database
          Places.updateEntityFields(aPlace, updates);
        }
        else {
          req.vRestResp.respondFailure('value could not be set');
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
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

export const name = '/api/v1/user/place/:placeId/field/:fieldname';

export const router = Router();

router.get( '/api/v1/user/place/:param1/field/:param2',
                                          [ setupMetaverseAPI,    // req.vRestResp
                                            param1FromParams,     // req.vParam1
                                            param2FromParams,     // req.vParam2
                                            procGetField,
                                            finishMetaverseAPI
                                          ] );
router.post('/api/v1/user/place/:param1/field/:param2',
                                          [ setupMetaverseAPI,    // req.vRestResp
                                            accountFromAuthToken, // req.vAuthAccount
                                            param1FromParams,     // req.vParam1
                                            param2FromParams,     // req.vParam2
                                            procPostField,
                                            finishMetaverseAPI
                                          ] );

