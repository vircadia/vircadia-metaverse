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

import { Entity } from '@Entities/Entity';
import { AccountEntity, checkAvailability } from '@Entities/AccountEntity';
import { DomainEntity } from '@Entities/DomainEntity';
import { AuthToken } from '@Entities/AuthToken';
import { TokenScope } from '@Entities/Tokens';
import { Accounts } from '@Entities/Accounts';
import { Domains } from '@Entities/Domains';

import { SArray, VKeyedCollection } from '@Tools/vTypes';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

// A start at having a table driven access permissions to the Entity attributes.
// Each Entity field would have an entry that includes who can read or write
//    the value of the field along with getter and setter routines that
//    properly get and set the values.
// The setter is not part of the 'updated' field logic so that must be separate.
//    The best logic is to use the setter and then use the resulting Entity value
//    for the 'updated' field (since the 'set' could be a merge type operation).
export type getterFunction = (pDfd: FieldDefn, pD: Entity) => any;
export type setterFunction = (pDfd: FieldDefn, pD: Entity, pV: any) => void;
export type validateFunction = (pDfd: FieldDefn, pD: Entity, pV: any, pAuth?: AuthToken) => Promise<boolean>;
export type updaterFunction = (pDfd: FieldDefn, pD: Entity, pUpdates: VKeyedCollection) => void;
export interface FieldDefn {
    entity_field: string,
    request_field_name: string,
    get_permissions: string[],
    set_permissions: string[],
    validate: validateFunction,
    getter: getterFunction,
    setter: setterFunction,
    updater?: updaterFunction
};
export type EntityFieldsDefn = { [ key: string]: FieldDefn };

