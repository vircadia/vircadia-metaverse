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

'use strict';

export interface AccountInterface {
    id: string;
    username: string;
    email: string;
    accountSettings: string; // JSON of client settings
    imagesHero: string;
    imagesThumbnail: string;
    imagesTiny: string;
    password: string;
    ethereumAddress: string;
    accountIsActive: boolean;
    accountWaitingVerification: boolean;

    locationConnected: boolean;
    locationPath: string; // "/floatX,floatY,floatZ/floatX,floatY,floatZ,floatW"
    locationPlaceId: string; // uuid of place
    locationDomainId: string; // uuid of domain located in
    locationNetworkAddress: string;
    locationNetworkPort: number;
    locationNodeId: string; // sessionId
    availability: string[]; // contains 'none', 'friends', 'connections', 'all'

    connections: string[];
    friends: string[];
    locker: any; // JSON blob stored for user from server
    profileDetail: any; // JSON blob stored for user from server

    // User authentication
    passwordHash: string;
    passwordSalt: string;
    sessionPublicKey: string; // PEM public key generated for this session
    accountEmailVerified: boolean; // default true if not present

    // Old stuff
    xmppPassword: string;
    discourseApiKey: string;
    walletId: string;

    // Admin stuff
    // ALWAYS USE functions in Roles class to manipulate this list of roles
    roles: string[]; // account roles (like 'admin')
    IPAddrOfCreator: string; // IP address that created this account
    whenCreated: Date; // date of account creation
    timeOfLastHeartbeat: Date; // when we last heard from this user
    lastOnline: Date; // User last login UTC date time
    // User game detailes
    level: number;
    bio: string;
    country: string;
    xp: number;

    achievementId: string;
}

