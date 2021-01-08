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

import { Tokens } from '@Entities/Tokens';
import { AccountScopeFilter } from '@Entities/EntityFilters/AccountScopeFilter';

import { Logger } from '@Tools/Logging';
import { Accounts } from '@Entities/Accounts';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

// Delete a token
// The requestor account has to have authorization to access the toke so
//    either 'vAuthAccount' is an admin or is the same as 'vAccount'.
const procDeleteToken: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp && req.vAuthAccount && req.vAccount && req.vTokenId) {
    const scoper = new AccountScopeFilter(req.vAuthAccount, 'accountId');
    scoper.parametersFromRequest(req);

    const tok = await Tokens.getTokenWithTokenId(req.vTokenId);
    if (tok) {
      if ( scoper.AsAdmin() && Accounts.isAdmin(req.vAuthAccount)
                || req.vAuthAccount.id === tok.accountId) {
        if (req.vAccount.id === tok.accountId) {
          await Tokens.removeToken(tok);
        }
        else {
          req.vRestResp.respondFailure('Token account does not match requested account');
        };
      }
      else {
        req.vRestResp.respondFailure('Unauthorized');
      };
    }
    else {
      req.vRestResp.respondFailure('Token not found');
    }
  };
  next();
};

export const name = '/api/v1/account/:accoundId/tokens/:tokenId';

export const router = Router();

router.delete('/api/v1/account/:accountId/tokens/:tokenId', [ setupMetaverseAPI,  // req.vRestResp, req.vAuthToken
                                                    accountFromAuthToken,   // req.vAuthAccount
                                                    accountFromParams,      // req.vAccount
                                                    tokenFromParams,        // req.vToken
                                                    procDeleteToken,
                                                    finishMetaverseAPI ] );


