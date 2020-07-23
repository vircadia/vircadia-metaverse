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

import { DomainEntity } from './DomainEntity';
import { AuthToken } from './AuthToken';
import { PaginationInfo } from './EntityFilters/PaginationInfo';

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
  }
};