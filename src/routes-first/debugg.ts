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

import { Config } from '@Base/config';
import { Logger } from '@Tools/Logging';

const procAllDebug: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.cdebug('request-detail', `procAllDebug: ${req.method} ${req.url}`);
  Logger.cdebug('request-body', `procAllDebug: body: ` + JSON.stringify(req.body));
  next();
};

export const name = "Debug";

export const router = Router()
  .use(procAllDebug);