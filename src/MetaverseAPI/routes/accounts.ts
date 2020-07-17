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

const proc_get_accounts: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};

const proc_post_account_id: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};

const proc_delete_account_id: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};

const proc_get_account_tokens: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};

const proc_delete_account_tokens: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};

const router = Router();

router.get(   '/accounts',                            proc_get_accounts);
router.post(  '/account/:accountId',                  proc_post_account_id);
router.delete('/account/:accountId',                  proc_delete_account_id);
router.get(   '/account/:accountId/tokens',           proc_get_account_tokens);
router.delete('/account/:accountId/tokens/:tokenId',  proc_delete_account_tokens);

export default router;
