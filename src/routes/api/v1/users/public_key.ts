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

import { accountFromParams } from '@Route-Tools/middleware';

import { Logger } from '@Tools/Logging';
import { createSimplifiedPublicKey, convertBinKeyToPEM } from '@Route-Tools/Util';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

const procGetUsersPublicKey: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAccount) {
    req.vRestResp.Data = {
      'public_key': createSimplifiedPublicKey(req.vAccount.sessionPublicKey),
      'username': req.vAccount.username,
      'accountid': req.vAccount.id
    };
  }
  else {
    req.vRestResp.respondFailure('Target account not found');
  };
  next();
};

export const name = '/api/v1/users/:accoundId/public_key';

export const router = Router();

router.get(   '/api/v1/users/:accountId/public_key', [ setupMetaverseAPI,
                                                      accountFromParams,  // vRESTResp.vAccount
                                                      procGetUsersPublicKey,
                                                      finishMetaverseAPI ] );