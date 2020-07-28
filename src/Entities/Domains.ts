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

import { DomainEntity } from '@Entities/DomainEntity';
import { Accounts } from '@Entities/Accounts';
import { AccountEntity } from '@Entities/AccountEntity';
import { AuthToken } from '@Entities/AuthToken';
import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';

import { Logger } from '@Tools/Logging';
import { IsNullOrEmpty } from '@Tools/Misc';

export type DomainTestFunction = (domain: DomainEntity) => boolean;

export const Domains = {
  async getDomainWithId(pDomainId: string): Promise<DomainEntity> {
    return null;
  },
  async getDomainWithAuthToken(pAuthToken: string): Promise<DomainEntity> {
    return null;
  },
  async getDomainWithAPIKey(pApiKey: string): Promise<DomainEntity> {
    return null;
  },
  async getDomainWithFilter( pTester: DomainTestFunction): Promise<DomainEntity> {
    return null;
  },
  async getDomainWithSenderKey(pAuthToken: string): Promise<DomainEntity> {
    return null;
  },
  addDomain(pAccountEntity: DomainEntity) : boolean {
    return false;
  },
  removeDomain(pAccountEntity: DomainEntity) : boolean {
    return false;
  },
  async createDomain(pUsername: string, pPassword: string, pEmail: string): Promise<void> {
    return;
  },
  enumerate(pPager: PaginationInfo): Iterable<DomainEntity> {
    return null;
  },
  async *enumerateAsync(pPager: PaginationInfo): AsyncGenerator<DomainEntity> {
    return null;
  },

  // Verify that the passed domain has access by either the passed authToken or the passed apikey.
  async verifyDomainAccess(pDomain: DomainEntity, pAuthToken: string, pAPIKey: string): Promise<boolean> {
    Logger.debug(`verifyDomainAccess: domainId: ${pDomain.domainId}, authT: ${pAuthToken}, apikey: ${pAPIKey}`);
    let ret: boolean = false;
    if (typeof(pAuthToken) === 'undefined' || pAuthToken === null) {
      // Auth token not available. See if APIKey does the trick
      if (pDomain.apiKey === pAPIKey) {
        ret = true;
      };
    }
    else {
      const aAccount: AccountEntity = await Accounts.getAccountWithAuthToken(pAuthToken);
      if (aAccount) {
        if (IsNullOrEmpty(pDomain.sponserAccountID)) {
          // If the domain doesn't have an associated account, form the link to this account
          pDomain.sponserAccountID = aAccount.accountId;
        };
        if (pDomain.sponserAccountID === aAccount.accountId) {
          ret = true;
        };
      };
    };
    return ret;
  }
};