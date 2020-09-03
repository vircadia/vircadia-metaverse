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

import { setupMetaverseAPI, finishMetaverseAPI, tokenFromParams } from '@Route-Tools/middleware';
import { accountFromAuthToken, param1FromParams } from '@Route-Tools/middleware';
import { Accounts } from '@Entities/Accounts';

import { SArray, VKeyedCollection } from '@Tools/vTypes';
import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';

// Get the scope of the logged in account
const procGetUserRoles: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const roles = IsNullOrEmpty(req.vAuthAccount.roles)
              ? []        // if no roles info, return empty list
              : req.vAuthAccount.roles;
    req.vRestResp.Data = {
      'roles': roles
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
  req.vRestResp.respondFailure('cannot add roles this way');
  next();
};

// Remove a roles from my roles list.
const procDeleteUserRole: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (IsNotNullOrEmpty(req.vAuthAccount.roles)) {
      if (SArray.has(req.vAuthAccount.roles, req.vParam1)) {
        SArray.remove(req.vAuthAccount.roles, req.vParam1);

        const updates: VKeyedCollection = {
          'roles': req.vAuthAccount.roles
        };
        Accounts.updateEntityFields(req.vAuthAccount, updates);
      };
    };
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

export const name = '/api/v1/user/roles';

export const router = Router();

router.get(   '/api/v1/user/roles',         [ setupMetaverseAPI,
                                                accountFromAuthToken,// req.vAuthAccount
                                                procGetUserRoles,
                                                finishMetaverseAPI
                                              ] );
router.post(  '/api/v1/user/roles',         [ setupMetaverseAPI,
                                                accountFromAuthToken,// req.vAuthAccount
                                                procPostUserRoles,
                                                finishMetaverseAPI
                                              ] );
router.delete('/api/v1/user/roles/:param1', [ setupMetaverseAPI,
                                                accountFromAuthToken, // req.vAuthAccount
                                                param1FromParams,      // role into req.param1
                                                procDeleteUserRole,
                                                finishMetaverseAPI
                                              ] );