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
import { AccountEntity } from '@Entities/AccountEntity';
import { DomainEntity } from '@Entities/DomainEntity';
import { AuthToken } from '@Entities/AuthToken';
import { TokenScope } from '@Entities/TokenScope';
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
export type validateFunction = (pDfd: FieldDefn, pD: Entity, pV: any) => boolean;
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
export function noValidation(pField: FieldDefn, pEntity: Entity, pValue: any): boolean {
  return true;
};
export function isStringValidator(pField: FieldDefn, pEntity: Entity, pValue: any): boolean {
  return typeof(pValue) === 'string';
};
export function isNumberValidator(pField: FieldDefn, pEntity: Entity, pValue: any): boolean {
  return typeof(pValue.set) === 'number';
};
export function isDateValidator(pField: FieldDefn, pEntity: Entity, pValue: any): boolean {
  return pValue instanceof Date;
};
// verify the value is a string or a set/add/remove collection of string arrays
export function isSArraySet(pField: FieldDefn, pEntity: Entity, pValue: any): boolean {
  let ret = false;
  if (pValue && (pValue.set || pValue.add || pValue.remove)) {
    Logger.cdebug('field-setting', `isSArraySet: object with one of the fields`);
    let eachIsOk = true;
    if (eachIsOk && pValue.set) {
      eachIsOk = typeof(pValue.set) === 'string' || isSArray(pField, pEntity, pValue.set);
      Logger.cdebug('field-setting', `isSArraySet: pValue.set is ${eachIsOk}`);
    };
    if (eachIsOk && pValue.add) {
      eachIsOk = typeof(pValue.add) === 'string' || isSArray(pField, pEntity, pValue.add);
      Logger.cdebug('field-setting', `isSArraySet: pValue.add is ${eachIsOk}`);
    };
    if (eachIsOk && pValue.remove) {
      eachIsOk = typeof(pValue.remove) === 'string' || isSArray(pField, pEntity, pValue.remove);
      Logger.cdebug('field-setting', `isSArraySet: pValue.remove is ${eachIsOk}`);
    };
    ret = eachIsOk;
  };
  return ret;
};
// Return 'true' is pValue is an array of strings
export function isSArray(pField: FieldDefn, pEntity: Entity, pValue: any): boolean {
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
export function simpleGetter(pField: FieldDefn, pEntity: Entity): any {
  if (pEntity.hasOwnProperty(pField.entity_field)) {
    return (pEntity as any)[pField.entity_field];
  };
  return undefined;
};
export function simpleSetter(pField: FieldDefn, pEntity: Entity, pVal: any): void {
  if (pEntity.hasOwnProperty(pField.entity_field)) {
    if (pVal.set) {
      (pEntity as any)[pField.entity_field] = pVal;
    };
  };
};
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
export function sArraySetter(pField: FieldDefn, pEntity: Entity, pVal: any): void {
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
    Logger.cdebug('field-setting', `sArraySetting: adding string ${pField.entity_field}`);
    SArray.add(val, pVal);
  }
  else {
    if (pVal && (pVal.set || pVal.add || pVal.remove)) {
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
    };
  };
  Logger.cdebug('field-setting', `sArraySetting: resulting ${pField.entity_field}=>${JSON.stringify(val)}`);
  (pEntity as any)[pField.entity_field] = val;
};

//  'all': any one
//  'domain': the requesting authToken is for a domain and the sponsor account matches
//  'owner': the requesting account is the owner of the target account
//  'friend': the requesting account is a friend of the target account
//  'connection': the requesting account is a connection of the target account
//  'admin': the requesting account has 'admin' privilages
//  'sponser': the requesting account is the sponsor of the traget domain
export class Perm {
  public static NONE     = 'none';
  public static ALL      = 'all';
  public static DOMAIN   = 'domain';
  public static OWNER    = 'owner';
  public static FRIEND   = 'friend';
  public static CONNECTION = 'connection';
  public static ADMIN    = 'admin';
  public static SPONSOR  = 'sponsor';
};

