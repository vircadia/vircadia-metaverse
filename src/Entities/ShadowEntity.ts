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

import Config from '../config';

// NOTE: this class cannot have functions in them as they are just JSON to and from the database
// Keeps account stuff that should be kept private
export class ShadowEntity {
  public shadowId: string;
  public accountId: string;         // account this shadow associated with
  public passwordHash: string;
  public passwordSalt: string;
  public xmppPassword: string;
  public discourseApiKey: string;
  public walletId: string;

  // Admin stuff
  public administrator: boolean;
  public IPAddrOfCreator: string;   // IP address that created this account
};