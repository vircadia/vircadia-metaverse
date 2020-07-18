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

'use strict';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

const procGetDomainsDomainid: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procGetDomains: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procPutDomains: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procDeleteDomains: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procPutDomainsIceServerAddress: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procPostDomainsTemporary: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procPutDomainsPublicKey: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procGetDomainsPublicKey: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};

const router = Router();

router.get(   '/domains/:domainId',             procGetDomainsDomainid);
router.get(   '/domains',                       procGetDomains);
router.put(   '/domains/:domainId',             procPutDomains);
router.delete('/domains/:domainId',             procDeleteDomains);

router.put(   '/domains/:domainId/ice_server_address', procPutDomainsIceServerAddress);
router.post(  '/domains/temporary',             procPostDomainsTemporary);

router.put(   '/domains/:domainId/public_key',  procPutDomainsPublicKey);
router.get(   '/domains/:domainId/public_key',  procGetDomainsPublicKey);

export default router;
