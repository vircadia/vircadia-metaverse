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
import { accountFromAuthToken } from '@Route-Tools/middleware';
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';

import { Logger } from '@Tools/Logging';

const procPostUserActivities: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp) {
    if (req.body.action_name) {
      const activity = req.body.action_name;
      if (req.vAuthAccount) {
        Logger.debug(`procPostUserActivities: Received user activity "${activity}" from ${req.vAuthAccount.username}`);
      }
      else {
        Logger.debug(`procPostUserActivities: Received user activity "${activity}" from unknown user`);
      };
    };
  };
  next();
};

export const name = '/api/v1/user_activities';

export const router = Router();

router.post( '/api/v1/user_activities', [ setupMetaverseAPI,
                                          accountFromAuthToken,
                                          procPostUserActivities,
                                          finishMetaverseAPI ] );