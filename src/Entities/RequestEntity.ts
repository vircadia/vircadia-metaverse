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

// Class to manage the manipulations on entities scope of application
// Note: *Entity classes cannot have instance functions because they are created from the database
export class RequestEntity {
    public id: string;
    public requestType: string;

    // requestor and target
    public requestingAccountId: string;
    public targetAccountId: string;

    // administration
    public expirationTime: Date;
    public whenCreated: Date;

    // requestType == HANDSHAKE
    public requesterNodeId: string;
    public targetNodeId: string;
    public requesterAccepted: boolean;
    public targetAccepted: boolean;

    // requestType == VERIFYEMAIL
    // 'requestingAccountId' is the account being verified
    public verificationCode: string;    // the code we're waiting for
}
