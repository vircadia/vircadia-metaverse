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
import { BuildAccountInfo } from '@Route-Tools/Util';

import { Accounts } from '@Entities/Accounts';

import { Logger } from '@Tools/Logging';
import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { AccountScopeFilter } from '@Entities/EntityFilters/AccountScopeFilter';
import { AccountFilterInfo } from '@Entities/EntityFilters/AccountFilterInfo';

import { createSimplifiedPublicKey } from '@Route-Tools/Util';

// Return account information
// The accounts returned depend on the scope (whether admin) and the search criteria (infoer)
const procGetAccounts: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procGetAccounts');
  if (req.vAuthAccount) {
    const pager = new PaginationInfo();
    const scoper = new AccountScopeFilter(req.vAuthAccount);
    const infoer = new AccountFilterInfo();
    pager.parametersFromRequest(req);
    scoper.parametersFromRequest(req);
    infoer.parametersFromRequest(req);

    // Loop through all the filtered accounts and create array of info
    const accts: any[] = [];
    for await (const acct of Accounts.enumerateAsync(pager, infoer, scoper)) {
      accts.push(await BuildAccountInfo(req, acct));
    };

    req.vRestResp.Data = {
      accounts: accts
    };
  }
  else {
    req.vRestResp.respondFailure('No account specified');
  };
  next();
};

export const name = '/api/v1/accounts';

export const router = Router();

router.get(   '/api/v1/accounts',                 [ setupMetaverseAPI,      // req.vRestResp
                                                    accountFromAuthToken,   // req.vAuthAccount
                                                    procGetAccounts,
                                                    finishMetaverseAPI ] );