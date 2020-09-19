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
import { pseudoRandomBytes } from "crypto";

// Class to manage the manipulations on entities scope of application
// Note: *Entity classes cannot have instance functions because they are created from the database
export class SessionEntity {
  public sessionId: string;
  public senderKey: string;

  public whenSessionCreated: Date;
  public timeOfLastReference: Date;
  public countReference: number;
};
