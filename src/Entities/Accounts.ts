//   Copyright 2020 Robert Adams
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

import { AccountEntity } from './AccountEntity';
import { AuthToken } from './AuthToken';
import { PaginationInfo } from './EntityFilters/PaginationInfo';
import { AccountFilterInfo } from './EntityFilters/AccountFilterInfo';
import { AccountScopeFilter } from './EntityFilters/AccountScopeFilter';

export type AccountTestFunction = (acct: AccountEntity) => boolean;

export const Accounts = {
  async getAccountWithId(pAccountId: string): Promise<AccountEntity> {
    return null;
  },
  async getAccountWithFilter( pTester: AccountTestFunction): Promise<AccountEntity> {
    return null;
  },
  async getAccountWithAuthToken(pAuthToken: AuthToken): Promise<AccountEntity> {
    return null;
  },
  async getAccountWithUsername(pUsername: string): Promise<AccountEntity> {
    return null;
  },
  async getAccountWithNodeId(pNodeId: string): Promise<AccountEntity> {
    return null;
  },
  addAccount(pAccountEntity: AccountEntity) : boolean {
    return false;
  },
  async createAccount(pUsername: string, pPassword: string, pEmail: string): Promise<void> {
    return;
  },
  validatePassword(pAcct: AccountEntity, pPassword: string): boolean {
    return false;
  },
  enumerate(pPager: PaginationInfo, pAccter: AccountFilterInfo, pScoper: AccountScopeFilter): IteratorResult<AccountEntity> {
    return null;
  }
};