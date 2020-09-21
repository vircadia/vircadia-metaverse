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

import { createObject, getObject, getObjects, updateObjectFields, deleteOne } from '@Tools/Db';

import { GenUUID, IsNullOrEmpty, IsNotNullOrEmpty, genRandomString } from '@Tools/Misc';
import { VKeyedCollection } from '@Tools/vTypes';

export let placeCollection = 'places';

export const Places = {
  async getPlaceWithId(pPlaceId: string): Promise<PlaceEntity> {
    return IsNullOrEmpty(pPlaceId) ? null : getObject(placeCollection, { 'placeId': pPlaceId });
  },
  async getPlaceWithName(pPlacename: string): Promise<PlaceEntity> {
    return IsNullOrEmpty(pPlacename) ? null : getObject(placeCollection, { 'name': pPlacename });
  },
  async addPlace(pPlaceEntity: PlaceEntity) : Promise<PlaceEntity> {
    return IsNullOrEmpty(pPlaceEntity) ? null : createObject(placeCollection, pPlaceEntity);
  },
  createPlace(): PlaceEntity {
    const newPlace = new PlaceEntity();
    newPlace.placeId = GenUUID();
    newPlace.name = 'UNKNOWN-' + genRandomString(5);
    newPlace.address = '/0,0,0/0,0,0,0/';
    newPlace.whenPlaceEntryCreated = new Date();
    return newPlace;
  },
  removePlace(pPlaceEntity: PlaceEntity) : Promise<boolean> {
    return deleteOne(placeCollection, { 'placeId': pPlaceEntity.placeId } );
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
    return updateObjectFields(placeCollection, { placeId: pEntity.placeId }, pFields);
  }
};
