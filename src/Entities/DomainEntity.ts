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

import Config from '@Base/config';

import { Entity } from '@Entities/Entity';

// NOTE: this class cannot have functions in them as they are just JSON to and from the database
export class DomainEntity implements Entity {
    public id: string;           // globally unique domain identifier
    public name: string;         // domain name/label
    public visibility: string;   // visibility of this entry in general domain lists
    public publicKey: string;    // DomainServers's public key in multi-line PEM format
    public apiKey: string;       // Access key if a temp domain
    public sponsorAccountId: string; // The account that gave this domain an access key
    public iceServerAddr: string;// IP address of ICE server being used by this domain

    // Information that comes in via heartbeat
    public version: string;      // DomainServer's build version (like "K3")
    public protocol: string;     // Protocol version
    public networkAddr: string;  // reported network address
    public networkPort: string;  // reported network address
    public networkingMode: string;   // one of "full", "ip", "disabled"
    public restricted: boolean;  // 'true' if restricted to users with accounts
    public numUsers: number;     // total number of logged in users
    public anonUsers: number;    // number of anonymous users
    public hostnames: string[];  // User segmentation

    // More information that's metadata that's passed in PUT domain
    public capacity: number;     // Total possible users
    public description: string;  // Short description of domain
    public contactInfo: string;  // domain contact information
    public thumbnail: string;    // thumbnail image of domain
    public images: string[];     // collection of images for the domain
    public maturity: string;     // Maturity rating
    public restriction: string;  // Access restrictions ("open")
    public managers: string[];   // Usernames of people who are domain admins
    public tags: string[];       // Categories for describing the domain

    // admin stuff
    public iPAddrOfFirstContact: string; // IP address that registered this domain
    public whenCreated: Date;     // What the variable name says
    public active: boolean;       // domain is heartbeating
    public timeOfLastHeartbeat: Date;    // time of last heartbeat
    public lastSenderKey: string;        // a key identifying the sender

};

