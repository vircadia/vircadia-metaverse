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


import { RESTResponse } from "./route-tools/RESTResponse";
import { AccountEntity } from "./Entities/AccountEntity";
import { DomainEntity } from "./Entities/DomainEntity";
import { PlaceEntity } from "./Entities/PlaceEntity";
import { SessionEntity } from "./Entities/SessionEntity";
import { AuthToken } from "@Entities/AuthToken";

// This defintion adds our parameters to the Request type
// Most of these are variables that are filled by processing on the request
//      (like looking up the ':accountId' parameter and filling 'vAccount')
declare global {
    namespace Express {
        interface Request {
            vRestResp?: RESTResponse;   // structure used to process the MetaverseAPI input and output JSON
            vSession?: SessionEntity;   // The session for this request
            vAuthToken?: AuthToken;     // token looked up to get vAuthToken
            vAuthAccount?: AccountEntity;   // pointer to verified AccountEntity from authToken
            vAccount?: AccountEntity;   // pointer to account found in ':accountId'
            vAccountError?: string;     // if vAccount is not set, the reason why
            vUsername?: string;         // parameter ':username'
            vDomain?: DomainEntity;     // pointer to verified DomainEntity
            vPlace?: PlaceEntity;       // pointer to place entity
            vDomainError?: string;      // if vDomain is not set, the reason why
            vDomainAPIKey?: string;     // if domain APIkey supplied in the request, it is passed here
            vTokenId?: string;          // value from :tokenId
            vSenderKey?: string;        // ip:port of sender to uniquely identify same
            vParam1?: string;           // Used by maint for parameters
            vParam2?: string;           // Used by maint for parameters
            vParam3?: string;           // Used by maint for parameters
        }
    }
}
