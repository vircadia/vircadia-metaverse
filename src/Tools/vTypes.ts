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

// This defines types that are used within our app

// An object that is used as a keyed collection of objects.
// The key is always a string
export interface VKeyedCollection {
  [ key: string]: any
};
export interface VKeyValue {
  [ key: string]: string
};

export interface SArray extends Array<string>{};
export function sArrayAdd(pArray: SArray, pAdd: string): SArray {
  if (! sArrayHas(pArray, pAdd)) {
    pArray.push(pAdd);
  }
  return pArray;
};
export function sArrayRemove(pArray: SArray, pRemove: string): SArray {
  const idx = pArray.indexOf(pRemove);
  if (idx >= 0) {
    pArray.splice(idx, 1);
  }
  return pArray;
};
export function sArrayHas(pArray: SArray, pCheck: string): boolean {
  return pArray.includes(pCheck);
};
