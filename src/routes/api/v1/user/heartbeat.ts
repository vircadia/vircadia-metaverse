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

import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';
import { updateLocationInfo } from '@Route-Tools/Util';

import { Accounts } from '@Entities/Accounts';

import { IsNotNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

const procPutUserHeartbeat: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const updates = await updateLocationInfo(req);
    if (IsNotNullOrEmpty(updates)) {
      updates.timeOfLastHeartbeat = new Date();
      await Accounts.updateEntityFields(req.vAuthAccount, updates);
      if (IsNotNullOrEmpty(req.vAuthAccount.locationNodeId)) {
        req.vRestResp.Data = {
          // 'session_id': req.vSession.id
          'session_id': req.vAuthAccount.locationNodeId
        };
      };
    };
  }
  else {
    req.vRestResp.respondFailure(req.vAccountError ?? 'Not logged in');
  };
  next();
};

export const name = '/api/v1/user/heartbeat';

export const router = Router();

router.put( '/api/v1/user/heartbeat', [ setupMetaverseAPI,
                                        accountFromAuthToken,
                                        procPutUserHeartbeat,
                                        finishMetaverseAPI
                                      ] );

