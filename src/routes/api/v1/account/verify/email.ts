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

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { Requests, RequestType } from '@Entities/Requests';

import { Accounts } from '@Entities/Accounts';

import { logger, Logger } from '@Tools/Logging';
import { IsNotNullOrEmpty } from '@Tools/Misc';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

// The verify account request takes two query parameters:
//      /api/v1/account/verify?a=ACCOUNT_ID&v=VERIFICATION_CODE
const procGetVerifyAccount: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    logger.debug(`procGetVerifyAccount: `);
    if (typeof(req.query.a) === 'string' && IsNotNullOrEmpty(req.query.a)
                && typeof(req.query.v) === 'string' && IsNotNullOrEmpty(req.query.v)) {
        const accountId = req.query.a;
        const verifyCode = req.query.v;
        logger.debug(`procGetVerifyAccount: acctId=${accountId}, code=${verifyCode}`);
        const request = await Requests.getWithRequesterOrTarget(accountId, RequestType.VERIFYEMAIL)
        if (request) {
            if (request.verificationCode === verifyCode) {
                // A matching verification request
                const aAccount = await Accounts.getAccountWithId(accountId);
                if (aAccount) {
                    Accounts.doEnableAccount(aAccount);
                    Logger.info(`procGetVerifyAccount: account ${accountId} verified and enabled`);
                }
                else {
                    // Odd that we can't find the account. The pending verification request is no more.
                    req.vRestResp.respondFailure('Not verified. Missing account');
                    Logger.error(`procGetVerifyAccount: account ${accountId} could not be found for verification`);
                };
                // The pending verification request has been used
                await Requests.remove(request);
            }
            else {
                req.vRestResp.respondFailure('Not verified');
                Logger.error(`procGetVerifyAccount: verification code did not match for  ${accountId}`);
            };
        }
        else {
            req.vRestResp.respondFailure('Not verified. No pending verification request');
            Logger.error(`procGetVerifyAccount: attempt to verify account ${accountId} but no pending verification request`);
        };
    }
    else {
        req.vRestResp.respondFailure('Verification parameters not present');
    };
    next();
};

export const name = '/api/v1/account/verify/email';

export const router = Router();

router.get(  '/api/v1/account/verify/email', [ setupMetaverseAPI,      // req.vRestResp, req.vAuthToken
                                               procGetVerifyAccount,
                                               finishMetaverseAPI ] );