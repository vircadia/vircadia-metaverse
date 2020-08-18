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
import { accountFromAuthToken, usernameFromParams } from '@Route-Tools/middleware';
import { Accounts } from '@Entities/Accounts';

import { VKeyedCollection } from '@Tools/vTypes';
import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
import { Roles } from '@Entities/Roles';

// Get the scope of the logged in account
const procGetUserRoles: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount && req.vAccount) {
    if (Accounts.isAdmin(req.vAuthAccount)) {
      const roles = IsNullOrEmpty(req.vAccount.roles)
                ? []        // if no roles info, return empty list
                : req.vAccount.roles;
      req.vRestResp.Data = {
        'roles': roles
      };
    }
    else {
      req.vRestResp.respondFailure('unauthorized admin');
    };
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  }
  next();
};

// Add a role to my roles collection.
// Not implemented as something needs to be done with request_connection, etc
const procPostUserRoles: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount && req.vAuthAccount) {
    if (Accounts.isAdmin(req.vAuthAccount)) {
      const roles = IsNullOrEmpty(req.vAccount.roles)
                ? []        // if no roles info, return empty list
                : req.vAccount.roles;
      if (Roles.AddRole(roles, req.vTokenId)) {
        const updates: VKeyedCollection = {
          'roles': roles
        };
        Accounts.updateEntityFields(req.vAccount, updates);
      }
      else {
        req.vRestResp.respondFailure('unknown role');
      };
    }
    else {
      req.vRestResp.respondFailure('unauthorized admin');
    };
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

// Remove a friend from my friend list.
const procDeleteUserRole: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount && req.vAuthAccount) {
    if (Accounts.isAdmin(req.vAuthAccount)) {
      if (IsNotNullOrEmpty(req.vAccount.roles)) {
        const idx = req.vAccount.roles.indexOf(req.vTokenId);
        if (idx >= 0) {
          const updates: VKeyedCollection = {
            'roles': req.vAccount.roles.splice(idx, 1)
          };
          Accounts.updateEntityFields(req.vAccount, updates);
        };
      };
    }
    else {
      req.vRestResp.respondFailure('unauthorized admin');
    };
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

export const name = '/api/v1/user/roles';

export const router = Router();

router.get(   '/api/v1/account/:accountId/roles',         [ setupMetaverseAPI,
                                                accountFromAuthToken, // req.vAuthAccount
                                                accountFromParams,    // req.vAccount
                                                procGetUserRoles,
                                                finishMetaverseAPI
                                              ] );
router.post(  '/api/v1/account/:accountId/roles',         [ setupMetaverseAPI,
                                                accountFromAuthToken, // req.vAuthAccount
                                                accountFromParams,    // req.vAccount
                                                procPostUserRoles,
                                                finishMetaverseAPI
                                              ] );
router.delete('/api/v1/account/:accountId/roles/:tokenId', [ setupMetaverseAPI,
                                                accountFromAuthToken, // req.vAuthAccount
                                                accountFromParams,    // req.vAccount
                                                tokenFromParams,      // role to req.vTokenId
                                                procDeleteUserRole,
                                                finishMetaverseAPI
                                              ] );