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

import { Logger } from '@Tools/Logging';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

const procOptions: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  resp.setHeader('Access-Control-Allow-Origin', '*');
  resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
  Logger.debug('procOptions: adding options headers');
  next();
};
const procVircadiaErrorHeader: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  resp.setHeader('Access-Control-Allow-Headers', 'x-vircadia-error-handle');
  Logger.debug('procVircadiaErrorHandler: adding allow error headers');
  next();
};

export const name = 'CORS';

export const router = Router();

router.all('/',                 procVircadiaErrorHeader);
router.options('/',             procOptions);
