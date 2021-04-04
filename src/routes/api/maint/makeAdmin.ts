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

import { Config } from '@Base/config';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';

import { Logger } from '@Tools/Logging';
import { Accounts } from '@Entities/Accounts';
import { Tokens } from '@Entities/Tokens';
import { IsNotNullOrEmpty } from '@Tools/Misc';
import { Roles } from '@Entities/Sets/Roles';

import { SArray, VKeyedCollection } from '@Tools/vTypes';

// Temporary maint function to create the first admin account
const procMakeAdmin: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    const adminAccountName =  Config["metaverse-server"]["base-admin-account"] ?? 'wilma';
    if (req.vRestResp) {
        const adminAccount = await Accounts.getAccountWithUsername(adminAccountName);
        if (IsNotNullOrEmpty(adminAccount)) {
            if (SArray.has(adminAccount.roles, Roles.ADMIN)) {
                Logger.debug(`procMakeAdmin: ${adminAccountName} already has role "admin"`);
            }
            else {
                const updates: VKeyedCollection = {};
                const adminToken = Tokens.createSpecialAdminToken();
                const success = await Accounts.setField(adminToken, adminAccount, 'roles', { 'add': Roles.ADMIN }, adminAccount, updates);
                if (success.valid) {
                    await Accounts.updateEntityFields(adminAccount, updates);
                }
                else {
                    req.vRestResp.respondFailure('could not set admin: ' + success.reason);
                };
            };
        }
        else {
            Logger.error(`procMakeAdmin: could not fetch account "${adminAccountName}"`);
            req.vRestResp.respondFailure('No account named admin account name exists');
        };
    };
    next();
};

export const name = '/api/maint/makeAdmin';

export const router = Router();

router.get('/api/maint/makeAdmin',  [ setupMetaverseAPI,
                                      procMakeAdmin,
                                      finishMetaverseAPI ] );



