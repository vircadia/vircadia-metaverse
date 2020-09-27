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

// NOTE: these cannot have instance functions in them as they are just JSON to and from the database
export class AuthToken {
  public id: string;
  public token: string;
  public refreshToken: string;
  public scope: string[];         // a array of symbols in Scope class
  public accountId: string;       // AccountId of associated account
  public whenCreated: Date;
  public expirationTime: Date;
};
