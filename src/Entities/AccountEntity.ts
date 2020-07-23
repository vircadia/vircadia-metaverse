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

import Config from '../config';

import { AuthToken } from './AuthToken';

export enum Availability {
  none = 0,
  friends,
  connections,
  all
};

export class AccountEntity {
  public accountId: string;
  public username: string;
  public email: string;
  public passwordHash: string;
  public publicKey: string;
  public authTokens: Set<AuthToken>;
  public accountSettings: string; // JSON of client settings
  public images: {
    hero: string;
    thumbNail: string;
    tiny: string;
  };
  public location: {
    connected: boolean;
    path: string;       // "/floatX,floatY,floatZ/floatX,floatY,floatZ,floatW"
    placeId: string;    // uuid of place
    domainId: string;   // uuid of domain located in
    networkAddress: string;
    networkPort: number;
    nodeId: string;     // sessionId
    discoverability: Availability
  };
  public connections: string[];
  public friends: string[];

  // Old stuff
  public xmppPassword: string;
  public discourseApiKey: string;
  public walletId: string;

  // Admin stuff
  public administrator: boolean;
  public IPAddrOfCreator: string;   // IP address that created this account
  public whenAccountCreated: Date;  // date of account creation
  public timeOfLastHeartbeat: Date; // when we last heard from this user

  // getter property that is 'true' if the user has been heard from recently
  get isOnline(): boolean {
    return this.timeOfLastHeartbeat
        && ((Date.now() - this.timeOfLastHeartbeat.getUTCMilliseconds())
              < (Config["metaverse-server"]["heartbeat-seconds-until-offline"] * 1000));
  };
  // getter property that is 'true' if the user is a grid administrator
  get isAdmin(): boolean {
    return this.administrator;
  };
};