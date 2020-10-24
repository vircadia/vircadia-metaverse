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

import os from 'os';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI, param1FromParams } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';

import { Logger } from '@Tools/Logging';
import { Monitoring } from '@Monitoring/Monitoring';

const procGetCategoryStats: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (req.vParam1) {
      if (['os', 'server', 'metaverse'].includes(req.vParam1)) {
        const data:any = {};
        data[req.vParam1] = Monitoring.getStat(req.vParam1)?.Report()

        req.vRestResp.Data = data;
      }
      else {
        req.vRestResp.respondFailure('unknown stat');
      };
    }
    else {
      req.vRestResp.respondFailure('category not specified');
    };
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

export const name = '/api/v1/stats/category/:category';

export const router = Router();

router.get('/api/v1/stats/category/:param1', [ setupMetaverseAPI,      // req.vRestResp
                                         accountFromAuthToken,   // req.vAuthAccount
                                         param1FromParams,       // req.vParam1
                                         procGetCategoryStats,
                                         finishMetaverseAPI ] );
