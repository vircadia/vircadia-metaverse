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
import { isStringValidator, isSArraySet, isPathValidator, isDateValidator } from '@Route-Tools/Permissions';
import { simpleGetter, simpleSetter, sArraySetter, dateStringGetter } from '@Route-Tools/Permissions';
import { getEntityField, setEntityField, getEntityUpdateForField } from '@Route-Tools/Permissions';

import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

// NOTE: this class cannot have functions in them as they are just JSON to and from the database
export class PlaceEntity implements Entity {
  public id: string;            // globally unique place identifier
  public name: string;          // Human friendly name of the place
  public description: string;   // Human friendly description of the place
  public accountId: string;     // the 'owner' of the place (should be sponsor of the domain)
  public domainId: string;      // domain the place is in
  public address: string;       // Address within the domain
  public thumbnail: string;     // thumbnail for place
  public images: string[];      // images for the place

  // admin stuff
  public iPAddrOfFirstContact: string; // IP address that registered this place
  public whenCreated: Date; // What the variable name says
};

// Get the value of a place field with the fieldname.
// Checks to make sure the getter has permission to get the values.
// Returns the value. Could be 'undefined' whether the requestor doesn't have permissions or that's
//     the actual field value.
export async function getPlaceField(pAuthToken: AuthToken, pPlace: PlaceEntity,
                                pField: string, pRequestingAccount?: AccountEntity): Promise<any> {
  return getEntityField(placeFields, pAuthToken, pPlace, pField, pRequestingAccount);
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
  return setEntityField(placeFields, pAuthToken, pPlace, pField, pVal, pRequestingAccount, pUpdates);
};
// Generate an 'update' block for the specified field or fields.
// This is a field/value collection that can be passed to the database routines.
// Note that this directly fetches the field value rather than using 'getter' since
//     we want the actual value (whatever it is) to go into the database.
// If an existing VKeyedCollection is passed, it is added to an returned.
export function getPlaceUpdateForField(pPlace: PlaceEntity,
              pField: string | string[], pExisting?: VKeyedCollection): VKeyedCollection {
  return getEntityUpdateForField(placeFields, pPlace, pField, pExisting);
};

// Naming and access for the fields in a PlaceEntity.
// Indexed by request_field_name.
export const placeFields: { [key: string]: FieldDefn } = {
  'id': {
    entity_field: 'id',
    request_field_name: 'id',
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
    validate: isPathValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'path': { // alternate external name for 'address'
    entity_field: 'address',
    request_field_name: 'path',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'owner', 'admin' ],
    validate: isPathValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'thumbnail': {
    entity_field: 'thumbnail',
    request_field_name: 'thumbnail',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'images': {
    entity_field: 'images',
    request_field_name: 'images',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'owner', 'admin' ],
    validate: isSArraySet,
    setter: sArraySetter,
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
    entity_field: 'whenCreated',
    request_field_name: 'when_place_entry_created',
    get_permissions: [ 'all' ],
    set_permissions: [ 'none' ],
    validate: isDateValidator,
    setter: undefined,
    getter: dateStringGetter
  }
};
