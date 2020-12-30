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

// Permission codes:
//  'all': any one
//  'domain': the requesting authToken is for a domain and the sponsor account matches
//  'owner': the requesting account is the owner of the target account
//  'friend': the requesting account is a friend of the target account
//  'connection': the requesting account is a connection of the target account
//  'admin': the requesting account has 'admin' privilages
//  'sponsor': the requesting account is the sponsor of the traget domain
//  'domainaccess': the target entity has a domain and requesting account must be sponsor
export class Perm {
  public static NONE     = 'none';
  public static ALL      = 'all';
  public static PUBLIC   = 'public';      // target account is publicly visible
  public static DOMAIN   = 'domain';      // check against .sponsorId
  public static OWNER    = 'owner';       // check against .id or .accountId
  public static FRIEND   = 'friend';      // check member of .friends
  public static CONNECTION = 'connection';// check member of .connections
  public static ADMIN    = 'admin';       // check if isAdmin
  public static SPONSOR  = 'sponsor';     // check against .sponsorAccountId
  public static DOMAINACCESS  = 'domainaccess'; // check that entities domain has access
};

