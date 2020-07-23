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

// Clamp the passed value between a high and low
export function Clamp(pVal: number, pLow: number, pHigh: number): number {
  let ret = pVal;
  if (ret > pHigh) ret = pHigh;
  if (ret < pLow) ret = pLow;
  return ret;
}

// Return 'true' if the passed value is null or empty
export function IsNullOrEmpty(pVal: any): boolean {
  return (typeof(pVal) === 'undefined' || pVal === null);
};
// Return 'true' if the passed value is not null or empty
export function IsNotNullOrEmpty(pVal: any): boolean {
  return (typeof(pVal) !== 'undefined' && pVal !== null);
}
