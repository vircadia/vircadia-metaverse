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

import Config from '@Base/config';

import { AuthToken } from '@Entities/AuthToken';
import { AccountEntity } from '@Entities/AccountEntity';
import { DomainEntity } from '@Entities/DomainEntity';
import { DomainFields, CheckDomainFields } from '@Entities/DomainFields';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { GenericFilter } from '@Entities/EntityFilters/GenericFilter';

import { ValidateResponse } from '@Route-Tools/EntityFieldDefn';
import { getEntityField, setEntityField, getEntityUpdateForField } from '@Route-Tools/GetterSetter';

import { Maturity } from '@Entities/Sets/Maturity';

import { createObject, getObject, getObjects, countObjects, updateObjectFields, deleteOne } from '@Tools/Db';

import { GenUUID, IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

export let domainCollection = 'domains';

// Initialize domain management.
// Periodic checks on liveness of domains and resetting of values if not talking
export function initDomains(): void {

  // Validate the fields are all set (DEBUG DEGUG for problems with circular references)
  CheckDomainFields();

  setInterval( async () => {
    // Find domains that are not heartbeating and reset activity if not talking
    for await (const aDomain of Domains.enumerateAsync(new GenericFilter(
                    { 'timeOfLastHeartbeat': { '$lt': Domains.dateWhenNotActive },
                      '$or': [ { 'numUsers': { '$gt': 0 } }, { 'anonUsers': { '$gt': 0 } } ]
                    }) ) ) {
      Logger.info(`Domains: domain ${aDomain.name} not heartbeating. Zeroing users.`);
      aDomain.numUsers = 0;
      aDomain.anonUsers = 0;
      const updates: VKeyedCollection = {
        'numUsers': 0,
        'anonUsers': 0
      };
      await Domains.updateEntityFields(aDomain, updates);
    };
  }, 1000 * 60 * 2 );
};

export const Domains = {
  async getDomainWithId(pDomainId: string): Promise<DomainEntity> {
    return IsNullOrEmpty(pDomainId) ? null : getObject(domainCollection,
                                          new GenericFilter({ 'id': pDomainId }));
  },
  async getDomainWithAPIKey(pApiKey: string): Promise<DomainEntity> {
    return IsNullOrEmpty(pApiKey) ? null : getObject(domainCollection,
                                          new GenericFilter({ 'apiKey': pApiKey }));
  },
  async getDomainWithSenderKey(pSenderKey: string): Promise<DomainEntity> {
    return IsNullOrEmpty(pSenderKey) ? null : getObject(domainCollection,
                                          new GenericFilter({ 'lastSenderKey': pSenderKey }));
  },
  async addDomain(pDomainEntity: DomainEntity) : Promise<DomainEntity> {
    Logger.info(`Domains: creating domain ${pDomainEntity.name}, id=${pDomainEntity.id}`);
    return IsNullOrEmpty(pDomainEntity) ? null : createObject(domainCollection, pDomainEntity);
  },
  createDomain(): DomainEntity {
    const newDomain = new DomainEntity();
    newDomain.id = GenUUID();
    newDomain.tags = [];
    newDomain.managers = [];
    newDomain.images = [];
    newDomain.whenCreated = new Date();
    newDomain.maturity = Maturity.UNRATED;
    return newDomain;
  },
  async removeDomain(pDomainEntity: DomainEntity) : Promise<boolean> {
    Logger.info(`Domains: removing domain ${pDomainEntity.name}, id=${pDomainEntity.id}`);
    return deleteOne(domainCollection, new GenericFilter({ 'id': pDomainEntity.id }) );
  },
  // When removing a domain, other tables need cleaning up
  async removeDomainContext(pDomainEntity: DomainEntity): Promise<void> {
    Logger.info(`Domains: removing relationships for domain ${pDomainEntity.name}, id=${pDomainEntity.id}`);
    // Don't delete the associated Places. Issue #27 was a requests to keep Places.
    //     This creates places that point at domains that don't exist
    // await Places.removeMany(new GenericFilter({ 'domainId': pDomainEntity.id }));
    return;
  },
  // Get the value of a domain field with the fieldname.
  // Checks to make sure the getter has permission to get the values.
  // Returns the value. Could be 'undefined' whether the requestor doesn't have permissions or that's
  //     the actual field value.
  async getField(pAuthToken: AuthToken, pDomain: DomainEntity,
                                  pField: string, pRequestingAccount?: AccountEntity): Promise<any> {
    return getEntityField(DomainFields, pAuthToken, pDomain, pField, pRequestingAccount);
  },
  // Set a domain field with the fieldname and a value.
  // Checks to make sure the setter has permission to set.
  // Returns 'true' if the value was set and 'false' if the value could not be set.
  async setField(pAuthToken: AuthToken,  // authorization for making this change
              pDomain: DomainEntity,              // the domain being changed
              pField: string, pVal: any,          // field being changed and the new value
              pRequestingAccount?: AccountEntity, // Account associated with pAuthToken, if known
              pUpdates?: VKeyedCollection         // where to record updates made (optional)
                      ): Promise<ValidateResponse> {
    return setEntityField(DomainFields, pAuthToken, pDomain, pField, pVal, pRequestingAccount, pUpdates);
  },
  // Generate an 'update' block for the specified field or fields.
  // This is a field/value collection that can be passed to the database routines.
  // Note that this directly fetches the field value rather than using 'getter' since
  //     we want the actual value (whatever it is) to go into the database.
  // If an existing VKeyedCollection is passed, it is added to an returned.
  getUpdateForField(pDomain: DomainEntity,
                pField: string | string[], pExisting?: VKeyedCollection): VKeyedCollection {
    return getEntityUpdateForField(DomainFields, pDomain, pField, pExisting);
  },
  // Return the number of domains that match the criteria
  async domainCount(pCriteria: CriteriaFilter): Promise<number> {
    return countObjects(domainCollection, pCriteria);
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
    return updateObjectFields(domainCollection,
                              new GenericFilter({ 'id': pEntity.id }), pFields);
  },
  // Return the Date when an domain is considered inactive
  dateWhenNotActive(): Date {
    const notActiveTime = new Date(Date.now() - 1000 * Config["metaverse-server"]["domain-seconds-until-offline"]);
    return notActiveTime;
  },
  // Return 'true' if the passed string could be a domainId. Used as a precheck before querying the Db.
  // For the moment, do a simple check to see if it is probably a GUID.
  couldBeDomainId(pId: string): boolean {
    return pId.length === 36;
  }
};