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
import { AuthToken } from '@Entities/AuthToken';

import { checkAccessToEntity } from '@Route-Tools/Permissions';

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

// ==== VALIDATE ===========================================================================
// Functions that validate that the passed value is of the expected type.
// The values passed are from the user and thus need much checking.
// Return Promise<boolean> of 'true' if pValue is legal.
//     (These are async because some validation might require looking up some database info)
export async function noValidation(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<boolean> {
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
  // Regexp to check format of "domainname/float,float,float/float,float,float,float"
  return /^[\w +_-]*\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?$/.test(pValue);
  // return typeof(pValue) === 'string';
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
export function isValidSArraySet(pValue: any): boolean {
  let ret = false;
  if (typeof(pValue) === 'string') {
    // If passed a string, setter will assume an 'add' operation
    Logger.cdebug('field-setting', `isValidSArraySet: value is string and assuming set`);
    ret = true;
  }
  else {
    if (isValidSArray(pValue)) {
      Logger.cdebug('field-setting', `isValidSArraySet: value is an SArray`);
      // if we're passed an SArray, just presume a 'set'
      ret = true;
    }
    else {
      if (pValue && (pValue.set || pValue.add || pValue.remove)) {
        Logger.cdebug('field-setting', `isValidSArraySet: object with one of the fields`);
        let eachIsOk: boolean = true;
        if (eachIsOk && pValue.set) {
          eachIsOk = typeof(pValue.set) === 'string' || isValidSArray(pValue.set);
          Logger.cdebug('field-setting', `isValidSArraySet: pValue.set is ${eachIsOk}`);
        };
        if (eachIsOk && pValue.add) {
          eachIsOk = typeof(pValue.add) === 'string' || isValidSArray(pValue.add);
          Logger.cdebug('field-setting', `isValidSArraySet: pValue.add is ${eachIsOk}`);
        };
        if (eachIsOk && pValue.remove) {
          eachIsOk = typeof(pValue.remove) === 'string' || isValidSArray(pValue.remove);
          Logger.cdebug('field-setting', `isValidSArraySet: pValue.remove is ${eachIsOk}`);
        };
        ret = eachIsOk;
      };
    };
  };
  return ret;
};
// Return 'true' is pValue is an array of strings
export function isSArray(pField: FieldDefn, pEntity: Entity, pValue: any): boolean {
  return isValidSArray(pValue);
};
// Verify that the passed value is just an array of strings
export function isValidSArray(pValue: any): boolean {
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
  if (IsNotNullOrEmpty(pCheckFunction) && isValidSArraySet(pValue)) {
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

// ======== GETTER ============================================================
export function noGetter(pField: FieldDefn, pEntity: Entity): any {
  Logger.error(`noGetter: attempt to get field ${pField.entity_field}`);
};
// Return  the field value.
export function simpleGetter(pField: FieldDefn, pEntity: Entity): any {
  if (pEntity.hasOwnProperty(pField.entity_field)) {
    return (pEntity as any)[pField.entity_field];
  };
  return undefined;
};
// Return a date field as an ISO formatted string
export function dateStringGetter(pField: FieldDefn, pEntity: Entity): string {
  if (pEntity.hasOwnProperty(pField.entity_field)) {
    const dateVal: Date = (pEntity as any)[pField.entity_field];
    return dateVal ? dateVal.toISOString() : undefined;
  };
  return undefined;
};

// ======== SETTER ===============================================================
export function noSetter(pField: FieldDefn, pEntity: Entity, pVal: any): void {
  Logger.error(`noSetter: attempt to set field ${pField.entity_field}`);
};
// Set the value of the field.
// The different type of values require different manipulations.
export function simpleSetter(pField: FieldDefn, pEntity: Entity, pVal: any): void {
  Logger.cdebug('field-setting', `simpleSetter: setting ${pField.entity_field}=>${JSON.stringify(pVal)}`);
  (pEntity as any)[pField.entity_field] = pVal;
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
// SArray setting. The passed value can be a string (which is added to the SValue)
//     or an object with the field 'set', 'add' or 'remove'. The values of  the
//     latter fields can be a string or an array of strings.
// NOTE: there are many adaptations to different values being passed in.
//  The value should be a 'manipulator' "{ "set": SArray, "add": [ add vals ], "remove": [ remove vals ] }"
//  but this also accepts a string (presumes an "add")
//                        a string array (presumes a "set")
export function sArraySetter(pField: FieldDefn, pEntity: Entity, pVal: any): void {
  const fieldName = pField.entity_field;

  Logger.cdebug('field-setting', `sArraySetter: setting ${fieldName} with ${JSON.stringify(pVal)}`);
  let val: string[] = (pEntity as any)[fieldName] ?? [];

  // Kludge for old entiries that are just a string rather than a proper SArray
  if (typeof(val) === 'string') {
    Logger.cdebug('field-setting', `sArraySetter: old value of ${fieldName} is just string. Making array`);
    val = [ val ];
  };

  if (typeof(pVal) === 'string') {
    // If just passed a string, add it to the value SArray
    Logger.cdebug('field-setting', `sArraySetter: adding string ${fieldName}`);
    SArray.add(val, pVal);
  }
  else {
    if (isSArray(pField, pEntity, pVal)) {
      // If we're passed just an SArray, presume a 'set' operation
      Logger.cdebug('field-setting', `sArraySetter: just passed SArray for ${fieldName}. Assuming set`);
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
            Logger.cdebug('field-setting', `sArraySetter: adding array ${fieldName}=>${JSON.stringify(pVal.add)}`);
            for (const aVal of pVal.add) {
              SArray.add(val, aVal);
            };
          }
          else {
            Logger.cdebug('field-setting', `sArraySetter: adding one ${fieldName}=>${JSON.stringify(pVal.add)}`);
            SArray.add(val, pVal.add);
          };
        };
        if (pVal.remove) {
          if (Array.isArray(pVal.remove)) {
            Logger.cdebug('field-setting', `sArraySetter: removing array ${fieldName}=>${JSON.stringify(pVal.remove)}`);
            for (const aVal of pVal.remove) {
              SArray.remove(val, aVal);
            };
          }
          else {
            Logger.cdebug('field-setting', `sArraySetter: removing one ${fieldName}=>${JSON.stringify(pVal.remove)}`);
            SArray.remove(val, pVal.remove);
          };
        };
      }
      else {
        Logger.cdebug('field-setting', `sArraySetter: passed value that is not string, SArray, or manipulation object`);
      };
    };
  };
  Logger.cdebug('field-setting', `sArraySetter: resulting ${fieldName}=>${JSON.stringify(val)}`);
  (pEntity as any)[pField.entity_field] = cleanStringArray(val);
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
    try {
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
        }
        else {
          Logger.cdebug('field-setting', `value did not validate`);
        };
      };
    }
    catch (err) {
      Logger.error(`setEntityField: exception: ${err}`);
      didSet = false;
    };
  }
  else {
    Logger.error(`setEntityField: no perms field. Field=${pField}`);
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

