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

// Class to manage the manipulations on roles that accounts can have
export class AccountAvailability {
  // at the moment, the only role is 'admin'
  public static NONE: string = 'none';        // no one can see me
  public static FRIENDS: string = 'friends';  // available to friends
  public static CONNECTIONS: string = 'connections';     // available to connections
  public static ALL: string = 'all';          // available to all

  // See if the passed role code is a known role token
  static KnownAvailability(pAvailabilit: string): boolean {
    return [ AccountAvailability.NONE,
            AccountAvailability.FRIENDS,
            AccountAvailability.CONNECTIONS,
            AccountAvailability.ALL
           ].includes(pAvailabilit);
  };

};

