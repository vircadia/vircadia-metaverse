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
import { Places } from '@Entities/Places';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { GenericFilter } from '@Entities/EntityFilters/GenericFilter';

import { createObject, getObject, getObjects, updateObjectFields, deleteOne } from '@Tools/Db';

import { GenUUID, IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

export type DomainTestFunction = (domain: DomainEntity) => boolean;

export let domainCollection = 'domains';

export const Domains = {
  async getDomainWithId(pDomainId: string): Promise<DomainEntity> {
    return IsNullOrEmpty(pDomainId) ? null : getObject(domainCollection, { 'id': pDomainId });
  },
  async getDomainWithAPIKey(pApiKey: string): Promise<DomainEntity> {
    return IsNullOrEmpty(pApiKey) ? null : getObject(domainCollection, { 'apiKey': pApiKey });
  },
  async getDomainWithSenderKey(pSenderKey: string): Promise<DomainEntity> {
    return IsNullOrEmpty(pSenderKey) ? null : getObject(domainCollection, { 'lastSenderKey': pSenderKey });
  },
  async addDomain(pDomainEntity: DomainEntity) : Promise<DomainEntity> {
    return IsNullOrEmpty(pDomainEntity) ? null : createObject(domainCollection, pDomainEntity);
  },
  createDomain(): DomainEntity {
    const newDomain = new DomainEntity();
    newDomain.id = GenUUID();
    newDomain.whenCreated = new Date();
    return newDomain;
  },
  async removeDomain(pDomainEntity: DomainEntity) : Promise<boolean> {
    Logger.info(`Domains: removing domain ${pDomainEntity.name}, id=${pDomainEntity.id}`);
    return deleteOne(domainCollection, { 'id': pDomainEntity.id } );
  },
  // When removing a domain, other tables need cleaning up
  async removeDomainContext(pDomainEntity: DomainEntity): Promise<void> {
    Logger.info(`Domains: removing relationships for domain ${pDomainEntity.name}, id=${pDomainEntity.id}`);
    // Don't delete the associated Places. Issue #27 was a requests to keep Places.
    //     This creates places that point at domains that don't exist
    // await Places.removeMany(new GenericFilter({ 'domainId': pDomainEntity.id }));
    return;
  },
  async *enumerateAsync(pPager: CriteriaFilter,
              pInfoer?: CriteriaFilter, pScoper?: CriteriaFilter): AsyncGenerator<DomainEntity> {
    for await (const domain of getObjects(domainCollection, pPager, pInfoer, pScoper)) {
      yield domain;
    };
    // return getObjects(domainCollection, pCriteria, pPager); // not sure why this doesn't work
  },
  // The contents of this entity have been updated
  async updateEntityFields(pEntity: DomainEntity, pFields: VKeyedCollection): Promise<DomainEntity> {
    return updateObjectFields(domainCollection, { 'id': pEntity.id }, pFields);
  },
  // Return 'true' if the passed string could be a domainId. Used as a precheck before querying the Db.
  // For the moment, do a simple check to see if it is probably a GUID.
  couldBeDomainId(pId: string): boolean {
    return pId.length === 36;
  }
};