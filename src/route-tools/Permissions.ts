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

import { SArray } from '@Tools/vTypes';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '@Tools/Misc';
import { createSimplifiedPublicKey } from './Util';
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
export interface FieldDefn {
    entity_field: string,
    request_field_name: string,
    get_permissions: string[],
    set_permissions: string[],
    validate: validateFunction,
    getter: getterFunction,
    setter: setterFunction
};
export function simpleValidator(pField: FieldDefn, pEntity: Entity, pValue: any): boolean {
  return true;
};
export function isStringValidator(pField: FieldDefn, pEntity: Entity, pValue: any): boolean {
  return typeof(pValue) === 'string';
};
export function isNumberValidator(pField: FieldDefn, pEntity: Entity, pValue: any): boolean {
  return typeof(pValue) === 'number';
};
export function isSArraySet(pField: FieldDefn, pEntity: Entity, pValue: any): boolean {
  if (typeof(pValue) === 'string') {
    return true;
  }
  else {
    if (pValue && (pValue.set || pValue.add || pValue.remove)) {
      return true;
    };
  };
  return false;
};
export function simpleGetter(pField: FieldDefn, pEntity: Entity): any {
  return (pEntity as any)[pField.entity_field];
};
export function simpleSetter(pField: FieldDefn, pEntity: Entity, pVal: any): void {
  (pEntity as any)[pField.entity_field] = pVal;
};
// SArray setting. The passed value can be a string (which is added to the SValue)
//     or an object with the field 'set', 'add' or 'remove'. The values of  the
//     latter fields can be a string or an array of strings.
export function sArraySetter(pField: FieldDefn, pEntity: Entity, pVal: any): void {
  let val = (pEntity as any)[pField.entity_field];
  if (IsNullOrEmpty(val)) {
    Logger.cdebug('field-setting', `sArraySetting: setting "${pField.entity_field}" Starting with null value`);
    val = [];
  };
  if (typeof(pVal) === 'string') {
    Logger.cdebug('field-setting', `sArraySetting: adding string ${pField.entity_field}`);
    SArray.add(val, pVal);
  }
  else {
    if (pVal && (pVal.set || pVal.add || pVal.remove)) {
      if (pVal.set) {
        val = pVal.set;
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
            SArray.add(val, aVal);
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
      switch (perm) {
        case Perm.ALL:
          canAccess = true;
          break;
        case Perm.DOMAIN:
          if (SArray.has(pAuthToken.scope, TokenScope.DOMAIN)) {
            canAccess = pAuthToken.accountId === pTargetDomain.sponserAccountId;
          };
          break;
        case Perm.OWNER:
          canAccess = pAuthToken.accountId === pTargetDomain.sponserAccountId;
          break;
        case Perm.ADMIN:
          if (SArray.has(pAuthToken.scope, TokenScope.OWNER)) {
            const acct = pAuthTokenAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
            canAccess = Accounts.isAdmin(acct);
          };
          break;
        case Perm.SPONSOR:
          if (SArray.has(pAuthToken.scope, TokenScope.OWNER)) {
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
  let canAccess: boolean = false;
  const requestingAcct = pRequestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
  for (const perm of pRequiredAccess) {
    switch (perm) {
      case 'all':
        canAccess = true;
        break;
      case 'owner': break;
        canAccess = pAuthToken.accountId === pTargetAccount.accountId;
        break;
      case 'friend': break;
        canAccess = SArray.hasNoCase(pTargetAccount.friends, pRequestingAccount.username);
        break;
      case 'connection': break;
        canAccess = SArray.hasNoCase(pTargetAccount.connections, pRequestingAccount.username);
        break;
      case 'admin': break;
        canAccess = Accounts.isAdmin(requestingAcct);
        break;
      default:
        canAccess = true;
        break;
    }
    // If some permission allows access, we are done
    if (canAccess) break;
  }
  return canAccess;
};
