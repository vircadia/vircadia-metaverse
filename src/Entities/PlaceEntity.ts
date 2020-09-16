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

import { Entity } from '@Entities/Entity';
import { AccountEntity } from '@Entities/AccountEntity';
import { AuthToken } from '@Entities/AuthToken';

import { FieldDefn } from '@Route-Tools/Permissions';
import { checkAccessToEntity } from '@Route-Tools/Permissions';
import { isStringValidator, isNumberValidator, isSArraySet, isDateValidator } from '@Route-Tools/Permissions';
import { simpleGetter, simpleSetter, sArraySetter, dateStringGetter } from '@Route-Tools/Permissions';

import { Logger } from '@Tools/Logging';
import { VKeyedCollection } from '@Tools/vTypes';

// NOTE: this class cannot have functions in them as they are just JSON to and from the database
export class PlaceEntity implements Entity {
  public placeId: string;       // globally unique place identifier
  public name: string;          // Human friendly name of the place
  public description: string;   // Human friendly description of the place
  public accountId: string;     // the 'owner' of the place (should be sponsor of the domain)
  public domainId: string;      // domain the place is in
  public address: string;       // Address within the domain

  // admin stuff
  public iPAddrOfFirstContact: string; // IP address that registered this place
  public whenPlaceEntryCreated: Date; // What the variable name says
};

// Get the value of a place field with the fieldname.
// Checks to make sure the getter has permission to get the values.
// Returns the value. Could be 'undefined' whether the requestor doesn't have permissions or that's
//     the actual field value.
export async function getPlaceField(pAuthToken: AuthToken, pPlace: PlaceEntity,
                                pField: string, pRequestingAccount?: AccountEntity): Promise<any> {
  let val;
  const perms = placeFields[pField];
  if (perms) {
    if (await checkAccessToEntity(pAuthToken, pPlace, perms.get_permissions, pRequestingAccount)) {
        if (typeof(perms.getter) === 'function') {
          val = perms.getter(perms, pPlace);
        };
    };
  };
  return val;
};
// Set a place field with the fieldname and a value.
// Checks to make sure the setter has permission to set.
// Returns 'true' if the value was set and 'false' if the value could not be set.
export async function setPlaceField(pAuthToken: AuthToken,  // authorization for making this change
            pPlace: PlaceEntity,               // the place being changed
            pField: string, pVal: any,          // field being changed and the new value
            pRequestingAccount?: AccountEntity, // Account associated with pAuthToken, if known
            pUpdates?: VKeyedCollection         // where to record updates made (optional)
                    ): Promise<boolean> {
  let didSet = false;
  const perms = placeFields[pField];
  if (perms) {
    Logger.cdebug('field-setting', `setPlaceField: ${pField}=>${JSON.stringify(pVal)}`);
    if (await checkAccessToEntity(pAuthToken, pPlace, perms.set_permissions, pRequestingAccount)) {
      Logger.cdebug('field-setting', `setPlaceField: access passed`);
      if (perms.validate(perms, pPlace, pVal)) {
        Logger.cdebug('field-setting', `setPlaceField: value validated`);
        if (typeof(perms.setter) === 'function') {
          perms.setter(perms, pPlace, pVal);
          didSet = true;
          // If the caller passed a place to return the update info, update same
          if (pUpdates) {
            getPlaceUpdateForField(pPlace, pField, pUpdates);
          };
        };
      };
    };
  };
  return didSet;
};
// Generate an 'update' block for the specified field or fields.
// This is a field/value collection that can be passed to the database routines.
// Note that this directly fetches the field value rather than using 'getter' since
//     we want the actual value (whatever it is) to go into the database.
// If an existing VKeyedCollection is passed, it is added to an returned.
export function getPlaceUpdateForField(pPlace: PlaceEntity,
              pField: string | string[], pExisting?: VKeyedCollection): VKeyedCollection {
  const ret: VKeyedCollection = pExisting ?? {};
  if (Array.isArray(pField)) {
    pField.forEach( fld => {
      const perms = placeFields[fld];
      makePlaceFieldUpdate(perms, pPlace, ret);
    });
  }
  else {
    const perms = placeFields[pField];
    makePlaceFieldUpdate(perms, pPlace, ret);
  };
  return ret;
};

// if the field has an updater, do that, elas just create an update for the base named field
function makePlaceFieldUpdate(pPerms: FieldDefn, pPlace: PlaceEntity, pRet: VKeyedCollection): void {
  if (pPerms) {
    if (pPerms.updater) {
      pPerms.updater(pPerms, pPlace, pRet);
    }
    else {
      pRet[pPerms.entity_field] = (pPlace as any)[pPerms.entity_field];
    };
  };
};

// Naming and access for the fields in a PlaceEntity.
// Indexed by request_field_name.
export const placeFields: { [key: string]: FieldDefn } = {
  'placeId': {
    entity_field: 'placeId',
    request_field_name: 'placeId',
    get_permissions: [ 'all' ],
    set_permissions: [ 'none' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'name': {
    entity_field: 'name',
    request_field_name: 'name',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'description': {
    entity_field: 'description',
    request_field_name: 'description',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'accountId': {
    entity_field: 'accountId',
    request_field_name: 'accountId',
    get_permissions: [ 'all' ],
    set_permissions: [ 'none' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'domainId': {
    entity_field: 'domainId',
    request_field_name: 'domainId',
    get_permissions: [ 'all' ],
    set_permissions: [ 'none' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'address': {
    entity_field: 'address',
    request_field_name: 'address',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  // admin stuff
  'addr_of_first_contact': {
    entity_field: 'iPAddrOfFirstContact',
    request_field_name: 'addr_of_first_contact',
    get_permissions: [ 'all' ],
    set_permissions: [ 'none' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'when_place_entry_created': {
    entity_field: 'whenPlaceEntryCreated',
    request_field_name: 'when_place_entry_created',
    get_permissions: [ 'all' ],
    set_permissions: [ 'none' ],
    validate: isDateValidator,
    setter: undefined,
    getter: dateStringGetter
  }
};
