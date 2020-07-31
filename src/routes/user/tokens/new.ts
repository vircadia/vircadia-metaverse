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

import { Tokens } from '@Entities/Tokens';

const procGetUserTokensNew: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp && req.vAuthAccount) {
    const forDomainServer = req.query.for_domain_server;
    const scope = forDomainServer ? 'domain' : 'owner';
    const tokenInfo = await Tokens.createToken(req.vAuthAccount.accountId, scope, 1000);

    const body = `<center><h2>Your domain's access token is ${tokenInfo.token}</h2></center>`;
    resp.setHeader('content-type', 'text/html');
    resp.send(body);
  }
};

export const name = '/user/tokens/new';

export const router = Router();

router.get(  '/user/tokens/new',  setupMetaverseAPI,
                                  accountFromAuthToken,
                                  procGetUserTokensNew);
