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

import { RelationshipEntity } from '@Entities/RelationshipEntity';

import { createObject, getObject, getObjects, updateObjectFields, deleteOne, deleteMany } from '@Tools/Db';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';

import { GenUUID, genRandomString, IsNullOrEmpty } from '@Tools/Misc';
import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

export let relationshipCollection = 'relationships';

export class RelationshipTypes {
  public static CONNECTION = 'connection';
};

export const Relationships = {
  async getWithId(pRequestId: string): Promise<RelationshipEntity> {
    return IsNullOrEmpty(pRequestId) ? null : getObject(relationshipCollection, { 'id': pRequestId });
  },
  create(): RelationshipEntity {
    const aRelationship = new RelationshipEntity();
    aRelationship.id = GenUUID();
    aRelationship.whenCreated = new Date();
    return aRelationship;
  },
  async add(pRequestEntity: RelationshipEntity) : Promise<RelationshipEntity> {
    return createObject(relationshipCollection, pRequestEntity);
  },
  async update(pEntity: RelationshipEntity, pFields: VKeyedCollection): Promise<RelationshipEntity> {
    return updateObjectFields(relationshipCollection, { 'id': pEntity.id }, pFields);
  },
  async remove(pRequestEntity: RelationshipEntity) : Promise<boolean> {
    return deleteOne(relationshipCollection, { 'id': pRequestEntity.id } );
  },
  async removeMany(pCritera: CriteriaFilter) : Promise<number> {
    return deleteMany(relationshipCollection, pCritera);
  },
  // TODO: add scope (admin) and filter criteria filtering
  //    It's push down to this routine so we could possibly use DB magic for the queries
  async *enumerateAsync(pPager: CriteriaFilter,
              pInfoer?: CriteriaFilter, pScoper?: CriteriaFilter): AsyncGenerator<RelationshipEntity> {
    for await (const acct of getObjects(relationshipCollection, pPager, pInfoer, pScoper)) {
      yield acct;
    };
  }
};




