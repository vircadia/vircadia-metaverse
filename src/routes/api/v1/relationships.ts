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

'use strict'

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';

import { Relationships } from '@Entities/Relationships';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { RelationshipScopeFilter } from '@Entities/EntityFilters/RelationshipScopeFilter';
import { Logger } from '@Tools/Logging';

const procGetRelationships: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const pager = new PaginationInfo();
    const scoper = new RelationshipScopeFilter(req.vAuthAccount);
    pager.parametersFromRequest(req);
    scoper.parametersFromRequest(req);

    // Loop through all the filtered accounts and create array of info
    const rels: any[] = [];
    for await (const aRel of Relationships.enumerateAsync(scoper, pager)) {
      const thisRel: any = {
        'id': aRel.id,
        'type': aRel.relationshipType,
        'from_id': aRel.fromId,
        'to_id': aRel.toId,
        'when_created': aRel.whenCreated ? aRel.whenCreated.toISOString() : undefined,
        'expiration_time': aRel.expirationTime ? aRel.expirationTime.toISOString() : undefined
      };
      rels.push(thisRel);
    };

    req.vRestResp.Data = {
      relationships: rels
    };
  }
  else {
    req.vRestResp.respondFailure('No account specified');
  };
  next();
};

export const name = '/api/v1/relationships';

export const router = Router();

router.get(   '/api/v1/relationships',                 [ setupMetaverseAPI,
                                                  accountFromAuthToken,   // vRestResp.vAuthAccount
                                                  procGetRelationships,
                                                  finishMetaverseAPI ] );
