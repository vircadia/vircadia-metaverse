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

import { Router, ErrorRequestHandler, Request, Response, NextFunction } from 'express';

import { Logger } from '@Tools/Logging';

import createError, { HttpError } from 'http-errors';

export const name = "ERROR";

export const router = Router();

// catch 404 and forward to error handler
router.use( (req: Request, res: Response, next: NextFunction) => {
  Logger.debug('procCreateError: no response so returning 404');
  next(createError(404));
});

// error handler
router.use( (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  Logger.debug('procFinalError: generating final error');
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end();
});