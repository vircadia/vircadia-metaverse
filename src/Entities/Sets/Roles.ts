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


import { IsNotNullOrEmpty } from "@Tools/Misc";

// Class to manage the manipulations on roles that accounts can have
export class Roles {
    // at the moment, the only role is 'admin'
    public static ADMIN = "admin";   // someone who has metaverse-server admin
    public static USER = "user";     // a 'user' or 'person'

    // See if the passed role code is a known role token
    static async KnownRole(pScope: string): Promise<boolean> {
        return [Roles.ADMIN, Roles.USER].includes(pScope);
    }

}
