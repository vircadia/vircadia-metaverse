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

import { Config } from '@Base/config';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';

import { Logger } from '@Tools/Logging';
import { Accounts } from '@Entities/Accounts';
import { IsNotNullOrEmpty } from '@Tools/Misc';
import { AccountRoles } from '@Entities/AccountRoles';

import { SArray } from '@Tools/vTypes';

// Temporary maint function to create the first admin account
const procMakeWilmaAdmin: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  let adminAccountName =  Config["metaverse-server"]["base-admin-account"] ?? 'wilma';
  if (req.vRestResp) {
    const adminAccount = await Accounts.getAccountWithUsername(adminAccountName);
    if (IsNotNullOrEmpty(adminAccount)) {
      if (SArray.has(adminAccount.roles, AccountRoles.ADMIN)) {
        Logger.debug(`procMakeWilmaAdmin: ${adminAccountName} already has role "admin"`);
      }
      else {
        SArray.add(adminAccount.roles, AccountRoles.ADMIN);
        Logger.debug(`procMakeWilmaAdmin: added role ADMIN to ${adminAccountName}: ${adminAccount.roles}`);
        const update = {
          'roles': adminAccount.roles
        };
        Accounts.updateEntityFields(adminAccount, update);
      };
    }
    else {
      Logger.error(`procMakeWilmaAdmin: could not fetch account "wilma"`);
      req.vRestResp.respondFailure('no such account');
    };
  };
  next();
};

export const name = '/api/maint/makeWilmaAdmain';

export const router = Router();

router.get('/api/maint/makeWilmaAdmin',  [ setupMetaverseAPI,
                                           procMakeWilmaAdmin,
                                           finishMetaverseAPI ] );



