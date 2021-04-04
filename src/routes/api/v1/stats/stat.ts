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

'use strict'

import os from 'os';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI, param1FromParams } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';

import { Monitoring } from '@Monitoring/Monitoring';

import { Logger } from '@Tools/Logging';

const procGetStat: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vAuthAccount) {
        if (req.vParam1) {
            let includeHistory = true;
            if (req.query.history) {
                if (typeof(req.query.history) === 'string') {
                    includeHistory = [ 'false', 'no' ].includes(req.query.history) ? false : true;
                };
            };
            const stat = Monitoring.getStat(req.vParam1);
            if (stat) {
                req.vRestResp.Data = {
                    'stat': stat.Report(includeHistory)
                };
            }
            else {
                req.vRestResp.respondFailure('Unknown stat');
            };
        }
        else {
            req.vRestResp.respondFailure('missing parameter');
        };
    }
    else {
        req.vRestResp.respondFailure(req.vAccountError ?? 'Not logged in');
    };
    next();
};

export const name = '/api/v1/stats/stat/:name';

export const router = Router();

router.get('/api/v1/stats/stat/:param1', [ setupMetaverseAPI,      // req.vRestResp
                                           accountFromAuthToken,   // req.vAuthAccount
                                           param1FromParams,       // req.vParam1
                                           procGetStat,
                                           finishMetaverseAPI ] );


