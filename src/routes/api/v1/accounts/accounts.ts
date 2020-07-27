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
import { tokenFromParams } from '@Route-Tools/middleware';

import { Accounts } from '@Entities/Accounts';

import { Logger } from '@Tools/Logging';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

const procGetAccounts: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procGetAccounts');
  if (req.vAuthAccount) {
    req.vRestResp.Data = {
      accounts: [
        {
          'username': 'fred',
          'accountId': 'lksjdlfaeoiraskjdlkhz832ad',
        },
        {
          'username': 'wilma',
          'accountId': 'a89s798sduhfiuwhqfohohawev',
        }
      ]
    };
  }
  else {
    req.vRestResp.respondFailure('No account specified');
  };
  next();
};

const procPostAccountId: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};

const procDeleteAccountId: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};

const procGetAccountTokens: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};

const procDeleteAccountTokens: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};

export const name = 'accounts';

export const router = Router();

router.get(   '/api/v1/accounts',                 [ setupMetaverseAPI,
                                                    accountFromAuthToken,   // vRestResp.vAuthAccount
                                                    procGetAccounts,
                                                    finishMetaverseAPI ] );
router.post(  '/api/v1/account/:accountId',       [ setupMetaverseAPI,
                                                    accountFromAuthToken,   // vRestResp.vAuthAccount
                                                    accountFromParams,
                                                    procDeleteAccountId,
                                                    finishMetaverseAPI ] );
router.delete('/api/v1/account/:accountId',       [ setupMetaverseAPI,
                                                    accountFromAuthToken,   // vRestResp.vAuthAccount
                                                    accountFromParams,      // vRestResp.vAccount
                                                    procDeleteAccountId,
                                                    finishMetaverseAPI ] );
router.get(   '/api/v1/account/:accountId/tokens',[ setupMetaverseAPI,
                                                    accountFromAuthToken,   // vRestResp.vAuthAccount
                                                    accountFromParams,      // vRestResp.vAccount
                                                    procGetAccountTokens,
                                                    finishMetaverseAPI ] );
router.delete('/api/v1/account/:accountId/tokens/:tokenId', [ setupMetaverseAPI,
                                                    accountFromAuthToken,   // vRestResp.vAuthAccount
                                                    accountFromParams,      // vRestResp.vAccount
                                                    tokenFromParams,        // vRestResp.vToken
                                                    procDeleteAccountTokens,
                                                    finishMetaverseAPI ] );

