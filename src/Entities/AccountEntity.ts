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
import { AuthToken } from '@Entities/AuthToken';
import { Accounts } from '@Entities/Accounts';

import { FieldDefn } from '@Route-Tools/Permissions';
import { isStringValidator, isNumberValidator, isSArraySet, isDateValidator } from '@Route-Tools/Permissions';
import { simpleGetter, simpleSetter, sArraySetter, dateStringGetter } from '@Route-Tools/Permissions';
import { getEntityField, setEntityField, getEntityUpdateForField } from '@Route-Tools/Permissions';

import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

// NOTE: this class cannot have functions in them as they are just JSON to and from the database
export class AccountEntity implements Entity {
  public id: string;
  public username: string;
  public email: string;
  public accountSettings: string; // JSON of client settings
  public imagesHero: string;
  public imagesThumbnail: string;
  public imagesTiny: string;

  public locationConnected: boolean;
  public locationPath: string;        // "/floatX,floatY,floatZ/floatX,floatY,floatZ,floatW"
  public locationPlaceId: string;     // uuid of place
  public locationDomainId: string;    // uuid of domain located in
  public locationNetworkAddress: string;
  public locationNetworkPort: number;
  public locationNodeId: string;      // sessionId
  public availability: string;  // on of 'none', 'friends', 'connections', 'all'

  public connections: string[];
  public friends: string[];
  public locker: string;      // JSON blob stored for user from server

  // User authentication
  public passwordHash: string;
  public passwordSalt: string;
  public sessionPublicKey: string;  // PEM public key generated for this session

  // Old stuff
  public xmppPassword: string;
  public discourseApiKey: string;
  public walletId: string;

  // Admin stuff
  // ALWAYS USE functions in Roles class to manipulate this list of roles
  public roles: string[];           // account roles (like 'admin')
  public IPAddrOfCreator: string;   // IP address that created this account
  public whenCreated: Date;  // date of account creation
  public timeOfLastHeartbeat: Date; // when we last heard from this user
};

// Helper function that checks to make sure 'availability' is the right value.
// Returns 'true' if availability is legal
export function checkAvailability(pAvailability: string): boolean {
  return ['none', 'all', 'friends', 'connections'].includes(pAvailability.toLowerCase());
};

// Get the value of a domain field with the fieldname.
// Checks to make sure the getter has permission to get the values.
// Returns the value. Could be 'undefined' whether the requestor doesn't have permissions or that's
//     the actual field value.
export async function getAccountField(pAuthToken: AuthToken, pAccount: AccountEntity,
                  pField: string, pRequestingAccount?: AccountEntity): Promise<any> {
  return getEntityField(accountFields, pAuthToken, pAccount, pField, pRequestingAccount);
};
// Set a domain field with the fieldname and a value.
// Checks to make sure the setter has permission to set.
// Returns 'true' if the value was set and 'false' if the value could not be set.
export async function setAccountField(pAuthToken: AuthToken,  // authorization for making this change
            pAccount: AccountEntity,            // the account being changed
            pField: string, pVal: any,          // field being changed and the new value
            pRequestingAccount?: AccountEntity, // Account associated with pAuthToken, if known
            pUpdates?: VKeyedCollection         // where to record updates made (optional)
                    ): Promise<boolean> {
  return setEntityField(accountFields, pAuthToken, pAccount, pField, pVal, pRequestingAccount, pUpdates);
};
// Generate an 'update' block for the specified field or fields.
// This is a field/value collection that can be passed to the database routines.
// Note that this directly fetches the field value rather than using 'getter' since
//     we want the actual value (whatever it is) to go into the database.
// If an existing VKeyedCollection is passed, it is added to an returned.
export function getAccountUpdateForField(pAccount: AccountEntity,
              pField: string | string[], pExisting?: VKeyedCollection): VKeyedCollection {
  return getEntityUpdateForField(accountFields, pAccount, pField, pExisting);
};

