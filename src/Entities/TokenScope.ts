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

import { IsNotNullOrEmpty } from "@Tools/Misc";

// Class to manage the manipulations on entities scope of application
export class TokenScope {
  public static OWNER: string = 'owner';   // a 'user' or 'person'
  public static DOMAIN: string = 'domain'; // a domain-server
  // Added for ActivityPub access control
  public static READ: string = 'read';
  public static WRITE: string = 'write';

  // See if the passed scope token is a known scope code.
  static KnownScope(pScope: string): boolean {
    return [ TokenScope.OWNER, TokenScope.DOMAIN ].includes(pScope);
  };

};