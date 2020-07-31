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
import { Tokens } from '@Entities/Tokens';
import { AuthToken } from '@Entities/AuthToken';
import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { AccountFilterInfo } from '@Entities/EntityFilters/AccountFilterInfo';
import { AccountScopeFilter } from '@Entities/EntityFilters/AccountScopeFilter';

import { createObject, getObject, getObjects, updateObjectFields } from '@Tools/Db';

export let accountCollection = 'accounts';

export const Accounts = {
  async getAccountWithId(pAccountId: string): Promise<AccountEntity> {
    return getObject(accountCollection, { 'accountId': pAccountId });
  },
  async getAccountWithAuthToken(pAuthToken: string): Promise<AccountEntity> {
    try {
      const tokenInfo = await Tokens.getTokenWithToken(pAuthToken);
      return Accounts.getAccountWithId(tokenInfo.accountId);
    }
    catch (err) {
      throw err;
    };
    return null;
  },
  async getAccountWithUsername(pUsername: string): Promise<AccountEntity> {
    return getObject(accountCollection, { 'username': pUsername });
  },
  async getAccountWithNodeId(pNodeId: string): Promise<AccountEntity> {
    return getObject(accountCollection, { 'location.nodeid': pNodeId });
    return null;
  },
  async addAccount(pAccountEntity: AccountEntity) : Promise<AccountEntity> {
    return createObject(accountCollection, pAccountEntity);
  },
  async createAccount(pUsername: string, pPassword: string, pEmail: string): Promise<void> {
    return;
  },
  validatePassword(pAcct: AccountEntity, pPassword: string): boolean {
    return false;
  },
  // TODO: add scope (admin) and filter criteria filtering
  //    It's push down to this routine so we could possibly use DB magic for the queries
  async *enumerateAsync(pCriteria: any, pPager: PaginationInfo,
              pInfoer: AccountFilterInfo, pScoper: AccountScopeFilter): AsyncGenerator<AccountEntity> {
    return getObjects(accountCollection, pCriteria, pPager);
  },

  // getter property that is 'true' if the user has been heard from recently
  isOnline(pAcct: AccountEntity): boolean {
    return pAcct.timeOfLastHeartbeat
        && ((Date.now() - pAcct.timeOfLastHeartbeat.getUTCMilliseconds())
              < (Config["metaverse-server"]["heartbeat-seconds-until-offline"] * 1000));
  },
  // getter property that is 'true' if the user is a grid administrator
  isAdmin(pAcct: AccountEntity): boolean {
    return pAcct.administrator;
  }
};