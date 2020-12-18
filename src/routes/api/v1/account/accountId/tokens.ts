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

import { AccountScopeFilter } from '@Entities/EntityFilters/AccountScopeFilter';
import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { GenericFilter } from '@Entities/EntityFilters/GenericFilter';

import { Logger } from '@Tools/Logging';
import { Tokens } from '@Entities/Tokens';
import { AuthToken } from '@Entities/AuthToken';

// Return the tokens for the specified account.
// One needs to be an admin in order to see other than one's own tokens
const procGetAccountTokens: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp && req.vAuthAccount && req.vAccount) {
    const pager = new PaginationInfo();
    const scoper = new AccountScopeFilter(req.vAuthAccount, 'accountId');
    pager.parametersFromRequest(req);
    scoper.parametersFromRequest(req);
    const acctFilter = new GenericFilter( { 'accountId': req.vAccount.id } );

    const toks: AuthToken[] = [];
    for await (const tok of Tokens.enumerateAsync(acctFilter, pager, scoper)) {
      toks.push(tok);
    };
    req.vRestResp.Data = {
      'tokens': toks
    };

    pager.addResponseFields(req);
  };
  next();
  next();
};

export const name = '/api/v1/account/:accountId/tokens';

export const router = Router();

router.get(   '/api/v1/account/:accountId/tokens',[ setupMetaverseAPI,
                                                    accountFromAuthToken,   // vRestResp.vAuthAccount
                                                    accountFromParams,      // vRestResp.vAccount
                                                    procGetAccountTokens,
                                                    finishMetaverseAPI ] );