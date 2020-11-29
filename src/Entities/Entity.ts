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

'use strict';

// import { createObject, getObject, getObjects, updateObjectFields, deleteOne, noCaseCollation } from '@Tools/Db';
// import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
// import { GenUUID, genRandomString, IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';

export abstract class Entity {
  /*
  // This is experimental development.
  // All entities should share functions so they can be handled as general items.
  // But since the objects returned by the database are just Objects and not
  //     created as instances of their classes, they don't have initialized class-ness.
  public id: string;
  public collection: string;

  async getWithId(pId: string): Promise<Entity> {
    return IsNullOrEmpty(pId) ? null : getObject(this.collection,
                                        new GenericFilter({ 'id': pId }));
  };
  async create(pId: string): Promise<Entity> {
    return undefined;
  };
  async add(pEntity: Entity): Promise<Entity> {
    return createObject(this.collection, pEntity);
  };
  async remove(pEntity: Entity): Promise<boolean> {
    return deleteOne(this.collection, new GenericFilter({ 'id': pEntity.id }) );
  };
  async *enumerateAsync(pPager: CriteriaFilter,
               pInfoer: CriteriaFilter, pScoper: CriteriaFilter): AsyncGenerator<Entity> {
    for await (const acct of getObjects(this.collection, pPager, pInfoer, pScoper)) {
      yield acct;
    };
  };
  */
};

