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
import { accountFromAuthToken } from '@Route-Tools/middleware';

import { Perm } from '@Route-Tools/Perm';
import { checkAccessToEntity } from '@Route-Tools/Permissions';

import { buildPlaceInfo } from '@Route-Tools/Util';

import { Places } from '@Entities/Places';
import { Maturity } from '@Entities/Sets/Maturity';

import { IsNullOrEmpty } from '@Tools/Misc';
import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

export const procGetPlacesPlaceId: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vPlace) {
    req.vRestResp.Data = {
      'place': await buildPlaceInfo(req.vPlace),
      'maturity-categories': Maturity.MaturityCategories
    };
  }
  else {
    req.vRestResp.respondFailure('No such place');
  };
  next();
};

// Update place information
// This request happens when a domain is being assigned to another domain
export const procPutPlacesPlaceId: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (req.vPlace) {
      if (req.vDomain) {
        if (await checkAccessToEntity(req.vAuthToken, req.vDomain, [ Perm.SPONSOR, Perm.ADMIN ], req.vAuthAccount)) {
          if (req.body.place) {
            const updates: VKeyedCollection = {};
            if (req.body.place.pointee_query) {
              // The caller specified a domain. Either the same domain or changing
              if (req.body.place.pointee_query !== req.vPlace.domainId) {
                Logger.info(`procPutPlacesPlaceId: domain changing from ${req.vPlace.domainId} to ${req.body.place.pointee_query}`)
                req.vPlace.domainId = req.body.place.pointee_query;
                updates.domainId = req.vPlace.domainId;
              };
            };
            for (const field of [ 'path', 'address', 'description', 'thumbnail' ]) {
              if (req.body.place.hasOwnProperty(field)) {
                await Places.setField(req.vAuthToken, req.vPlace, field, req.body.place[field], req.vAuthAccount, updates);
              };
            };
            Places.updateEntityFields(req.vPlace, updates);
          }
          else {
            req.vRestResp.respondFailure('badly formed data');
          };
        }
        else {
          req.vRestResp.respondFailure('unauthorized');
        };
      }
      else {
        req.vRestResp.respondFailure('Target domain not found');
      };
    }
    else {
      req.vRestResp.respondFailure('Target place not found');
    };
  }
  else {
    req.vRestResp.respondFailure(req.vAccountError ?? 'Not logged in');
  };
  next();
};
// Delete a Place
export const procDeletePlacesPlaceId: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (req.vPlace) {
      if (await checkAccessToEntity(req.vAuthToken, req.vDomain, [ Perm.SPONSOR, Perm.ADMIN ], req.vAuthAccount)) {
        Logger.info(`procDeletePlacesPlaceId: deleting place "${req.vPlace.name}", id=${req.vPlace.id}`);
        await Places.removePlace(req.vPlace);
      }
      else {
        req.vRestResp.respondFailure('unauthorized');
      };
    }
    else {
      req.vRestResp.respondFailure('Target place not found');
    };
  }
  else {
    req.vRestResp.respondFailure(req.vAccountError ?? 'Not logged in');
  };
  next();
};

export const name = '/api/v1/places/:placeId';

export const router = Router();

router.get(   '/api/v1/places/:placeId',
                                     [ setupMetaverseAPI,   // req.vRESTResp
                                      placeFromParams,      // req.vPlace, req.vDomain
                                      procGetPlacesPlaceId,
                                      finishMetaverseAPI ] );
router.put( '/api/v1/places/:placeId',
                                     [ setupMetaverseAPI,   // req.vRESTResp
                                      accountFromAuthToken, // req.vAuthAccount
                                      placeFromParams,      // req.vPlace, req.vDomain
                                      procPutPlacesPlaceId,
                                      finishMetaverseAPI ] );
router.delete( '/api/v1/places/:placeId',
                                     [ setupMetaverseAPI,   // req.vRESTResp
                                      accountFromAuthToken, // req.vAuthAccount
                                      placeFromParams,      // req.vPlace, req.vDomain
                                      procDeletePlacesPlaceId,
                                      finishMetaverseAPI ] );


