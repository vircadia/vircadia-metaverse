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
import { param1FromParams, param2FromParams, param3FromParams } from '@Route-Tools/middleware';

import { getObject } from '@Tools/Db';

import { Logger } from '@Tools/Logging';
import { Accounts } from '@Entities/Accounts';
import { IsNotNullOrEmpty } from '@Tools/Misc';
import { Roles } from '@Entities/Roles';

// A maint function for admin account that lets one get any object in any collection
const procMaintRaw: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp && req.vAuthAccount) {
    if (Accounts.isAdmin(req.vAuthAccount)) {
      if (req.vParam1 && req.vParam2 && req.vParam3) {
        const collection = req.vParam1;
        const field = req.vParam2;
        const value = req.vParam3;
        const criteria: any = {};
        criteria[field] = value;
        req.vRestResp.Data = await getObject(collection, criteria);
      }
      else {
        req.vRestResp.respondFailure('parameters missing');
      };
    }
    else {
      req.vRestResp.respondFailure('not admin');
    };
  };
  next();
};

export const name = '/api/maint/raw/';

export const router = Router();

router.get('/api/maint/raw/:param1/:param2/:param3', [ setupMetaverseAPI,
                                          accountFromAuthToken,
                                          param1FromParams,
                                          param2FromParams,
                                          param3FromParams,
                                          procMaintRaw,
                                          finishMetaverseAPI ] );




