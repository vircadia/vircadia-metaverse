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

import { Tokens, TokenScope } from '@Entities/Tokens';

import { Logger } from '@Tools/Logging';
import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { AccountScopeFilter } from '@Entities/EntityFilters/AccountScopeFilter';

const procGetTokens: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procGetTokens');
  if (req.vAuthAccount) {
    const pager = new PaginationInfo();
    const scoper = new AccountScopeFilter(req.vAuthAccount, 'accountId');
    pager.parametersFromRequest(req);
    scoper.parametersFromRequest(req);

    // Loop through all the filtered accounts and create array of info
    const toks: any[] = [];
    for await (const tok of Tokens.enumerateAsync(pager, scoper)) {
      toks.push({
        'tokenId': tok.id,
        'id': tok.id,
        'token': tok.token,
        'accountId': tok.accountId,
        'refresh_token': tok.refreshToken,
        'scope': tok.scope,
        'creation_time': tok.whenCreated ? tok.whenCreated.toISOString() : undefined,
        'expiration_time': tok.expirationTime ? tok.expirationTime.toISOString() : undefined,
      });
    };

    req.vRestResp.Data = {
      tokens: toks
    };

    pager.addResponseFields(req);
  }
  else {
    req.vRestResp.respondFailure('No account specified');
  };
  next();
};

export const name = '/api/v1/tokens';

export const router = Router();

router.get(   '/api/v1/tokens',                 [ setupMetaverseAPI,
                                                  accountFromAuthToken,   // vRestResp.vAuthAccount
                                                  procGetTokens,
                                                  finishMetaverseAPI ] );