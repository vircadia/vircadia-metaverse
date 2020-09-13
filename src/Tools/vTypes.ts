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

import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';

// An object that is used as a keyed collection of objects.
// The key is always a string
export interface VKeyedCollection {
  [ key: string]: any
};
export interface VKeyValue {
  [ key: string]: string
};

// String array.
// Several structures are an array of strings (TokenScope, AccountRoles, ...).
export class SArray  {
  static has(pArray: string[], pCheck: string): boolean {
    return IsNullOrEmpty(pArray) ? false : pArray.includes(pCheck);
  };
  static hasNoCase(pArray: string[], pCheck: string): boolean {
    const pCheckLower = pCheck.toLowerCase();
    if (IsNotNullOrEmpty(pArray)) {
      for (const ent of pArray) {
        if (ent.toLowerCase() === pCheckLower) {
          return true;
        };
      }
    }
    return false;
  };
  static add(pArray: string[], pAdd: string): boolean {
    let added = false;
    if (typeof(pAdd) === 'string') {
      if (! pArray.includes(pAdd)) {
        pArray.push(pAdd);
        added = true;
      };
    };
    return added;
  };
  static remove(pArray: string[], pRemove: string): void {
    const idx = pArray.indexOf(pRemove);
    if (idx >= 0) {
      pArray.splice(idx, 1);
    };
  };

};