// Naming and access for the fields in a AccountEntity.
// Indexed by request_field_name.
export const accountFields: { [key: string]: FieldDefn } = {
  'id': {
    entity_field: 'id',
    request_field_name: 'id',
    get_permissions: [ 'all' ],
    set_permissions: [ 'none' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'username': {
    entity_field: 'username',
    request_field_name: 'username',
    get_permissions: [ 'all' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: async (pField: FieldDefn, pEntity: Entity, pVal: any): Promise<boolean> => {
      if (typeof(pVal) === 'string') {
        // Check username for latin alpha-numeric
        return /^[A-Za-z][A-Za-z0-9+\-_\.]*$/.test(pVal);
      };
    },
    setter: simpleSetter,
    getter: simpleGetter
  },
  'email': {
    entity_field: 'email',
    request_field_name: 'email',
    get_permissions: [ 'all' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: async (pField: FieldDefn, pEntity: Entity, pVal: any): Promise<boolean> => {
      if (typeof(pVal) === 'string') {
        // Check email for sanity
        return /^[A-Za-z0-9+\-_\.]+@[A-Za-z0-9-\.]+$/.test(pVal);
      };
      return false;
    },
    setter: (pField: FieldDefn, pEntity: Entity, pVal: any): any => {
      // emails are stored in lower-case
      (pEntity as AccountEntity).email = (pVal as string).toLowerCase();
    },
    getter: simpleGetter
  },
  'account_settings': {
    entity_field: 'accountSettings',
    request_field_name: 'account_settings',
    get_permissions: [ 'all' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'images_hero': {
    entity_field: 'imagesHero',
    request_field_name: 'images_hero',
    get_permissions: [ 'all' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'images_tiny': {
    entity_field: 'imagesTiny',
    request_field_name: 'images_tiny',
    get_permissions: [ 'all' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'images_thumbnail': {
    entity_field: 'imagesThumbnail',
    request_field_name: 'images_thumbnail',
    get_permissions: [ 'all' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'availability': {
    entity_field: 'availability',
    request_field_name: 'availability',
    get_permissions: [ 'all' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: isSArraySet,
    setter: sArraySetter,
    getter: simpleGetter
  },
  'connections': {
    entity_field: 'connections',
    request_field_name: 'connections',
    get_permissions: [ 'owner', 'admin', 'friend', 'connection' ],
    set_permissions: [ 'none' ],
    validate: isSArraySet,
    setter: sArraySetter,
    getter: simpleGetter
  },
  'friends': {
    entity_field: 'friends',
    request_field_name: 'friends',
    get_permissions: [ 'owner', 'admin', 'friend', 'connection' ],
    set_permissions: [ 'none' ],
    validate: isSArraySet,
    setter: sArraySetter,
    getter: simpleGetter
  },
  'locker': {
    entity_field: 'locker',
    request_field_name: 'locker',
    get_permissions: [ 'owner', 'admin' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },

  // User authentication
  'password': {
    entity_field: 'password',
    request_field_name: 'password',
    get_permissions: [ 'none' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: isStringValidator,
    setter: (pField: FieldDefn, pEntity: Entity, pVal: any): void => {
      Accounts.storePassword((pEntity as AccountEntity), pVal);
    },
    getter: undefined,
    // An update to the password means updates to hash and salt fields.
    updater: (pField: FieldDefn, pEntity: Entity, pUpdates: VKeyedCollection): void => {
      pUpdates.passwordHash = (pEntity as AccountEntity).passwordHash;
      pUpdates.passwordSalt = (pEntity as AccountEntity).passwordSalt;
    }
  },
  'public_key': {
    entity_field: 'sessionPublicKey',
    request_field_name: 'public_key',
    get_permissions: [ 'all' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },

  // Old stuff
  'xmpp_password': {
    entity_field: 'xmppPassword',
    request_field_name: 'xmpp_password',
    get_permissions: [ 'owner' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'discourse_api_key': {
    entity_field: 'discourseApiKey',
    request_field_name: 'discourse_api_key',
    get_permissions: [ 'owner' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'wallet_id': {
    entity_field: 'walletId',
    request_field_name: 'wallet_id',
    get_permissions: [ 'owner' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },

  // Admin stuff
  'roles': {
    entity_field: 'roles',
    request_field_name: 'roles',
    get_permissions: [ 'all' ],
    set_permissions: [ 'admin' ],
    validate: isSArraySet,
    setter: sArraySetter,
    getter: simpleGetter
  },
  'ip_addr_of_creator': {
    entity_field: 'IPAddrOfCreator',
    request_field_name: 'ip_addr_of_creator',
    get_permissions: [ 'all' ],
    set_permissions: [ 'none' ],
    validate: isStringValidator,
    setter: undefined,
    getter: simpleGetter
  },
  'when_account_created': {
    entity_field: 'whenCreated',
    request_field_name: 'when_account_created',
    get_permissions: [ 'all' ],
    set_permissions: [ 'none' ],
    validate: isDateValidator,
    setter: undefined,
    getter: dateStringGetter
  },
  'time_of_last_heartbeat': {
    entity_field: 'timeOfLastHeartbeat',
    request_field_name: 'time_of_last_heartbeat',
    get_permissions: [ 'all' ],
    set_permissions: [ 'none' ],
    validate: isDateValidator,
    setter: undefined,
    getter: dateStringGetter
  },
};