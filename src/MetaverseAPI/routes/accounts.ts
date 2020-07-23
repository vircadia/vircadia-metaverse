//   Copyright 2020 Robert Adams
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
import { setupMetaverseAPI, finishMetaverseAPI } from '../Middleware';
import { accountFromAuthToken, accountFromParams } from '../Middleware';

import { Accounts } from '../../Entities/Accounts';

import { Logger } from '../../Tools/Logging';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

const procGetAccounts: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procGetAccounts');
  if (req.vRestResp) {
    if (req.vAuthAccount) {
      
    }
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

const router = Router();

router.get(   '/api/v1/accounts',                 [ setupMetaverseAPI,
                                                    accountFromAuthToken,
                                                    procGetAccounts,
                                                    finishMetaverseAPI ] );
router.post(  '/api/v1/account/:accountId',       [ setupMetaverseAPI,
                                                    accountFromAuthToken,
                                                    accountFromParams,
                                                    procDeleteAccountId,
                                                    finishMetaverseAPI ] );
router.delete('/api/v1/account/:accountId',       [ setupMetaverseAPI,
                                                    accountFromAuthToken,
                                                    accountFromParams,
                                                    procDeleteAccountId,
                                                    finishMetaverseAPI ] );
router.get(   '/api/v1/account/:accountId/tokens',[ setupMetaverseAPI,
                                                    accountFromAuthToken,
                                                    accountFromParams,
                                                    procGetAccountTokens,
                                                    finishMetaverseAPI ] );
router.delete('/api/v1/account/:accountId/tokens/:tokenId', [ setupMetaverseAPI,
                                                    accountFromAuthToken,
                                                    accountFromParams,
                                                    procDeleteAccountTokens,
                                                    finishMetaverseAPI ] );

export default router;
