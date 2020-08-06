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

// metaverseServerApp.use(express.urlencoded({ extended: false }));

const procGetUserLocker: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procPostUserLocker: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};

export const name = '/api/v1/user/locker';

export const router = Router();

router.get(   '/api/v1/user/locker',                 procGetUserLocker);
router.post(  '/api/v1/user/locker',                 procPostUserLocker);
