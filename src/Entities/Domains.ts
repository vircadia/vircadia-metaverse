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

import { createObject, getObject, getObjects, updateObjectFields } from '@Tools/Db';

import { Logger } from '@Tools/Logging';
import { IsNullOrEmpty } from '@Tools/Misc';
import { VKeyedCollection } from '@Tools/vTypes';

export type DomainTestFunction = (domain: DomainEntity) => boolean;

export let domainCollection = 'domains';

export const Domains = {
  async getDomainWithId(pDomainId: string): Promise<DomainEntity> {
    return getObject(domainCollection, { 'domainId': pDomainId });
  },
  async getDomainWithAuthToken(pAuthToken: string): Promise<DomainEntity> {
    return null;
  },
  async getDomainWithAPIKey(pApiKey: string): Promise<DomainEntity> {
    return getObject(domainCollection, { 'apiKey': pApiKey });
  },
  async getDomainWithFilter( pTester: DomainTestFunction): Promise<DomainEntity> {
    return null;
  },
  async getDomainWithSenderKey(pSenderKey: string): Promise<DomainEntity> {
    return getObject(domainCollection, { 'lastSenderKey': pSenderKey });
  },
  async addDomain(pDomainEntity: DomainEntity) : Promise<any> {
    return createObject(domainCollection, pDomainEntity);
  },
  removeDomain(pAccountEntity: DomainEntity) : boolean {
    return false;
  },
  enumerate(pPager: PaginationInfo): Iterable<DomainEntity> {
    return null;
  },
  async *enumerateAsync(pCriteria: any, pPager: PaginationInfo): AsyncGenerator<DomainEntity> {
    return getObjects(domainCollection, pCriteria, pPager.PageNum, pPager.PerPage);
  },
  // The contents of this entity have been updated
  async updateEntityFields(pEntity: DomainEntity, pFields: VKeyedCollection): Promise<DomainEntity> {
    return updateObjectFields(domainCollection, { domainId: pEntity.domainId }, pFields);
  }
};