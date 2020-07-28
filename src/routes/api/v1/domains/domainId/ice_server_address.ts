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
import { domainFromParams, domainAPIkeyFromBody, verifyDomainAccess } from '@Route-Tools/middleware';

import { Logger } from '@Tools/Logging';

// PUT /domains/:domainId/ice_server_address
const procPutDomainsIceServerAddress: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procPutDomainsIceServerAddress');
  if (req.vDomain) {
    if (req.body && req.body.domain && req.body.domain.ice_server_address) {
      req.vDomain.iceServerAddr = req.body.domain.ice_server_address;
    };
  }
  else {
    req.vRestResp.respondFailure(req.vDomainError ?? 'unauthorized');
  };
next();
};

export const name = '/api/v1/domains/:domainId/ice_server_address';

export const router = Router();

router.put(   '/api/v1/domains/:domainId/ice_server_address', [ setupMetaverseAPI,
                                                  domainFromParams,
                                                  domainAPIkeyFromBody,
                                                  verifyDomainAccess,
                                                  procPutDomainsIceServerAddress,
                                                  finishMetaverseAPI ] );
