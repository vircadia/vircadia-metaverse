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

import { FieldDefn, ValidateResponse } from '@Route-Tools/EntityFieldDefn';

import { SArray } from '@Tools/vTypes';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

// ==== VALIDATE ===========================================================================
// Functions that validate that the passed value is of the expected type.
// The values passed are from the user and thus need much checking.
// Return Promise<boolean> of 'true' if pValue is legal.
//     (These are async because some validation might require looking up some database info)
export async function noValidation(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<ValidateResponse> {
  return { valid: true };
};
export async function isStringValidator(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<ValidateResponse> {
  if (typeof(pValue) === 'string') {
    return { valid: true };
  };
  return { valid: false, reason: 'field value must be a string' };
};
export async function isNumberValidator(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<ValidateResponse> {
  if (typeof(pValue) === 'number') {
    return { valid: true };
  };
  return { valid: false, reason: 'field value must be a number' };
};
export async function isBooleanValidator(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<ValidateResponse> {
  if (typeof(pValue) === 'boolean') {
    return { valid: true };
  };
  return { valid: false, reason: 'field value must be a boolean' };
};
export async function isPathValidator(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<ValidateResponse> {
  // Regexp to check format of "domainname/float,float,float/float,float,float,float"
  // if  (/^[\w\.:+_-]*\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?$/.test(pValue)) {
  // Regexp to check format of "/float,float,float/float,float,float,float"
  //    This make a "path" just the position and rotation within a domain
  if (typeof(pValue) === 'string') {
    if  (/^\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?$/.test(pValue)) {
      return { valid: true };
    };
  };
  return { valid: false, reason: 'path must be a string of the form "/f,f,f/f,f,f,f' };
};
export async function isLongPathValidator(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<ValidateResponse> {
  if (typeof(pValue) === 'string') {
    if  (/^.*\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?$/.test(pValue)) {
      return { valid: true };
    };
  };
  return { valid: false, reason: 'path must be a string of the form "optional-domain/f,f,f/f,f,f,f' };
};
export async function isDateValidator(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<ValidateResponse> {
  if (pValue instanceof Date) {
    return { valid: true };
  };
  return { valid: false, reason: 'field value must be a valid date string' };
};
export async function isObjectValidator(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<ValidateResponse> {
  if (pValue instanceof Object) {
    return { valid: true };
  };
  return { valid: false, reason: 'field value must resolve to an object' };
};
// verify the value is a string or a set/add/remove collection of string arrays.
// This pairs with the SArray getter/setter which accepts a string (add), an
//     array of strings (set), or a manipulator (set/add/remove object).
export async function isSArraySet(pField: FieldDefn, pEntity: Entity, pValue: any): Promise<ValidateResponse> {
  if (isValidSArraySet(pValue)) {
    return { valid: true };
  };
  return { valid: false, reason: 'field value must be an array of strings' };
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
  Logger.cdebug('field-setting', `isSArray: "${JSON.stringify(pValue)}" is ${ret}`);
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
export type ValidCheckFunction = (pVal: string) => Promise<boolean>;
export async function verifyAllSArraySetValues(pValue: any, pCheckFunction: ValidCheckFunction): Promise<boolean> {
  let ret = false;
  if (IsNotNullOrEmpty(pCheckFunction) && isValidSArraySet(pValue)) {
    ret = true;
    for (const aVal of walkSArraySetter(pValue)) {
      if (! await pCheckFunction(aVal)) {
        ret = false;
        break;
      };
    };
  };
  return ret;
};

// ======== GETTER ============================================================
export async function noGetter(pField: FieldDefn, pEntity: Entity): Promise<any> {
  Logger.error(`noGetter: attempt to get field ${pField.entity_field}`);
};
// Return  the field value.
export async function simpleGetter(pField: FieldDefn, pEntity: Entity): Promise<any> {
  if (pEntity.hasOwnProperty(pField.entity_field)) {
    return (pEntity as any)[pField.entity_field];
  };
  return undefined;
};
// Return a date field as an ISO formatted string
export async function dateStringGetter(pField: FieldDefn, pEntity: Entity): Promise<string> {
  if (pEntity.hasOwnProperty(pField.entity_field)) {
    const dateVal: Date = (pEntity as any)[pField.entity_field];
    return dateVal ? dateVal.toISOString() : undefined;
  };
  return undefined;
};

// ======== SETTER ===============================================================
export async function noSetter(pField: FieldDefn, pEntity: Entity, pVal: any): Promise<void> {
  Logger.error(`noSetter: attempt to set field ${pField.entity_field}`);
};
// Set the value of the field.
// The different type of values require different manipulations.
export async function simpleSetter(pField: FieldDefn, pEntity: Entity, pVal: any): Promise<void> {
  Logger.cdebug('field-setting', `simpleSetter: setting ${pField.entity_field}=>${JSON.stringify(pVal)}`);
  (pEntity as any)[pField.entity_field] = pVal;
};
// A setter that will not set if the passed value is undefined, null, or a zero-length string
export async function noOverwriteSetter(pField: FieldDefn, pEntity: Entity, pVal: any): Promise<void> {
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
export async function sArraySetter(pField: FieldDefn, pEntity: Entity, pVal: any): Promise<void> {
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