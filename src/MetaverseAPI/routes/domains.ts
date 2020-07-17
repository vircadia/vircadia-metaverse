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

const proc_get_domains_domainid: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_get_domains: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_put_domains: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_delete_domains: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_put_domains_ice_server_address: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_post_domains_temporary: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_put_domains_public_key: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_get_domains_public_key: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};

const router = Router();

router.get(   '/domains/:domainId',             proc_get_domains_domainid);
router.get(   '/domains',                       proc_get_domains);
router.put(   '/domains/:domainId',             proc_put_domains);
router.delete('/domains/:domainId',             proc_delete_domains);

router.put(   '/domains/:domainId/ice_server_address', proc_put_domains_ice_server_address);
router.post(  '/domains/temporary',             proc_post_domains_temporary);

router.put(   '/domains/:domainId/public_key',  proc_put_domains_public_key);
router.get(   '/domains/:domainId/public_key',  proc_get_domains_public_key);

export default router;
