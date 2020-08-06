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

// Class to manage the manipulations on roles that accounts can have
export class Roles {
  // at the moment, the only role is 'admin'
  public static ADMIN: string = 'admin';   // someone who has metaverse-server admin
  public static USER: string = 'user';     // a 'user' or 'person'

  static KnownRole(pRole: string): boolean {
    return [ Roles.ADMIN, Roles.USER ].includes(pRole);
  };

  static HasRole(pRoles: string[], pCheck:string): boolean {
    return pRoles.includes(pCheck);
  };

  // Add a role to a list of roles.
  static AddRole(pRoles: string[], pRole: string): boolean {
    let ret = false
    if (! pRoles.includes(pRole)) {
      pRoles.push(pRole);
      ret = true;
    };
    return ret;
  };

  static RemoveRole(pRoles: string[], pRole: string): boolean {
    let ret = false;
    const index: number = pRoles.indexOf(pRole);
    if (index >= 0) {
      pRoles.splice(index, 1);
      ret = true;
    };
    return ret;
  };

  static MakeRoleString(pRoles: string[]) {
    let ret = '';
    if (IsNotNullOrEmpty(pRoles)) {
      ret = pRoles.join(' ');
    };
    return ret;
  };
};
