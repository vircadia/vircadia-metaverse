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
export class Scope {
  public static OWNER: string = 'owner';   // a 'user' or 'person'
  public static DOMAIN: string = 'domain'; // a domain-server
  // Added for ActivityPub access control
  public static READ: string = 'read';
  public static WRITE: string = 'write';

  static KnownScope(pScope: string): boolean {
    return [ Scope.OWNER, Scope.DOMAIN ].includes(pScope);
  };

  static HasScope(pScopes: string[], pCheck:string): boolean {
    return pScopes.includes(pCheck);
  };

  // Add a role to a list of roles.
  static AddScope(pScopes: string[], pScope: string): boolean {
    let ret = false
    if (! pScopes.includes(pScope)) {
      pScopes.push(pScope);
      ret = true;
    };
    return ret;
  };

  static RemoveScope(pScopes: string[], pScope: string): boolean {
    let ret = false;
    const index: number = pScopes.indexOf(pScope);
    if (index >= 0) {
      pScopes.splice(index, 1);
      ret = true;
    };
    return ret;
  };

  static MakeScopeString(pScopes: string[]) {
    let ret = '';
    if (IsNotNullOrEmpty(pScopes)) {
      ret = pScopes.join(' ');
    };
    return ret;
  };
};