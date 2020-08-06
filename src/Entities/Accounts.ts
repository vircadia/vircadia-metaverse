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

import { AccountEntity } from '@Entities/AccountEntity';
import { Roles } from '@Entities/Roles';
import { Tokens } from '@Entities/Tokens';
import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';

import { createObject, getObject, getObjects, updateObjectFields } from '@Tools/Db';
import { GenUUID, IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
import { Shadows } from '@Entities/Shadows';
import { ShadowEntity } from '@Entities/ShadowEntity';

import { Logger } from '@Tools/Logging';

export let accountCollection = 'accounts';

export interface ShadowedAccount {
  Acct: AccountEntity,
  Shadow: ShadowEntity
};

export const Accounts = {
  async getAccountWithId(pAccountId: string): Promise<AccountEntity> {
    return IsNullOrEmpty(pAccountId) ? null : getObject(accountCollection, { 'accountId': pAccountId });
  },
  async getAccountWithAuthToken(pAuthToken: string): Promise<AccountEntity> {
    if (IsNotNullOrEmpty(pAuthToken)) {
      try {
        const tokenInfo = await Tokens.getTokenWithToken(pAuthToken);
        if (IsNotNullOrEmpty(tokenInfo)) {
          return Accounts.getAccountWithId(tokenInfo.accountId);
        };
      }
      catch (err) {
        throw err;
      };
    };
    return null;
  },
  async getAccountWithUsername(pUsername: string): Promise<AccountEntity> {
    return IsNullOrEmpty(pUsername) ? null : getObject(accountCollection, { 'username': pUsername });
  },
  async getAccountWithNodeId(pNodeId: string): Promise<AccountEntity> {
    return IsNullOrEmpty(pNodeId) ? null : getObject(accountCollection, { 'location.nodeid': pNodeId });
  },
  async addAccount(pAccountEntity: AccountEntity) : Promise<AccountEntity> {
    return createObject(accountCollection, pAccountEntity);
  },
  createAccount(pUsername: string, pPassword: string, pEmail: string): ShadowedAccount {
    const newAcct = new AccountEntity();
    newAcct.accountId= GenUUID();
    newAcct.username = pUsername;
    newAcct.email = pEmail;
    newAcct.roles = [Roles.USER];
    newAcct.whenAccountCreated = new Date();

    // Create the account shadow to hold stuff that is not public
    const acctShadow = Shadows.createShadow()
    acctShadow.accountId = newAcct.accountId;
    Shadows.storePassword(acctShadow, pPassword);

    // Return the account and shadow information for any additions.
    // NOTE: that the AccountEntity and ShadowEntity are not stored so that needs to be done.
    const shadowAcct: ShadowedAccount = {
      Acct: newAcct,
      Shadow: acctShadow
    };
    return shadowAcct;
  },
  async validatePassword(pAcct: AccountEntity, pPassword: string, pShadow?: ShadowEntity): Promise<boolean> {
    let shadow = pShadow;
    if (IsNullOrEmpty(shadow)) {
      // If the caller didn't pass the shadow, fetch it
      shadow = await Shadows.getShadowWithAccountId(pAcct.accountId);
      if (IsNullOrEmpty(shadow)) {
        Logger.error(`Accounts.validatePassword: could not fetch shadow for accountId ${pAcct.accountId}`);
        return false;
      };
    };
    return Shadows.hashPassword(pPassword, shadow.passwordSalt) === shadow.passwordHash;
  },
  // TODO: add scope (admin) and filter criteria filtering
  //    It's push down to this routine so we could possibly use DB magic for the queries
  async *enumerateAsync(pPager: CriteriaFilter,
              pInfoer: CriteriaFilter, pScoper: CriteriaFilter): AsyncGenerator<AccountEntity> {
    for await (const acct of getObjects(accountCollection, pPager, pInfoer, pScoper)) {
      yield acct;
    };
    // return getObjects(accountCollection, pCriteria, pPager);
  },

  // getter property that is 'true' if the user has been heard from recently
  isOnline(pAcct: AccountEntity): boolean {
    return pAcct.timeOfLastHeartbeat
        && ((Date.now() - pAcct.timeOfLastHeartbeat.getUTCMilliseconds())
              < (Config["metaverse-server"]["heartbeat-seconds-until-offline"] * 1000));
  },
  // getter property that is 'true' if the user is a grid administrator
  isAdmin(pAcct: AccountEntity): boolean {
    return Roles.HasRole(pAcct.roles, Roles.ADMIN);
  }
};