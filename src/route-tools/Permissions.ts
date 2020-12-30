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

import { Entity } from '@Entities/Entity';
import { Accounts } from '@Entities/Accounts';
import { AccountEntity } from '@Entities/AccountEntity';
import { Domains } from '@Entities/Domains';
import { DomainEntity } from '@Entities/DomainEntity';
import { AuthToken } from '@Entities/AuthToken';
import { Tokens, TokenScope } from '@Entities/Tokens';

import { Perm } from '@Route-Tools/Perm';

import { SArray, VKeyedCollection } from '@Tools/vTypes';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';
import { Availability } from '@Entities/Sets/Availability';

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
export async function checkAccessToEntity(pAuthToken: AuthToken,  // token being used to access
                            pTargetEntity: Entity,              // entity being accessed
                            pRequiredAccess: string[],          // permissions required to access domain
                            pRequestingAccount?: AccountEntity  // requesting account if known
                    ): Promise<boolean> {
  let requestingAccount = pRequestingAccount;
  let canAccess: boolean = false;
  if (IsNotNullOrEmpty(pTargetEntity)) {
    for (const perm of pRequiredAccess) {
      Logger.cdebug('field-setting', `checkAccessToEntity: checking ${perm}`);
      switch (perm) {
        case Perm.ALL:
          canAccess = true;
          break;
        case Perm.PUBLIC:
          // The target entity is publicly visible
          // Mostly AccountEntities that must have an 'availability' field
          if (pTargetEntity.hasOwnProperty('availability')) {
            if ((pTargetEntity as AccountEntity).availability.includes(Availability.ALL)) {
              canAccess = true;
            };
          };
          break;
        case Perm.DOMAIN:
          // requestor is a domain and it's account is the domain's sponsoring account
          if (pAuthToken && SArray.has(pAuthToken.scope, TokenScope.DOMAIN)) {
            if (pTargetEntity.hasOwnProperty('sponsorAccountId')) {
              Logger.cdebug('field-setting', `checkAccessToEntity: authToken is domain. auth.AccountId=${pAuthToken.accountId}, sponsor=${(pTargetEntity as any).sponsorAccountId}`);
              canAccess = pAuthToken.accountId === (pTargetEntity as any).sponsorAccountId;
            }
            else {
              // Super special case where domain doesn't have a sponsor but has an api_key.
              // In this case, the API_KEY is put in the accountId field of the DOMAIN scoped AuthToken
              if (pTargetEntity.hasOwnProperty('apiKey')) {
                canAccess = pAuthToken.accountId === (pTargetEntity as any).apiKey;
              };
            };
          };
          break;
        case Perm.OWNER:
          // The requestor wants to be the same account as the target entity
          if (pAuthToken && pTargetEntity.hasOwnProperty('id')) {
            canAccess = pAuthToken.accountId === (pTargetEntity as AccountEntity).id;
          };
          if (!canAccess && pTargetEntity.hasOwnProperty('accountId')) {
            canAccess = pAuthToken.accountId === (pTargetEntity as any).accountId;
          };
          break;
        case Perm.FRIEND:
          // The requestor is a 'friend' of the target entity
          if (pAuthToken && pTargetEntity.hasOwnProperty('friends')) {
            const targetFriends: string[] = (pTargetEntity as AccountEntity).friends;
            if (targetFriends) {
              requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
              canAccess = SArray.hasNoCase(targetFriends, requestingAccount.username);
            };
          };
          break;
        case Perm.CONNECTION:
          // The requestor is a 'connection' of the target entity
          if (pAuthToken && pTargetEntity.hasOwnProperty('connections')) {
            const targetConnections: string[] = (pTargetEntity as AccountEntity).connections;
            if (targetConnections) {
              requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
              canAccess = SArray.hasNoCase(targetConnections, requestingAccount.username);
            };
          };
          break;
        case Perm.ADMIN:
          if (pAuthToken && Tokens.isSpecialAdminToken(pAuthToken)) {
            Logger.cdebug('field-setting', `checkAccessToEntity: isSpecialAdminToken`);
            canAccess = true;
          }
          else {
            // If the authToken is an account, has access if admin
            if (SArray.has(pAuthToken.scope, TokenScope.OWNER)) {
              Logger.cdebug('field-setting', `checkAccessToEntity: admin. auth.AccountId=${pAuthToken.accountId}`);
              requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
              canAccess = Accounts.isAdmin(requestingAccount);
            }
          };
          break;
        case Perm.SPONSOR:
          // Requestor is a regular account and is the sponsor of the domain
          if (pAuthToken && SArray.has(pAuthToken.scope, TokenScope.OWNER)) {
            if (pTargetEntity.hasOwnProperty('sponsorAccountId')) {
              Logger.cdebug('field-setting', `checkAccessToEntity: authToken is domain. auth.AccountId=${pAuthToken.accountId}, sponsor=${(pTargetEntity as any).sponsorAccountId}`);
              canAccess = pAuthToken.accountId === (pTargetEntity as DomainEntity).sponsorAccountId;
            };
          };
          break;
        case Perm.DOMAINACCESS:
          // Target entity has a domain reference and verify the requestor is able to reference that domain
          if (pAuthToken && pTargetEntity.hasOwnProperty('domainId')) {
            const aDomain = await Domains.getDomainWithId((pTargetEntity as any).domainId);
            if (aDomain) {
              canAccess = aDomain.sponsorAccountId === pAuthToken.accountId;
            };
          };
          break;
        default:
          canAccess = false;
          break;
      }
      // If some permission allows access, we are done
      if (canAccess) break;
    };
  };
  return canAccess;
};