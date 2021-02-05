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
import { setupMetaverseAPI, finishMetaverseAPI, param1FromParams, placeFromParams } from '@Route-Tools/middleware';

import { Tokens } from '@Entities/Tokens';

import { Places } from '@Entities/Places';

import { IsNotNullOrEmpty, IsNullOrEmpty } from '@Tools/Misc';
import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

interface CurrentBody {
  placeId: string,
  current_api_key: string,
  current_attendance: number,
  current_images: string[],
  current_info: string
};

export const procPostPlaceCurrent: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  const reqBody = req.body as CurrentBody;
  if (IsNotNullOrEmpty(reqBody.placeId)) {
    if (IsNotNullOrEmpty(reqBody.current_api_key)) {
      const aPlace = await Places.getPlaceWithId(reqBody.placeId);
      if (IsNotNullOrEmpty(aPlace)) {
        const apiKey = await Places.getCurrentInfoAPIKey(aPlace);
        if (apiKey) {
          if (apiKey === reqBody.current_api_key) {

            // The apiKey checks out so we're authenticated to update the Place
            const updates: VKeyedCollection = {};
            // Since we are doing just a few fields that are OK because of the APIKey, fake out
            //      the authentication for setting the fields with the special Admin token
            const specialAuth = Tokens.createSpecialAdminToken();

            for (const field of [ 'current_attendance', 'current_images', 'current_info']) {

              // If the requestor is setting a value, make sure it's legal before updating
              if (reqBody.hasOwnProperty(field)) {
                const validity = await Places.validateFieldValue(field, req.body[field]);
                if (validity.valid) {
                  await Places.setField(specialAuth, aPlace, field, req.body[field], undefined, updates);
                }
                else {
                  req.vRestResp.respondFailure(`Value for ${field} is not valid: ${validity.reason}`);
                };
              };
            };
            // Update the database with the new values
            updates.currentLastUpdateTime = new Date();
            await Places.updateEntityFields(aPlace, updates);
          }
          else {
            req.vRestResp.respondFailure('current_api_key does not match Places key');
          };
        }
        else {
          req.vRestResp.respondFailure('Place apikey lookup failed');
        };
      }
      else {
        req.vRestResp.respondFailure('Place specified by placeId does not exist');
      };
    }
    else {
      req.vRestResp.respondFailure('No current_api_key');
    };
  }
  else {
    req.vRestResp.respondFailure('No placeId');
  };
  next();
};

export const name = '/api/v1/places/current';

export const router = Router();

router.post(   '/api/v1/places/current',
                                     [ setupMetaverseAPI,   // req.vRESTResp
                                      procPostPlaceCurrent,
                                      finishMetaverseAPI ] );



