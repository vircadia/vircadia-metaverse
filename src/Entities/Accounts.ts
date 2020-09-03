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

import crypto from 'crypto';

import { AccountEntity } from '@Entities/AccountEntity';
import { AccountRoles } from '@Entities/AccountRoles';
import { Tokens } from '@Entities/Tokens';
import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';

import { createObject, getObject, getObjects, updateObjectFields, deleteOne } from '@Tools/Db';
import { GenUUID, genRandomString, IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';

import { Logger } from '@Tools/Logging';
import { VKeyedCollection, SArray } from '@Tools/vTypes';

export let accountCollection = 'accounts';

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
    return IsNullOrEmpty(pUsername) ? null : getObject(accountCollection, { 'username': pUsername.toLowerCase() });
  },
  async getAccountWithNodeId(pNodeId: string): Promise<AccountEntity> {
    return IsNullOrEmpty(pNodeId) ? null : getObject(accountCollection, { 'location.nodeid': pNodeId });
  },
  async addAccount(pAccountEntity: AccountEntity) : Promise<AccountEntity> {
    return createObject(accountCollection, pAccountEntity);
  },
  async removeAccount(pAccountEntity: AccountEntity) : Promise<any> {
    return deleteOne(accountCollection, { 'accountId': pAccountEntity.accountId } );
  },
  // The contents of this entity have been updated
  async updateEntityFields(pEntity: AccountEntity, pFields: VKeyedCollection): Promise<AccountEntity> {
    return updateObjectFields(accountCollection, { 'accountId': pEntity.accountId }, pFields);
  },
  createAccount(pUsername: string, pPassword: string, pEmail: string): AccountEntity {
    const newAcct = new AccountEntity();
    newAcct.accountId= GenUUID();
    newAcct.username = pUsername.toLowerCase();
    newAcct.email = pEmail;
    newAcct.roles = [AccountRoles.USER];
    newAcct.whenAccountCreated = new Date();

    // Remember the password
    Accounts.storePassword(newAcct, pPassword);

    return newAcct;
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

  storePassword(pEntity: AccountEntity, pPassword: string) {
      pEntity.passwordSalt = genRandomString(16);
      pEntity.passwordHash = Accounts.hashPassword(pPassword, pEntity.passwordSalt);
  },
  async validatePassword(pAcct: AccountEntity, pPassword: string): Promise<boolean> {
    return Accounts.hashPassword(pPassword, pAcct.passwordSalt) === pAcct.passwordHash;
  },
  hashPassword(pPassword: string, pSalt: string): string {
      const hash = crypto.createHmac('sha512', pSalt);
      hash.update(pPassword);
      const val = hash.digest('hex');
      return val;
  },

  // getter property that is 'true' if the user has been heard from recently
  isOnline(pAcct: AccountEntity): boolean {
    if (pAcct && pAcct.timeOfLastHeartbeat) {
      return pAcct.timeOfLastHeartbeat
          && ((Date.now() - pAcct.timeOfLastHeartbeat.getUTCMilliseconds())
                < (Config["metaverse-server"]["heartbeat-seconds-until-offline"] * 1000));
    };
    return false;
  },
  // getter property that is 'true' if the user is a grid administrator
  isAdmin(pAcct: AccountEntity): boolean {
    return SArray.has(pAcct.roles, AccountRoles.ADMIN);
  },
  // Return whether accessing account can access info about target account
  CanAccess(pAccessingAcct: AccountEntity, pTargetAcct: AccountEntity): boolean {
    // TODO:
    return true;
  }
};
