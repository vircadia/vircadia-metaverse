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

import { ShadowEntity } from '@Entities/ShadowEntity';
import { createObject, getObject, getObjects, updateObjectFields } from '@Tools/Db';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';

import { VKeyedCollection } from '@Tools/vTypes';
import { GenUUID, genRandomString, IsNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

export let shadowCollection = 'shadows';

export const Shadows = {
  // Create a new AuthToken.
  createShadow(): ShadowEntity {
    const aShadow = new ShadowEntity();
    aShadow.shadowId = GenUUID();
    aShadow.discourseApiKey = 'depricated';
    aShadow.xmppPassword = 'depricated';
    aShadow.walletId = 'depricated';
    return aShadow;
  },
  async getShadowWithShadowId(pShadowId: string): Promise<ShadowEntity> {
    return IsNullOrEmpty(pShadowId) ? null : getObject(shadowCollection, { 'shadowId': pShadowId });
  },
  async getShadowWithAccountId(pAccountId: string): Promise<ShadowEntity> {
    return IsNullOrEmpty(pAccountId) ? null : getObject(shadowCollection, { 'accountId': pAccountId });
  },
  async addShadow(pShadowEntity: ShadowEntity) : Promise<ShadowEntity> {
    return createObject(shadowCollection, pShadowEntity);
  },
  async updateShadowFields(pEntity: ShadowEntity, pFields: VKeyedCollection): Promise<ShadowEntity> {
    return updateObjectFields(shadowCollection, { shadowId: pEntity.shadowId }, pFields);
  },
  async *enumerateAsync(pPager?: PaginationInfo): AsyncGenerator<ShadowEntity> {
    for await (const shad of getObjects(shadowCollection, pPager)) {
      yield shad;
    };
    // return getObjects(shadowCollection, pCriteria, pPager);
  },
  storePassword(pEntity: ShadowEntity, pPassword: string) {
      pEntity.passwordSalt = genRandomString(16);
      pEntity.passwordHash = Shadows.hashPassword(pPassword, pEntity.passwordSalt);
  },
  hashPassword(pPassword: string, pSalt: string): string {
      const hash = crypto.createHmac('sha512', pSalt);
      hash.update(pPassword);
      const val = hash.digest('hex');
      return val;
  }
};

