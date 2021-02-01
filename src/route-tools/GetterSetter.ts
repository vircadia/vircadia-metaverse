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

import { EntityFieldsDefn, FieldDefn, ValidateResponse } from '@Route-Tools/EntityFieldDefn';
import { checkAccessToEntity } from '@Route-Tools/Permissions';

import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

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
        val = await perms.getter(perms, pEntity);
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
// Returns a ValidateResponse that can include a field giving the reason for the error
export async function setEntityField(
            pPerms: EntityFieldsDefn,
            pAuthToken: AuthToken,      // authorization for making this change
            pEntity: Entity,            // the entity being changed
            pField: string, pVal: any,          // field being changed and the new value
            pRequestingAccount?: AccountEntity, // Account associated with pAuthToken, if known
            pUpdates?: VKeyedCollection         // where to record updates made (optional)
                    ): Promise<ValidateResponse> {
  let validity: ValidateResponse;
  const perms = pPerms[pField];
  if (perms) {
    try {
      Logger.cdebug('field-setting', `setEntityField: ${pField}=>${JSON.stringify(pVal)}`);
      if (await checkAccessToEntity(pAuthToken, pEntity, perms.set_permissions, pRequestingAccount)) {
        Logger.cdebug('field-setting', `setEntityField: access passed`);
        validity = await perms.validate(perms, pEntity, pVal, pAuthToken);
        if (validity.valid) {
          Logger.cdebug('field-setting', `setEntityField: value validated`);
          if (typeof(perms.setter) === 'function') {
            perms.setter(perms, pEntity, pVal);
            if (pUpdates) {
              getEntityUpdateForField(pPerms, pEntity, pField, pUpdates);
            };
          };
        }
        else {
          Logger.cdebug('field-setting', `value did not validate`);
        };
      }
      else {
        validity = { valid: false, reason: 'account cannot set field' };
      };
    }
    catch (err) {
      Logger.error(`setEntityField: exception: ${err}`);
      validity = { valid: false, reason: 'exception setting: ' + err };
    };
  }
  else {
    Logger.error(`setEntityField: no perms field. Field=${pField}`);
    validity = { valid: false, reason: `setEntityField: no perms field. Field=${pField}`};
  };
  return validity;
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

