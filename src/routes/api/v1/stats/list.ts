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

const procGetStatList: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const statInfo: any[] = [];
    for (const stat of Monitoring.getStats()) {
      statInfo.push({
        'name': stat.name,
        'category': stat.category,
        'unit': stat.unit
      });
    };
    req.vRestResp.Data = {
      'stats': statInfo
    };
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

export const name = '/api/v1/stats/list';

export const router = Router();

router.get('/api/v1/stats/list', [ setupMetaverseAPI,      // req.vRestResp
                                   accountFromAuthToken,   // req.vAuthAccount
                                   procGetStatList,
                                   finishMetaverseAPI ] );

