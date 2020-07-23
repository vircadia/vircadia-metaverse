//   Copyright 2020 Robert Adams
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

export class DomainEntity {
  public domainId: string;     // globally unique domain identifier
  public placeName: string;    // place name
  public publicKey: string;    // DomainServers's public key
  public apiKey: string;       // Access key if a temp domain
  public sponserAccountID: string; // The account that gave this domain an access key
  public iceServerAddr: string;// IP address of ICE server being used by this domain

  // Information that comes in via heartbeat
  public version: string;      // DomainServer's build version (like "K3")
  public protocol: string;     // Protocol version
  public networkAddr: string;  // reported network address
  public networkingMode: string;   // one of "full", ?
  public restricted: boolean;  // 'true' if restricted to users with accounts
  public numUsers: number;     // regular users logged in
  public anonUsers: number;    // number of anonymous users
  public totalUsers: number;   // number of users
  public hostnames: string[];  // User segmentation

  // More information that's metadata that's passed in PUT domain
  public capacity: number;     // Total possible users
  public description: string;  // Short description of domain
  public maturity: string;     // Maturity rating
  public restriction: string;  // Access restrictions ("open")
  public hosts: string[];      // Usernames of people who can be domain "hosts"
  public tags: string[];       // Categories for describing the domain

  // admin stuff
  public iPAddrOfFirstContact: string; // IP address that registered this domain
  public whenDomainEntryCreated: Date; // What the variable name says
  public timeOfLastHeartbeat: Date;    // time of last heartbeat
  public lastSenderKey: string;        // a key identifying the sender
};

