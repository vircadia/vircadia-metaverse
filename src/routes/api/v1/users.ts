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


import { Config } from "@Base/config";

import { Router, RequestHandler, Request, Response, NextFunction } from "express";
import { setupMetaverseAPI, finishMetaverseAPI } from "@Route-Tools/middleware";
import { accountFromAuthToken } from "@Route-Tools/middleware";

import { Accounts } from "@Entities/Accounts";
import { PaginationInfo } from "@Entities/EntityFilters/PaginationInfo";
import { AccountScopeFilter } from "@Entities/EntityFilters/AccountScopeFilter";
import { AccountFilterInfo } from "@Entities/EntityFilters/AccountFilterInfo";

import { buildUserInfo } from "@Route-Tools/Util";

import { Logger } from "@Tools/Logging";
import { IsNullOrEmpty, IsNotNullOrEmpty } from "@Tools/Misc";
import { Roles } from "@Entities/Sets/Roles";
import { SArray } from "@Tools/vTypes";

// metaverseServerApp.use(express.urlencoded({ extended: false }));

// Get basic user information
const procGetUsers: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vAuthAccount) {
        const pager = new PaginationInfo();
        const scoper = new AccountScopeFilter(req.vAuthAccount);
        const infoer = new AccountFilterInfo();
        pager.parametersFromRequest(req);
        scoper.parametersFromRequest(req);
        infoer.parametersFromRequest(req);

        // Loop through all the filtered accounts and create array of info
        const accts: any[] = [];
        for await (const acct of Accounts.enumerateAsync(scoper, infoer, pager)) {
            const userInfo = await buildUserInfo(acct);
            if (req.vAuthAccount.id === acct.id) {
                // Add a tag to denote the requestor's entry
                userInfo.connection = "self";
            }
            accts.push(userInfo);
        }

        req.vRestResp.Data = {
            users: accts
        };

        pager.addResponseFields(req);
        infoer.addResponseFields(req);
        scoper.addResponseFields(req);
    } else {
        req.vRestResp.respondFailure(req.vAccountError ?? "Not logged in");
    }
    next();
};

// Create a user account using the username and password passed
const procPostUsers: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vRestResp) {
        if (req.body && req.body.user) {
            const userName: string = req.body.user.username;
            const userPassword: string = req.body.user.password;
            const userEmail: string = req.body.user.email;
            Logger.debug(`procPostUsers: request to create account for ${userName} with email ${userEmail}`);
            // Precheck format of username and email before trying to set them
            let ifValid = await Accounts.validateFieldValue("username", userName);
            if (ifValid.valid) {
                ifValid = await Accounts.validateFieldValue("email", userEmail);
                if (ifValid.valid) {
                    // See if account already exists
                    let prevAccount = await Accounts.getAccountWithUsername(userName);
                    if (IsNullOrEmpty(prevAccount)) {
                        prevAccount = await Accounts.getAccountWithEmail(userEmail);
                        if (IsNullOrEmpty(prevAccount)) {
                            const newAcct = await Accounts.createAccount(userName, userPassword, userEmail);
                            if (newAcct) {
                                try {
                                    // A special kludge to create the initial admin account
                                    // If we're creating an account that has the name of the admin account
                                    //    then add the 'admin' role to it.
                                    const adminAccountName = Config["metaverse-server"]["base-admin-account"];
                                    if (IsNotNullOrEmpty(adminAccountName)) {
                                        if (newAcct.username === adminAccountName) {
                                            if (IsNullOrEmpty(newAcct.roles)) {
                                                newAcct.roles = [];
                                            }
                                            SArray.add(newAcct.roles, Roles.ADMIN);
                                            Logger.info(`procPostUsers: setting new account ${adminAccountName} as admin`);
                                        }
                                    }
                                    // Remember the address of the creator
                                    newAcct.IPAddrOfCreator = req.vSenderKey;
                                    // Enable the account (email verification, etc)
                                    const accountIsActive = Accounts.enableAccount(newAcct);
                                    // Put it into the database
                                    // Note that this puts everything that's in 'newAcct' into the DB
                                    await Accounts.addAccount(newAcct);

                                    // Return the status of the account
                                    req.vRestResp.Data = {
                                        accountId: newAcct.id,
                                        username: newAcct.username,
                                        accountIsActive,
                                        accountWaitingVerification: !accountIsActive
                                    };
                                } catch (err) {
                                    Logger.error("procPostUsers: exception adding user: " + err);
                                    req.vRestResp.respondFailure("Exception adding user: " + err);
                                }
                            } else {
                                Logger.debug("procPostUsers: error creating account for " + userName);
                                req.vRestResp.respondFailure("could not create account");
                            }
                        } else {
                            req.vRestResp.respondFailure("Email already exists");
                        }
                    } else {
                        req.vRestResp.respondFailure("Account already exists");
                    }
                } else {
                    req.vRestResp.respondFailure(ifValid.reason ?? "Badly formatted email");
                }
            } else {
                req.vRestResp.respondFailure(ifValid.reason ?? "Badly formatted username");
            }
        } else {
            req.vRestResp.respondFailure("Badly formatted request");
        }
    }
    next();
};

export const name = "/api/v1/users";

export const router = Router();

router.get("/api/v1/users", [
    setupMetaverseAPI,      // req.vRestResp, req.vAuthToken
    accountFromAuthToken,   // req.vAuthAccount
    procGetUsers,
    finishMetaverseAPI
]);
router.post("/api/v1/users", [
    setupMetaverseAPI,      // req.vRestResp, req.vAuthToken
    procPostUsers,
    finishMetaverseAPI
]);
