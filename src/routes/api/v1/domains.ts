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

import { Domains } from '@Entities/Domains';
import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { AccountScopeFilter } from '@Entities/EntityFilters/AccountScopeFilter';
import { HTTPStatusCode } from '@Route-Tools/RESTResponse';

import { Logger } from '@Tools/Logging';
import { buildDomainInfoV1 } from '@Route-Tools/Util';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

// GET /domains
const procGetDomains: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procGetDomains');
  if (req.vAuthAccount) {

    const pagination = new PaginationInfo();
    const scoper = new AccountScopeFilter(req.vAuthAccount, "sponsorAccountId");

    pagination.parametersFromRequest(req);
    scoper.parametersFromRequest(req);

    const domainArray: any[] = [];
    for await (const aDomain of Domains.enumerateAsync(scoper, pagination)) {
      domainArray.push( await buildDomainInfoV1(aDomain) );
    };
    req.vRestResp.Data = {
      'domains': domainArray
    };
  }
  else {
    req.vRestResp.respondFailure("Unauthorized");
    req.vRestResp.HTTPStatus = HTTPStatusCode.Unauthorized;
  };
  next();
};

export const name = '/api/v1/domains';

export const router = Router();

router.get(   '/api/v1/domains',                [ setupMetaverseAPI,
                                                  accountFromAuthToken,
                                                  procGetDomains,
                                                  finishMetaverseAPI ] );