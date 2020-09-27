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

import { RequestEntity } from '@Entities/RequestEntity';

import { createObject, getObject, getObjects, updateObjectFields, deleteOne, deleteMany } from '@Tools/Db';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';

import { GenUUID, genRandomString, IsNullOrEmpty } from '@Tools/Misc';
import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

export let requestCollection = 'requests';

// Initialize request management.
// Mostly starts a periodic function that deletes expired requests.
export function initRequests(): void {

  // Expire requests that have pased their prime
  setInterval( async () => {
    const nowtime = new Date();
    const numDeleted = await deleteMany(requestCollection, { 'expirationTime': { $lt: nowtime } } );
    if (numDeleted > 0) {
      Logger.debug(`Requests.Expiration: expired ${numDeleted} requests`);
    };
  }, 1000 * 60 * 2 );
};

export const Requests = {
  async getWithId(pRequestId: string): Promise<RequestEntity> {
    return IsNullOrEmpty(pRequestId) ? null : getObject(requestCollection, { 'id': pRequestId });
  },
  create(): RequestEntity {
    const aRequest = new RequestEntity();
    aRequest.id = GenUUID();
    aRequest.expirationTime = new Date(Date.now() + 1000 * 60);
    return aRequest;
  },
  add(pRequestEntity: RequestEntity) : Promise<RequestEntity> {
    return createObject(requestCollection, pRequestEntity);
  },
  async remove(pRequestEntity: RequestEntity) : Promise<boolean> {
    return deleteOne(requestCollection, { 'id': pRequestEntity.id } );
  },
  // TODO: add scope (admin) and filter criteria filtering
  //    It's push down to this routine so we could possibly use DB magic for the queries
  async *enumerateAsync(pPager: CriteriaFilter,
              pInfoer?: CriteriaFilter, pScoper?: CriteriaFilter): AsyncGenerator<RequestEntity> {
    for await (const acct of getObjects(requestCollection, pPager, pInfoer, pScoper)) {
      yield acct;
    };
  }
};