// Check if the passed AuthToken has access to the passed DomainEntity.
// The "required access" parameter lists the type of access the token must have.
// For instance, a REST request is made to change a domain parameter. The
//    RequiredAccess could be [ 'domain', 'admin', 'sponsor'] meaning the
//    token must be from either an admin account or the sponsor account for the domain.
// Note that the list of RequiredAccess is a OR list -- any one access type is sufficient.
export async function checkAccessToDomain(pAuthToken: AuthToken,       // token being used to access
                            pTargetDomain: DomainEntity,  // domain being accessed
                            pRequiredAccess: string[],    // permissions required to access domain
                            pAuthTokenAccount?: AccountEntity  // AuthToken account if known
                    ): Promise<boolean> {
  let canAccess: boolean = false;
  if (IsNotNullOrEmpty(pAuthToken) && IsNotNullOrEmpty(pTargetDomain)) {
    for (const perm of pRequiredAccess) {
      Logger.cdebug('field-setting', `checkAccessToDomain: checking ${perm}`);
      switch (perm) {
        case Perm.ALL:
          canAccess = true;
          break;
        case Perm.DOMAIN:
          if (SArray.has(pAuthToken.scope, TokenScope.DOMAIN)) {
            Logger.cdebug('field-setting', `checkAccessToDomain: authToken is domain. auth.AccountId=${pAuthToken.accountId}, sponsor=${pTargetDomain.sponserAccountId}`);
            canAccess = pAuthToken.accountId === pTargetDomain.sponserAccountId;
          };
          break;
        case Perm.ADMIN:
          // If the authToken is an account, verify that the account has administrative access
          if (SArray.has(pAuthToken.scope, TokenScope.OWNER)) {
            const acct = pAuthTokenAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
            Logger.cdebug('field-setting', `checkAccessToDomain: admin. auth.AccountId=${pAuthToken.accountId}`);
            canAccess = Accounts.isAdmin(acct);
          };
          break;
        case Perm.SPONSOR:
          if (SArray.has(pAuthToken.scope, TokenScope.OWNER)) {
            Logger.cdebug('field-setting', `checkAccessToDomain: check sponsor. auth.AccountId=${pAuthToken.accountId}, sponsor=${pTargetDomain.sponserAccountId}`);
            canAccess = pAuthToken.accountId === pTargetDomain.sponserAccountId;
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
  Logger.cdebug('field-setting', `checkAccessToDomain: canAccess=${canAccess}`);
  return canAccess;
};

// Check if the passed AuthToken has access to the passed AccountEntity.
// The "required access" parameter lists the type of access the token must have.
// For instance, a REST request is made to get a list of users, the request token
//    goes through the list with the permissions [ 'owner', 'admin', 'friend', 'connection' ]
//    which means the requestor must be the accound owner, a friend or connection of the
//    requested account or the requestor must be an admin.
// Note that the list of RequiredAccess is a OR list -- any one access type is sufficient.
export async function checkAccessToAccount(pAuthToken: AuthToken,  // token being used to access
                            pTargetAccount: AccountEntity,  // account being accessed
                            pRequiredAccess: string[],      // permissions required to access domain
                            pRequestingAccount?: AccountEntity  // requesting account if known
                    ): Promise<boolean> {
  let requestingAccount = pRequestingAccount;
  let canAccess: boolean = false;
  if (IsNotNullOrEmpty(pAuthToken) && IsNotNullOrEmpty(pTargetAccount)) {
    for (const perm of pRequiredAccess) {
      Logger.cdebug('field-setting', `checkAccessToDomain: checking ${perm}`);
      switch (perm) {
        case Perm.ALL:
          canAccess = true;
          break;
        case Perm.OWNER:
          canAccess = pAuthToken.accountId === pTargetAccount.accountId;
          break;
        case Perm.FRIEND:
          requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
          canAccess = SArray.hasNoCase(pTargetAccount.friends, requestingAccount.username);
          break;
        case Perm.CONNECTION:
          requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
          canAccess = SArray.hasNoCase(pTargetAccount.connections, requestingAccount.username);
          break;
        case Perm.ADMIN:
          // If the authToken is an account, verify that the account has administrative access
          if (SArray.has(pAuthToken.scope, TokenScope.OWNER)) {
            Logger.cdebug('field-setting', `checkAccessToAccount: admin. auth.AccountId=${pAuthToken.accountId}`);
            requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
            canAccess = Accounts.isAdmin(requestingAccount);
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