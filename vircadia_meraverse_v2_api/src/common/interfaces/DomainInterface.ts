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

export interface DomainInterface {
    id: string; // globally unique domain identifier
    name: string; // domain name/label
    visibility: string; // visibility of this entry in general domain lists
    publicKey: string; // DomainServers's public key in multi-line PEM format
    apiKey: string; // Access key if a temp domain
    sponsorAccountId: string; // The account that gave this domain an access key
    iceServerAddr: string; // IP address of ICE server being used by this domain

    // Information that comes in via heartbeat
    version: string; // DomainServer's build version (like "K3")
    protocol: string; // Protocol version
    networkAddr: string; // reported network address
    networkPort: string; // reported network address
    networkingMode: string; // one of "full", "ip", "disabled"
    restricted: boolean; // 'true' if restricted to users with accounts
    numUsers: number; // total number of logged in users
    anonUsers: number; // number of anonymous users
    hostnames: string[]; // User segmentation

    // More information that's metadata that's passed in PUT domain
    capacity: number; // Total possible users
    description: string; // Short description of domain
    contactInfo: string; // domain contact information
    thumbnail: string; // thumbnail image of domain
    images: string[]; // collection of images for the domain
    maturity: string; // Maturity rating
    restriction: string; // Access restrictions ("open")
    managers: string[]; // Usernames of people who are domain admins
    tags: string[]; // Categories for describing the domain

    // admin stuff
    iPAddrOfFirstContact: string; // IP address that registered this domain
    whenCreated: Date; // What the variable name says
    active: boolean; // domain is heartbeating
    timeOfLastHeartbeat: Date; // time of last heartbeat
    lastSenderKey: string; // a key identifying the sender
}
