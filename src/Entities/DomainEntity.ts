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

import { FieldDefn } from '@Route-Tools/Permissions';
import { checkAccessToDomain } from '@Route-Tools/Permissions';
import { isStringValidator, isNumberValidator, isSArraySet, isDateValidator } from '@Route-Tools/Permissions';
import { simpleGetter, simpleSetter, sArraySetter, dateStringGetter } from '@Route-Tools/Permissions';

import { createSimplifiedPublicKey } from '@Route-Tools/Util';
import { Logger } from '@Tools/Logging';
import { VKeyedCollection } from '@Tools/vTypes';

// NOTE: this class cannot have functions in them as they are just JSON to and from the database
export class DomainEntity implements Entity {
  public domainId: string;     // globally unique domain identifier
  public placeName: string;    // place name
  public publicKey: string;    // DomainServers's public key in multi-line PEM format
  public apiKey: string;       // Access key if a temp domain
  public sponserAccountId: string; // The account that gave this domain an access key
  public iceServerAddr: string;// IP address of ICE server being used by this domain

  // Information that comes in via heartbeat
  public version: string;      // DomainServer's build version (like "K3")
  public protocol: string;     // Protocol version
  public networkAddr: string;  // reported network address
  public networkingMode: string;   // one of "full", ?
  public restricted: boolean;  // 'true' if restricted to users with accounts
  public numUsers: number;     // regular users logged in
  public anonUsers: number;    // number of anonymous users
  public totalUsers: number;   // number of users
  public hostnames: string[];  // User segmentation

  // More information that's metadata that's passed in PUT domain
  public capacity: number;     // Total possible users
  public description: string;  // Short description of domain
  public maturity: string;     // Maturity rating
  public restriction: string;  // Access restrictions ("open")
  public hosts: string[];      // Usernames of people who can be domain "hosts"
  public tags: string[];       // Categories for describing the domain

  // admin stuff
  public iPAddrOfFirstContact: string; // IP address that registered this domain
  public whenDomainEntryCreated: Date; // What the variable name says
  public timeOfLastHeartbeat: Date;    // time of last heartbeat
  public lastSenderKey: string;        // a key identifying the sender

};


// Get the value of a domain field with the fieldname.
// Checks to make sure the getter has permission to get the values.
// Returns the value. Could be 'undefined' whether the requestor doesn't have permissions or that's
//     the actual field value.
export function getDomainField(pAuthToken: AuthToken, pDomain: DomainEntity, pField: string): any {
  let val;
  const perms = domainFields[pField];
  if (perms) {
    if (checkAccessToDomain(pAuthToken, pDomain, perms.get_permissions)) {
        if (typeof(perms.getter) === 'function') {
          val = perms.getter(perms, pDomain);
        };
    };
  };
  return val;
};
// Set a domain field with the fieldname and a value.
// Checks to make sure the setter has permission to set.
// Returns 'true' if the value was set and 'false' if the value could not be set.
export function setDomainField(pAuthToken: AuthToken, pDomain: DomainEntity, pField: string, pVal: any): boolean {
  let didSet = false;
  const perms = domainFields[pField];
  if (perms) {
    Logger.cdebug('field-setting', `setDomainField: ${pField}=>${JSON.stringify(pVal)}`);
    if (checkAccessToDomain(pAuthToken, pDomain, perms.set_permissions)) {
      Logger.cdebug('field-setting', `setDomainField: access passed`);
      if (perms.validate(perms, pDomain, pVal)) {
        Logger.cdebug('field-setting', `setDomainField: value validated`);
        if (typeof(perms.setter) === 'function') {
          perms.setter(perms, pDomain, pVal);
          didSet = true;
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
export function getDomainUpdateForField(pDomain: DomainEntity, pField: string | string[]): VKeyedCollection {
  const ret: VKeyedCollection = {};
  if (Array.isArray(pField)) {
    pField.forEach( fld => {
      const perms = domainFields[fld];
      makeDomainFieldUpdate(perms, pDomain, ret);
    });
  }
  else {
    const perms = domainFields[pField];
    makeDomainFieldUpdate(perms, pDomain, ret);
  };
  return ret;
};

// if the field has an updater, do that, elas just create an update for the base named field
function makeDomainFieldUpdate(pPerms: FieldDefn, pDomain: DomainEntity, pRet: VKeyedCollection): void {
  if (pPerms) {
    if (pPerms.updater) {
      pPerms.updater(pPerms, pDomain, pRet);
    }
    else {
      pRet[pPerms.entity_field] = (pDomain as any)[pPerms.entity_field];
    };
  };
};

// Naming and access for the fields in a DomainEntity.
// Indexed by request_field_name.
export const domainFields: { [key: string]: FieldDefn } = {
  'place_name': {
    entity_field: 'placeName',
    request_field_name: 'place_name',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'sponser', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'public_key': {
    entity_field: 'publicKey',
    request_field_name: 'public_key',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: (pField: FieldDefn, pEntity: Entity): any => {
      return createSimplifiedPublicKey((pEntity as DomainEntity).publicKey);
    }
  },
  'public_key_pem': {
    entity_field: 'publicKey',
    request_field_name: 'public_key_pem',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'sponsor_account_id': {
    entity_field: 'sponsorAccountId',
    request_field_name: 'sponsor_account_id',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'version': {
    entity_field: 'version',
    request_field_name: 'version',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'protocol': {
    entity_field: 'protocol',
    request_field_name: 'protocol',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'network_address': {
    entity_field: 'networkAddr',
    request_field_name: 'network_address',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'networking_mode': {
    entity_field: 'networkingMode',
    request_field_name: 'networking_mode',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'num_users': {
    entity_field: 'numUsers',
    request_field_name: 'num_users',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain' ],
    validate: isNumberValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'num_anon_users': {
    entity_field: 'anonUsers',
    request_field_name: 'num_anon_users',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain' ],
    validate: isNumberValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'restricted': {
    entity_field: 'restricted',
    request_field_name: 'restricted',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'capacity': {
    entity_field: 'capacity',
    request_field_name: 'capacity',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isNumberValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'description': {
    entity_field: 'description',
    request_field_name: 'description',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'maturity': {
    entity_field: 'description',
    request_field_name: 'description',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'restriction': {
    entity_field: 'description',
    request_field_name: 'description',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
  'hosts': {
    entity_field: 'hosts',
    request_field_name: 'hosts',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
    validate: isSArraySet,
    setter: sArraySetter,
    getter: simpleGetter
  },
  'tags': {
    entity_field: 'tags',
    request_field_name: 'tags',
    get_permissions: [ 'all' ],
    set_permissions: [ 'domain', 'sponsor', 'admin' ],
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
  'when_domain_entry_created': {
    entity_field: 'whenDomainEntryCreated',
    request_field_name: 'when_domain_entry_created',
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
  'last_sender_key': {
    entity_field: 'lastSenderKey',
    request_field_name: 'last_sender_key',
    get_permissions: [ 'all' ],
    set_permissions: [ 'none' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
};