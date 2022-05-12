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

import { AccountInterface } from '../common/interfaces/AccountInterface';
import { HookContext } from '@feathersjs/feathers';
import { IsNotNullOrEmpty } from '../utils/Misc';
import { Perm } from '../utils/Perm';
import { isAdmin } from '../utils/Utils';
import config from '../appconfig';
import { HTTPStatusCode } from '../utils/response';
import { Availability } from '../common/sets/Availability';
import { SArray } from '../utils/vTypes';
import { DatabaseService } from '../common/dbservice/DatabaseService';
import { messages } from '../utils/messages';
import { extractLoggedInUserFromParams } from '../services/auth/auth.utils';
import { NotAuthenticated, BadRequest } from '@feathersjs/errors';
import app from '../app';
// Check if the passed AuthToken has access to the passed Entity.
// Generalized for any Entity. The permissions expect 'accountId' and 'sponsorAccountId'
//    in the entities.
// The "required access" parameter lists the type of access the token must have.
// For instance, a REST request is made to get a list of users, the request token
//    goes through the list with the permissions [ 'owner', 'admin', 'friend', 'connection' ]
//    which means the requestor must be the account owner, a friend or connection of the
//    requested account or the requestor must be an admin.
// Note that the list of RequiredAccess is a OR list -- any one access type is sufficient.
// Note that pAuthToken can be passed as 'undefined'.
export async function checkAccessToEntity(
    pRequiredAccess: string[],
    loginUser: AccountInterface,
    pTargetEntity?: any
): Promise<boolean> {
    let canAccess = false;
    const dbService = new DatabaseService({}, app);

    if (IsNotNullOrEmpty(pTargetEntity)) {
        for (const perm of pRequiredAccess) {
            switch (perm) {
                case Perm.ALL:
                    canAccess = true;
                    break;
                case Perm.PUBLIC:
                    // The target entity is publicly visible
                    // Mostly AccountEntities that must have an 'availability' field
                    if (pTargetEntity?.hasOwnProperty('availability')) {
                        if (
                            pTargetEntity.availability.includes(
                                Availability.ALL
                            )
                        ) {
                            canAccess = true;
                        }
                    }
                    break;
                case Perm.DOMAIN:
                    // requestor is a domain and it's account is the domain's sponsoring account
                    if (loginUser) {
                        if (pTargetEntity.hasOwnProperty('sponsorAccountId')) {
                            canAccess =
                                loginUser.id ===
                                (pTargetEntity as any).sponsorAccountId;
                        } else {
                            // Super special case where domain doesn't have a sponsor but has an api_key.
                            // In this case, the API_KEY is put in the accountId field of the DOMAIN scoped AuthToken
                            if (pTargetEntity.hasOwnProperty('apiKey')) {
                                canAccess =
                                    loginUser.id ===
                                    (pTargetEntity as any).apiKey;
                            }
                        }
                    }
                    break;
                case Perm.OWNER:
                    // The requestor wants to be the same account as the target entity
                    if (loginUser && pTargetEntity.hasOwnProperty('id')) {
                        canAccess = loginUser.id === (pTargetEntity as any).id;
                    }
                    if (
                        loginUser &&
                        !canAccess &&
                        pTargetEntity.hasOwnProperty('accountId')
                    ) {
                        canAccess =
                            loginUser.id === (pTargetEntity as any).accountId;
                    }
                    break;
                case Perm.FRIEND:
                    // The requestor is a 'friend' of the target entity
                    if (loginUser && pTargetEntity.hasOwnProperty('friends')) {
                        const targetFriends: string[] = (
                            pTargetEntity as AccountInterface
                        ).friends;
                        if (targetFriends) {
                            canAccess = SArray.hasNoCase(
                                targetFriends,
                                loginUser.username
                            );
                        }
                    }
                    break;
                case Perm.CONNECTION:
                    // The requestor is a 'connection' of the target entity
                    if (
                        loginUser &&
                        pTargetEntity.hasOwnProperty('connections')
                    ) {
                        const targetConnections: string[] = (
                            pTargetEntity as AccountInterface
                        ).connections;
                        if (targetConnections) {
                            canAccess = SArray.hasNoCase(
                                targetConnections,
                                loginUser.username
                            );
                        }
                    }
                    break;
                case Perm.ADMIN:
                    // If the authToken is an account, has access if admin
                    if (loginUser) {
                        canAccess = isAdmin(loginUser as AccountInterface);
                    }

                    break;
                case Perm.SPONSOR:
                    // Requestor is a regular account and is the sponsor of the domain
                    if (loginUser) {
                        if (pTargetEntity.hasOwnProperty('sponsorAccountId')) {
                            canAccess =
                                loginUser.id ===
                                (pTargetEntity as any).sponsorAccountId;
                        }
                    }
                    break;
                case Perm.MANAGER:
                    // See if requesting account is in the list of managers of this entity
                    if (loginUser) {
                        if (pTargetEntity.hasOwnProperty('managers')) {
                            const managers: string[] = (pTargetEntity as any)
                                .managers;
                            if (
                                managers &&
                                managers.includes(
                                    loginUser.username.toLowerCase()
                                )
                            ) {
                                canAccess = true;
                            }
                        }
                    }
                    break;
                case Perm.DOMAINACCESS:
                    // Target entity has a domain reference and verify the requestor is able to reference that domain

                    if (loginUser && pTargetEntity.hasOwnProperty('domainId')) {
                        const aDomains = await dbService.findDataToArray(
                            config.dbCollections.domains,
                            {
                                query: {
                                    id: (pTargetEntity as any).domainId,
                                },
                            }
                        );

                        if (IsNotNullOrEmpty(aDomains)) {
                            canAccess =
                                aDomains[0].sponsorAccountId === loginUser.id;
                        }
                    }
                    break;
            }
            if (canAccess) break;
        }
    }
    return canAccess;
}

