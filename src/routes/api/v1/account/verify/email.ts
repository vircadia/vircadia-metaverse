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

import { HTTPStatusCode } from '@Route-Tools/RESTResponse';
import { IsNotNullOrEmpty } from '@Tools/Misc';
import { Config } from '@Base/config';
import { logger, Logger } from '@Tools/Logging';
import { AccountEntity } from '@Entities/AccountEntity';

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

                    // The pending verification request has been used
                    await Requests.remove(request);

                    // If specified, send the user to a nice place
                    if (IsNotNullOrEmpty(Config['metaverse-server']['email-verification-success-redirect'])) {
                        const redirectURL = BuildRedirect(Config['metaverse-server']['email-verification-success-redirect'],
                                        accountId);
                        Logger.debug(`procGetVerifyAccount: Redirect success to ${redirectURL}`);
                        resp.statusCode = HTTPStatusCode.Found;
                        resp.setHeader('Location', redirectURL);
                        resp.setHeader('content-type', 'text/html');
                        resp.send();
                    }
                }
                else {
                    // Odd that we can't find the account. The pending verification request is no more.
                    await Requests.remove(request);
                    Logger.error(`procGetVerifyAccount: account ${accountId} could not be found for verification`);
                    RedirectFailure(resp, accountId, 'Not verified. Missing account');
                };
            }
            else {
                Logger.error(`procGetVerifyAccount: verification code did not match for  ${accountId}`);
                RedirectFailure(resp, accountId, 'Not verified');
            };
        }
        else {
            Logger.error(`procGetVerifyAccount: attempt to verify account ${accountId} but no pending verification request`);
            RedirectFailure(resp, accountId, 'Not verified. No pending verification request');
        };
    }
    else {
        Logger.error(`procGetVerifyAccount: attempted verification with no parameters`);
        RedirectFailure(resp, 'UNKNOWN', 'Verification parameters not present');
    };
    // NOTE: no 'next()' operation because all paths return a redirect
};

// Do the string replacements for the redirection URL
// The failure reason is optional.
function BuildRedirect(pUrl: string, pAccountId: string, pReason?: string): string {
    let url = pUrl;
    if (IsNotNullOrEmpty(pReason)) {
        url = url.replace("FAILURE_REASON", encodeURI(pReason));
    }
    return url.replace("METAVERSE_SERVER_URL", Config.metaverse['metaverse-server-url'])
        .replace("DASHBOARD_URL", Config.metaverse['dashboard-url'])
        .replace("ACCOUNT_ID", pAccountId);
};

// The operation failed so send the user to a sad place
function RedirectFailure(pResp: Response, pAccountId: string, pReason: string): void {
    const redirectURL = BuildRedirect(Config['metaverse-server']['email-verification-failure-redirect'],
                            pAccountId, pReason);
    Logger.debug(`procGetVerifyAccount: Redirect failure to ${redirectURL}`);
    pResp.statusCode = HTTPStatusCode.Found;
    pResp.setHeader('Location', redirectURL);
    pResp.setHeader('content-type', 'text/html');
    pResp.send();
};

export const name = '/api/v1/account/verify/email';

export const router = Router();

// Note that this is down one level -- if "/api/v1/account/verify" the "verify" is confused with account name
router.get(  '/api/v1/account/verify/email', [ setupMetaverseAPI,      // req.vRestResp, req.vAuthToken
                                               procGetVerifyAccount,
                                               finishMetaverseAPI ] );