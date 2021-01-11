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
import { buildAccountProfile } from '@Route-Tools/Util';

import { Accounts } from '@Entities/Accounts';

import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

const procGetProfileAccountId: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAccount) {
    if (await checkAccessToEntity(req.vAuthToken, req.vAccount, [ Perm.PUBLIC, Perm.OWNER, Perm.ADMIN ])) {
      req.vRestResp.Data = {
        account: await buildAccountProfile(req, req.vAccount)
      };
    }
    else {
      req.vRestResp.respondFailure('Unauthorized');
    };
  }
  else {
    req.vRestResp.respondFailure('Target account not found');
  };

  next();
};

export const name = '/api/v1/profile/:accountId';

export const router = Router();

router.get(  '/api/v1/profile/:accountId',        [ setupMetaverseAPI,  // req.vRestResp
                                                    accountFromParams,  // req.vAccount
                                                    procGetProfileAccountId,
                                                    finishMetaverseAPI ] );