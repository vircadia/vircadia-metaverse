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

import { Logger } from '@Tools/Logging';
import { Accounts } from '@Entities/Accounts';
import { IsNotNullOrEmpty } from '@Tools/Misc';
import { Roles } from '@Entities/Roles';

// Temporary maint function to create the first admin account
const procMakeWilmaAdmin: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp) {
    const wilma = await Accounts.getAccountWithUsername("wilma");
    if (IsNotNullOrEmpty(wilma)) {
      if (Roles.HasRole(wilma.roles, Roles.ADMIN)) {
        Logger.debug('procMakeWilmaAdmin: wilma already has role "admin"');
      }
      else {
        Roles.AddRole(wilma.roles, Roles.ADMIN);
        Logger.debug(`procMakeWilmaAdmin: added role ADMIN to wilma: ${wilma.roles}`);
        const update = {
          'roles': wilma.roles
        };
        Accounts.updateEntityFields(wilma, update);
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



