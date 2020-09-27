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

import { Config } from '@Base/config';

import { Requests } from '@Entities/Requests';
import { RequestEntity } from '@Entities/RequestEntity';

import { IsNotNullOrEmpty } from "@Tools/Misc";

// Class to manage the manipulations on entities scope of application
// Note: *Entity classes cannot have instance functions because they are created from the database
export class RequestEntityConnection extends RequestEntity {
  public requestingAccountId: string;
  public targetAccountId: string;
};

export async function create(pRequesterId: string, pTargetId: string): Promise<RequestEntityConnection> {
  const newRequest = (Requests.create() as RequestEntityConnection);
  newRequest.requesterId = pRequesterId;
  newRequest.targetId = pTargetId;

  // A connection request lasts only for so long
  const expirationMinutes = Config["metaverse-server"]["connection-request-expiration-minutes"];
  newRequest.expirationTime = new Date(Date.now() + 1000 * 60 * expirationMinutes);

  return newRequest;
}


