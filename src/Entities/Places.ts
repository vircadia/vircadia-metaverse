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

import { PlaceEntity } from '@Entities/PlaceEntity';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { GenericFilter } from '@Entities/EntityFilters/GenericFilter';

import { createObject, getObject, getObjects, updateObjectFields, deleteOne, deleteMany, noCaseCollation } from '@Tools/Db';

import { GenUUID, IsNullOrEmpty, IsNotNullOrEmpty, genRandomString } from '@Tools/Misc';
import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

export let placeCollection = 'places';

export const Places = {
  async getPlaceWithId(pPlaceId: string): Promise<PlaceEntity> {
    return IsNullOrEmpty(pPlaceId) ? null : getObject(placeCollection,
                                              new GenericFilter({ 'id': pPlaceId }));
  },
  async getPlaceWithName(pPlacename: string): Promise<PlaceEntity> {
    return IsNullOrEmpty(pPlacename) ? null : getObject(placeCollection,
                                              new GenericFilter({ 'name': pPlacename }),
                                              noCaseCollation);
  },
  async addPlace(pPlaceEntity: PlaceEntity) : Promise<PlaceEntity> {
    Logger.info(`Places: creating place ${pPlaceEntity.name}, id=${pPlaceEntity.id}`);
    return IsNullOrEmpty(pPlaceEntity) ? null : createObject(placeCollection, pPlaceEntity);
  },
  createPlace(): PlaceEntity {
    const newPlace = new PlaceEntity();
    newPlace.id = GenUUID();
    newPlace.name = 'UNKNOWN-' + genRandomString(5);
    newPlace.address = '/0,0,0/0,0,0,0';
    newPlace.whenCreated = new Date();
    return newPlace;
  },
  // Verify the passed placename is unique and return the unique name
  async uniqifyPlaceName(pPlaceName: string): Promise<string> {
    let newPlacename = pPlaceName;
    const existingPlace = await Places.getPlaceWithName(newPlacename);
    if (existingPlace) {
      newPlacename = newPlacename + ' ' + genRandomString(5);
      Logger.info(`uniqifyPlaceName: non-unique place name ${pPlaceName}. Creating ${newPlacename}`);
    };
    return newPlacename;
  },
  async removePlace(pPlaceEntity: PlaceEntity) : Promise<boolean> {
    Logger.info(`Places: removing place ${pPlaceEntity.name}, id=${pPlaceEntity.id}`);
    return deleteOne(placeCollection, new GenericFilter({ 'id': pPlaceEntity.id }) );
  },
  async removeMany(pCriteria: CriteriaFilter) : Promise<number> {
    return deleteMany(placeCollection, pCriteria);
  },
  async *enumerateAsync(pPager: CriteriaFilter,
              pInfoer?: CriteriaFilter, pScoper?: CriteriaFilter): AsyncGenerator<PlaceEntity> {
    for await (const place of getObjects(placeCollection, pPager, pInfoer, pScoper)) {
      yield place;
    };
    // return getObjects(placeCollection, pCriteria, pPager); // not sure why this doesn't work
  },
  // The contents of this entity have been updated
  async updateEntityFields(pEntity: PlaceEntity, pFields: VKeyedCollection): Promise<PlaceEntity> {
    return updateObjectFields(placeCollection,
                              new GenericFilter({ 'id': pEntity.id }), pFields);
  }
};
