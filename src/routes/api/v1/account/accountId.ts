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
import { accountFromAuthToken, accountFromParams } from '@Route-Tools/middleware';

import { Perm } from '@Route-Tools/Perm';
import { checkAccessToEntity } from '@Route-Tools/Permissions';
import { buildAccountInfo } from '@Route-Tools/Util';

import { Accounts } from '@Entities/Accounts';

import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

const procGetAccountId: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount && req.vAccount) {
    if (checkAccessToEntity(req.vAuthToken, req.vAccount, [ Perm.OWNER, Perm.ADMIN ])) {
      req.vRestResp.Data = {
        account: await buildAccountInfo(req, req.vAccount)
      };
    }
    else {
      req.vRestResp.respondFailure('Unauthorized');
    };
  }
  else {
    req.vRestResp.respondFailure('No account specified');
  };
  next();
};

// Set changable values on an account.
// The setter must be either an admin account or the account itself
const procPostAccountId: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp) {
    if (req.vAuthAccount && req.vAccount) {
      const valuesToSet = req.body.accounts;
      const updates: VKeyedCollection = {};
      for (const field of [ 'email', 'public_key' ]) {
        if (valuesToSet.hasOwnProperty(field)) {
          await Accounts.setField(req.vAuthToken, req.vAccount, field, valuesToSet.field, req.vAuthAccount, updates);
        };
      };
      if (valuesToSet.hasOwnProperty('images')) {
        if (valuesToSet.images.hero) {
          await Accounts.setField(req.vAuthToken, req.vAccount, 'images_hero', valuesToSet.images.hero, req.vAuthAccount, updates);
        };
        if (valuesToSet.images.tiny) {
          await Accounts.setField(req.vAuthToken, req.vAccount, 'images_tiny', valuesToSet.images.tiny, req.vAuthAccount, updates);
        };
        if (valuesToSet.images.thumbnail) {
          await Accounts.setField(req.vAuthToken, req.vAccount, 'images_thumbnail', valuesToSet.images.thumbnail, req.vAuthAccount, updates);
        };
      };
      await Accounts.updateEntityFields(req.vAuthAccount, updates);
    }
    else {
      req.vRestResp.respondFailure(req.vAccountError ?? 'Accounts not specified');
    };
  };
  next();
};

// Delete an account.
// The setter must be an admin account.
const procDeleteAccountId: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp) {
    if (req.vAuthAccount && req.vAccount) {
      if (Accounts.isAdmin(req.vAuthAccount)) {
        await Accounts.removeAccount(req.vAccount);
        await Accounts.removeAccountContext(req.vAccount);
      };
    };
  };
  next();
};

export const name = '/api/v1/account/:accountId';

export const router = Router();

router.get(  '/api/v1/account/:accountId',        [ setupMetaverseAPI,      // req.vRestResp, req.vAuthToken
                                                    accountFromAuthToken,   // req.vAuthAccount
                                                    accountFromParams,      // req.vAccount
                                                    procGetAccountId,
                                                    finishMetaverseAPI ] );
router.post(  '/api/v1/account/:accountId',       [ setupMetaverseAPI,      // req.vRestResp, req.vAuthToken
                                                    accountFromAuthToken,   // req.vAuthAccount
                                                    accountFromParams,      // req.vAccount
                                                    procPostAccountId,
                                                    finishMetaverseAPI ] );
router.delete('/api/v1/account/:accountId',       [ setupMetaverseAPI,      // req.vRestResp, req.vAuthToken
                                                    accountFromAuthToken,   // req.vAuthAccount
                                                    accountFromParams,      // req.vAccount
                                                    procDeleteAccountId,
                                                    finishMetaverseAPI ] );
