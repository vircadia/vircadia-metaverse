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

import { Logger } from '@Tools/Logging';

export class Availability {
  public static NONE: string = 'none';        // no one can see me
  public static FRIENDS: string = 'friends';  // available to friends
  public static CONNECTIONS: string = 'connections';     // available to connections
  public static ALL: string = 'all';          // available to all

  // See if the passed availability code is a known availability token
  static async KnownAvailability(pAvailability: string): Promise<boolean> {
    return [ Availability.NONE,
            Availability.FRIENDS,
            Availability.CONNECTIONS,
            Availability.ALL
           ].includes(pAvailability);
  };

};

