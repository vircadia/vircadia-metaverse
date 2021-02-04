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

import { Domains } from '@Entities/Domains';

import { AccountEntity } from '@Entities/AccountEntity';
import { PlaceEntity } from '@Entities/PlaceEntity';
import { placeFields } from '@Entities/PlaceFields';

import { AuthToken } from '@Entities/AuthToken';
import { Tokens, TokenScope } from '@Entities/Tokens';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { GenericFilter } from '@Entities/EntityFilters/GenericFilter';

import { ValidateResponse } from '@Route-Tools/EntityFieldDefn';
import { getEntityField, setEntityField, getEntityUpdateForField } from '@Route-Tools/GetterSetter';

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
  async createPlace(pAccountId: string): Promise<PlaceEntity> {
    const newPlace = new PlaceEntity();
    newPlace.id = GenUUID();
    newPlace.name = 'UNKNOWN-' + genRandomString(5);
    newPlace.address = '/0,0,0/0,0,0,0';
    newPlace.whenCreated = new Date();
    const APItoken = await Tokens.createToken(pAccountId, [ TokenScope.PLACE ], -1);
    newPlace.currentAPIKeyTokenId = APItoken.id;
    return newPlace;
  },
  // Verify the passed placename is unique and return the unique name
  async uniqifyPlaceName(pPlaceName: string): Promise<string> {
    let newPlacename = pPlaceName;
    const existingPlace = await Places.getPlaceWithName(newPlacename);
    if (existingPlace) {
      newPlacename = newPlacename + '-' + genRandomString(5);
      Logger.info(`uniqifyPlaceName: non-unique place name ${pPlaceName}. Creating ${newPlacename}`);
    };
    return newPlacename;
  },
  // Get the value of a place field with the fieldname.
  // Checks to make sure the getter has permission to get the values.
  // Returns the value. Could be 'undefined' whether the requestor doesn't have permissions or that's
  //     the actual field value.
  async getField(pAuthToken: AuthToken, pPlace: PlaceEntity,
                                  pField: string, pRequestingAccount?: AccountEntity): Promise<any> {
    return getEntityField(placeFields, pAuthToken, pPlace, pField, pRequestingAccount);
  },
  // Set a place field with the fieldname and a value.
  // Checks to make sure the setter has permission to set.
  // Returns 'true' if the value was set and 'false' if the value could not be set.
  async setField(pAuthToken: AuthToken,  // authorization for making this change
              pPlace: PlaceEntity,               // the place being changed
              pField: string, pVal: any,          // field being changed and the new value
              pRequestingAccount?: AccountEntity, // Account associated with pAuthToken, if known
              pUpdates?: VKeyedCollection         // where to record updates made (optional)
                      ): Promise<ValidateResponse> {
    return setEntityField(placeFields, pAuthToken, pPlace, pField, pVal, pRequestingAccount, pUpdates);
  },
  // Generate an 'update' block for the specified field or fields.
  // This is a field/value collection that can be passed to the database routines.
  // Note that this directly fetches the field value rather than using 'getter' since
  //     we want the actual value (whatever it is) to go into the database.
  // If an existing VKeyedCollection is passed, it is added to an returned.
  getUpdateForField(pPlace: PlaceEntity,
                pField: string | string[], pExisting?: VKeyedCollection): VKeyedCollection {
    return getEntityUpdateForField(placeFields, pPlace, pField, pExisting);
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
  },
  async getCurrentAttendance(pPlace: PlaceEntity): Promise<number> {
    // Attendance is either reported by a beacon script or defaults to the domain's numbers
    // If the last current update is stale (older than a few minutes), the domain's number is used
    let attendance: number = 0;
    let useDomain: boolean = true;
    let lastGoodUpdateTime = new Date(Date.now()
                  - (Config['metaverse-server']['place-current-timeout-minutes'] * 60 * 1000));
    if (IsNotNullOrEmpty(pPlace.currentLastUpdateTime) && pPlace.currentLastUpdateTime > lastGoodUpdateTime) {
      attendance = pPlace.currentAttendance;
      useDomain = IsNullOrEmpty(attendance);
    };
    if (useDomain) {
      // There isn't current attendance info. Default to domain's numbers
      if (IsNullOrEmpty(pPlace.domainId)) {
        let aDomain = await Domains.getDomainWithId(pPlace.domainId);
        if (IsNotNullOrEmpty(aDomain)) {
          attendance = (aDomain.numUsers ?? 0) + (aDomain.anonUsers ?? 0);
        };
      };
    };
    return attendance;

  }
};