export function noValidation(pField: FieldDefn, pEntity: Entity, pValue: any): boolean {
  return true;
};
export async function isStringValidator(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<boolean> {
  return typeof(pValue) === 'string';
};
export async function isNumberValidator(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<boolean> {
  return typeof(pValue) === 'number';
};
export async function isBooleanValidator(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<boolean> {
  return typeof(pValue) === 'boolean';
};
export async function isPathValidator(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<boolean> {
  // TODO: Add regexp to check format of "domainname/float,float,float/float,float,float,float"
  // [\w +_-]*\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?\/-?\d+(\.\d*)?-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?
  return typeof(pValue) === 'string';
};
export async function isDateValidator(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<boolean> {
  return pValue instanceof Date;
};
// verify the value is a string or a set/add/remove collection of string arrays.
// This pairs with the SArray getter/setter which accepts a string (add), an
//     array of strings (set), or a manipulator (set/add/remove object).
export async function isSArraySet(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<boolean> {
  return isValidSArraySet(pValue);
};
export async function isValidSArraySet(pValue: any): Promise<boolean> {
  let ret = false;
  if (typeof(pValue) === 'string') {
    // If passed a string, setter will assume an 'add' operation
    ret = true;
  }
  else {
    if (await isValidSArray(pValue)) {
      // if we're passed an SArray, just presume a 'set'
      ret = true;
    }
    else {
      if (pValue && (pValue.set || pValue.add || pValue.remove)) {
        Logger.cdebug('field-setting', `isSArraySet: object with one of the fields`);
        let eachIsOk: boolean = true;
        if (eachIsOk && pValue.set) {
          eachIsOk = typeof(pValue.set) === 'string' || await isValidSArray(pValue.set);
          Logger.cdebug('field-setting', `isSArraySet: pValue.set is ${eachIsOk}`);
        };
        if (eachIsOk && pValue.add) {
          eachIsOk = typeof(pValue.add) === 'string' || await isValidSArray(pValue.add);
          Logger.cdebug('field-setting', `isSArraySet: pValue.add is ${eachIsOk}`);
        };
        if (eachIsOk && pValue.remove) {
          eachIsOk = typeof(pValue.remove) === 'string' || await isValidSArray(pValue.remove);
          Logger.cdebug('field-setting', `isSArraySet: pValue.remove is ${eachIsOk}`);
        };
        ret = eachIsOk;
      };
    };
  };
  return ret;
};
// Return 'true' is pValue is an array of strings
export async function isSArray(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<boolean> {
  return isValidSArray(pValue);
};
// Verify that the passed value is just an array of strings
export async function isValidSArray(pValue: any): Promise<boolean> {
  let ret = false;
  if (pValue) {
    if (Array.isArray(pValue)) {
      let allStrings = true;
      for (const val of pValue) {
        if (typeof(val) !== 'string') {
          allStrings = false;
          break;
        };
      };
      ret = allStrings;
    };
  };
  Logger.cdebug('field-setting', `isSArray: "${JSON.stringify(pValue)} is ${ret}`);
  return ret;
};
// Accepts an SArray setter (see validator) and returns each value string found
//     in the setter. This is good for making sure all values match the type
export function *walkSArraySetter(pValue:any): Generator<string> {
  if (IsNotNullOrEmpty(pValue)) {
    if (typeof(pValue) === 'string') {
      yield (pValue as string);
    }
    else {
      if (Array.isArray(pValue)) {
        for (const aVal of pValue) {
          yield aVal;
        };
      }
      else {
        for (const manipulationSection of [ 'set', 'add', 'remove' ]) {
          if (pValue.hasOwnProperty(manipulationSection)) {
            const sectionVal = pValue[manipulationSection];
            if (Array.isArray(sectionVal)) {
              for (const aVal of sectionVal) {
                yield aVal;
              };
            }
            else {
              yield sectionVal;
            };
          };
        };
      };
    };
  };
};
// Verify that all values in the passed SArray setting structure are
//    valid by applying the check function.
// Returns 'true' if all values are valid. 'false' otherwise.
export type ValidCheckFunction = (pVal: string) => boolean;
export async function verifyAllSArraySetValues(pValue: any, pCheckFunction: ValidCheckFunction): Promise<boolean> {
  let ret = false;
  if (IsNotNullOrEmpty(pCheckFunction) && await isValidSArraySet(pValue)) {
    ret = true;
    for (const aVal of walkSArraySetter(pValue)) {
      if (!pCheckFunction(aVal)) {
        ret = false;
        break;
      };
    };
  };
  return ret;
};
export function simpleGetter(pField: FieldDefn, pEntity: Entity): any {
  if (pEntity.hasOwnProperty(pField.entity_field)) {
    return (pEntity as any)[pField.entity_field];
  };
  return undefined;
};
export function simpleSetter(pField: FieldDefn, pEntity: Entity, pVal: any): void {
  if (pEntity.hasOwnProperty(pField.entity_field)) {
    Logger.cdebug('field-setting', `simpleSetter: setting ${pField.entity_field}=>${JSON.stringify(pVal)}`);
    (pEntity as any)[pField.entity_field] = pVal;
  }
  else {
    Logger.cdebug('field-setting', `simpleSetter: Entity does not have ${pField.entity_field}`);
  };
};
// A setter that will not set if the passed value is undefined, null, or a zero-length string
export function noOverwriteSetter(pField: FieldDefn, pEntity: Entity, pVal: any): void {
  // Don't overwrite a value with a null or empty value.
  if (IsNotNullOrEmpty(pVal)) {
    if (Array.isArray(pVal)) {
      if (pVal.length > 0) {
        simpleSetter(pField, pEntity, pVal);
      };
    }
    else {
      simpleSetter(pField, pEntity, pVal);
    };
  };
};
// Return a date field as an ISO formatted string
export function dateStringGetter(pField: FieldDefn, pEntity: Entity): string {
  if (pEntity.hasOwnProperty(pField.entity_field)) {
    const dateVal: Date = (pEntity as any)[pField.entity_field];
    return dateVal ? dateVal.toISOString() : undefined;
  };
  return undefined;
};
// SArray setting. The passed value can be a string (which is added to the SValue)
//     or an object with the field 'set', 'add' or 'remove'. The values of  the
//     latter fields can be a string or an array of strings.
// NOTE: there are many adaptations to different values being passed in.
//  The value should be a 'manipulator' "{ "set": SArray, "add": [ add vals ], "remove": [ remove vals ] }"
//  but this also accepts a string (presumes an "add")
//                        a string array (presumes a "set")
export function sArraySetter(pField: FieldDefn, pEntity: Entity, pVal: any): void {
  if (pEntity.hasOwnProperty(pField.entity_field)) {
    let val = (pEntity as any)[pField.entity_field];
    if (IsNullOrEmpty(val)) {
      Logger.cdebug('field-setting', `sArraySetting: setting "${pField.entity_field}" Starting with null value`);
      val = [];
    }
    else {
      // Kludge for old entiries that are just a string rather than a prople SArray
      if (typeof(val) === 'string') {
        val = [ val ];
      };
    };

    if (typeof(pVal) === 'string') {
      // If just passed a string, add it to the value SArray
      Logger.cdebug('field-setting', `sArraySetting: adding string ${pField.entity_field}`);
      SArray.add(val, pVal);
    }
    else {
      if (isSArray(pField, pEntity, pVal)) {
        // If we're passed just an SArray, presume a 'set' operation
        val = pVal;
      }
      else {
        if (typeof(pVal) === 'object' && (pVal.set || pVal.add || pVal.remove)) {
          if (pVal.set) {
            // this relies on the validator to make sure we're passed clean values
            val = (typeof(pVal.set) === 'string') ? [ pVal.set ] : pVal.set;
          };
          if (pVal.add) {
            if (Array.isArray(pVal.add)) {
              Logger.cdebug('field-setting', `sArraySetting: adding array ${pField.entity_field}=>${JSON.stringify(pVal.add)}`);
              for (const aVal of pVal.add) {
                SArray.add(val, aVal);
              };
            }
            else {
              Logger.cdebug('field-setting', `sArraySetting: adding one ${pField.entity_field}=>${JSON.stringify(pVal.add)}`);
              SArray.add(val, pVal.add);
            };
          };
          if (pVal.remove) {
            if (Array.isArray(pVal.remove)) {
              Logger.cdebug('field-setting', `sArraySetting: removing array ${pField.entity_field}=>${JSON.stringify(pVal.remove)}`);
              for (const aVal of pVal.remove) {
                SArray.remove(val, aVal);
              };
            }
            else {
              Logger.cdebug('field-setting', `sArraySetting: removing one ${pField.entity_field}=>${JSON.stringify(pVal.remove)}`);
              SArray.remove(val, pVal.remove);
            };
          };
        }
        else {
          Logger.cdebug('field-setting', `sArraySetting: passed value that is not string, SArray, or manipulation object`);
        };
      };
    };
    Logger.cdebug('field-setting', `sArraySetting: resulting ${pField.entity_field}=>${JSON.stringify(val)}`);
    (pEntity as any)[pField.entity_field] = cleanStringArray(val);
  };
};

// Clean up the object and make sure it is just an array of strings.
// Passed what should be an array of strings and returns an array of only strings.
function cleanStringArray(pValues: any): string[] {
  const ret: string[] = [];
  if (Array.isArray(pValues)) {
    for (const val of pValues) {
      if (typeof(val) === 'string') {
        ret.push(val);
      };
    };
  };
  return ret;
};

// Get the value of a entity field with the fieldname.
// Checks to make sure the getter has permission to get the values.
// Returns the value. Could be 'undefined' whether the requestor doesn't have permissions or that's
//     the actual field value.
export async function getEntityField(
                  pPerms: EntityFieldsDefn,
                  pAuthToken: AuthToken, pEntity: Entity,
                  pField: string, pRequestingAccount?: AccountEntity): Promise<any> {
  let val;
  const perms = pPerms[pField];
  if (perms) {
    Logger.cdebug('field-setting', `getEntityField: get ${pField}, perms.entity_field=${perms.entity_field}`);
    if (await checkAccessToEntity(pAuthToken, pEntity, perms.get_permissions, pRequestingAccount)) {
      Logger.cdebug('field-setting', `getEntityField: access passed`);
      if (typeof(perms.getter) === 'function') {
        Logger.cdebug('field-setting', `getEntityField: doing getter`);
        val = perms.getter(perms, pEntity);
        Logger.cdebug('field-setting', `getEntityField: ${pField}=>${JSON.stringify(val)}`);
      }
      else {
        Logger.cdebug('field-setting', `getEntityField: no function getter ${pField}, perms.entity_field=${perms.entity_field}, typeof(perms.getter)=${typeof(perms.getter)}`);
        Logger.cdebug('field-setting', `getEntityField: no function getter perms=${JSON.stringify(perms)}`);
      };
    };
  };
  return val;
};

// Set a entity field with the fieldname and a value.
// Checks to make sure the setter has permission to set.
// Returns 'true' if the value was set and 'false' if the value could not be set.
export async function setEntityField(
            pPerms: EntityFieldsDefn,
            pAuthToken: AuthToken,      // authorization for making this change
            pEntity: Entity,            // the entity being changed
            pField: string, pVal: any,          // field being changed and the new value
            pRequestingAccount?: AccountEntity, // Account associated with pAuthToken, if known
            pUpdates?: VKeyedCollection         // where to record updates made (optional)
                    ): Promise<boolean> {
  let didSet = false;
  const perms = pPerms[pField];
  if (perms) {
    Logger.cdebug('field-setting', `setEntityField: ${pField}=>${JSON.stringify(pVal)}`);
    if (await checkAccessToEntity(pAuthToken, pEntity, perms.set_permissions, pRequestingAccount)) {
      Logger.cdebug('field-setting', `setEntityField: access passed`);
      if (await perms.validate(perms, pEntity, pVal, pAuthToken)) {
        Logger.cdebug('field-setting', `setEntityField: value validated`);
        if (typeof(perms.setter) === 'function') {
          perms.setter(perms, pEntity, pVal);
          didSet = true;
          if (pUpdates) {
            getEntityUpdateForField(pPerms, pEntity, pField, pUpdates);
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
export function getEntityUpdateForField(
            pPerms: EntityFieldsDefn,
            pEntity: Entity,
            pField: string | string[],
            pExisting?: VKeyedCollection): VKeyedCollection {
  const ret: VKeyedCollection = pExisting ?? {};
  if (Array.isArray(pField)) {
    pField.forEach( fld => {
      const perms = pPerms[fld];
      makeEntityFieldUpdate(perms, pEntity, ret);
    });
  }
  else {
    const perms = pPerms[pField];
    makeEntityFieldUpdate(perms, pEntity, ret);
  };
  return ret;
};

// if the field has an updater, do that, else just create an update for the base named field.
// This modifies the passed VKeyedCollection with the field and new value to pass to
//     the database.
function makeEntityFieldUpdate(pPerms: FieldDefn, pEntity: Entity, pRet: VKeyedCollection): void {
  if (pPerms) {
    if (pPerms.updater) {
      pPerms.updater(pPerms, pEntity, pRet);
    }
    else {
      pRet[pPerms.entity_field] = (pEntity as any)[pPerms.entity_field];
    };
  };
};

//  'all': any one
//  'domain': the requesting authToken is for a domain and the sponsor account matches
//  'owner': the requesting account is the owner of the target account
//  'friend': the requesting account is a friend of the target account
//  'connection': the requesting account is a connection of the target account
//  'admin': the requesting account has 'admin' privilages
//  'sponsor': the requesting account is the sponsor of the traget domain
export class Perm {
  public static NONE     = 'none';
  public static ALL      = 'all';
  public static DOMAIN   = 'domain';      // check against .sponsorId
  public static OWNER    = 'owner';       // check against .id or .accountId
  public static FRIEND   = 'friend';      // check member of .friends
  public static CONNECTION = 'connection';// check member of .connections
  public static ADMIN    = 'admin';       // check if isAdmin
  public static SPONSOR  = 'sponsor';     // check against .sponsorAccountId
};

// Check if the passed AuthToken has access to the passed Entity.
// Generalized for any Entity. The permissions expect 'accountId' and 'sponsorAccountId'
//    in the entities.
// The "required access" parameter lists the type of access the token must have.
// For instance, a REST request is made to get a list of users, the request token
//    goes through the list with the permissions [ 'owner', 'admin', 'friend', 'connection' ]
//    which means the requestor must be the account owner, a friend or connection of the
//    requested account or the requestor must be an admin.
// Note that the list of RequiredAccess is a OR list -- any one access type is sufficient.
export async function checkAccessToEntity(pAuthToken: AuthToken,  // token being used to access
                            pTargetEntity: Entity,              // entity being accessed
                            pRequiredAccess: string[],          // permissions required to access domain
                            pRequestingAccount?: AccountEntity  // requesting account if known
                    ): Promise<boolean> {
  let requestingAccount = pRequestingAccount;
  let canAccess: boolean = false;
  if (IsNotNullOrEmpty(pAuthToken) && IsNotNullOrEmpty(pTargetEntity)) {
    for (const perm of pRequiredAccess) {
      Logger.cdebug('field-setting', `checkAccessToEntity: checking ${perm}`);
      switch (perm) {
        case Perm.ALL:
          canAccess = true;
          break;
        case Perm.DOMAIN:
          // requestor is a domain and it's account is the domain's sponsoring account
          if (SArray.has(pAuthToken.scope, TokenScope.DOMAIN)) {
            if (pTargetEntity.hasOwnProperty('sponsorAccountId')) {
              Logger.cdebug('field-setting', `checkAccessToEntity: authToken is domain. auth.AccountId=${pAuthToken.accountId}, sponsor=${(pTargetEntity as any).sponsorAccountId}`);
              canAccess = pAuthToken.accountId === (pTargetEntity as any).sponsorAccountId;
            }
            else {
              // Super special case where domain doesn't have a sponsor but has an api_key.
              // In this case, the API_KEY is put in the accountId field of the DOMAIN scoped AuthToken
              if (pTargetEntity.hasOwnProperty('apiKey')) {
                canAccess = pAuthToken.accountId === (pTargetEntity as any).apiKey;
              };
            };
          };
          break;
        case Perm.OWNER:
          // The requestor wants to be the same account as the target entity
          if (pTargetEntity.hasOwnProperty('id')) {
            canAccess = pAuthToken.accountId === (pTargetEntity as AccountEntity).id;
          };
          if (!canAccess && pTargetEntity.hasOwnProperty('accountId')) {
            canAccess = pAuthToken.accountId === (pTargetEntity as any).accountId;
          };
          break;
        case Perm.FRIEND:
          // The requestor is a 'friend' of the target entity
          if (pTargetEntity.hasOwnProperty('friends')) {
            const targetFriends: string[] = (pTargetEntity as AccountEntity).friends;
            if (targetFriends) {
              requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
              canAccess = SArray.hasNoCase(targetFriends, requestingAccount.username);
            };
          };
          break;
        case Perm.CONNECTION:
          // The requestor is a 'connection' of the target entity
          if (pTargetEntity.hasOwnProperty('connections')) {
            const targetConnections: string[] = (pTargetEntity as AccountEntity).connections;
            if (targetConnections) {
              requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
              canAccess = SArray.hasNoCase(targetConnections, requestingAccount.username);
            };
          };
          break;
        case Perm.ADMIN:
          // If the authToken is an account, has access if admin
          if (SArray.has(pAuthToken.scope, TokenScope.OWNER)) {
            Logger.cdebug('field-setting', `checkAccessToEntity: admin. auth.AccountId=${pAuthToken.accountId}`);
            requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
            canAccess = Accounts.isAdmin(requestingAccount);
          };
          break;
        case Perm.SPONSOR:
          // Requestor is a regular account and is the sponsor of the domain
          if (SArray.has(pAuthToken.scope, TokenScope.OWNER)) {
            if (pTargetEntity.hasOwnProperty('sponsorAccountId')) {
              Logger.cdebug('field-setting', `checkAccessToEntity: authToken is domain. auth.AccountId=${pAuthToken.accountId}, sponsor=${(pTargetEntity as any).sponsorAccountId}`);
              canAccess = pAuthToken.accountId === (pTargetEntity as DomainEntity).sponsorAccountId;
            };
          };
          break;
        default:
          canAccess = false;
          break;
      }
      // If some permission allows access, we are done
      if (canAccess) break;
    };
  };
  return canAccess;
};