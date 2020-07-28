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

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI, domainAPIkeyFromBody, verifyDomainAccess } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';
import { domainFromParams } from '@Route-Tools/middleware';

import { Domains } from '@Entities/Domains';

import { Logger } from '@Tools/Logging';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

// GET /domains/:domainId
// Return a small snippet if domain data for the domainId specified in the request
const procGetDomainsDomainid: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procGetDomainDomainid');
  if (req.vDomain) {
    const aDomain = req.vDomain;
    req.vRestResp.Data = {
      'domain': {
        'id': aDomain.domainId,
        'ice_server_address': aDomain.iceServerAddr,
        'name': aDomain.placeName
      }
    };
  }
  else {
    req.vRestResp.respondFailure(req.vDomainError);
  };
  next();
};

// PUT /domains/:domainId
// Set domain parameters.
// The sender can send or not send lots of different fields so we have to be specific
const procPutDomains: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procPutDomains');
  if (req.vDomain) {
    const aDomain = req.vDomain;
    const valuesToSet = req.body.domain;
    if (valuesToSet.version) aDomain.version = valuesToSet.version;
    if (valuesToSet.protocol_version) aDomain.protocol = valuesToSet.protocol_version;
    if (valuesToSet.network_addr) aDomain.networkAddr = valuesToSet.network_addr;
    if (valuesToSet.automatic_networking) aDomain.networkingMode = valuesToSet.automatic_networking;
    if (valuesToSet.restricted) aDomain.restricted = valuesToSet.restricted;
    if (valuesToSet.capacity) aDomain.capacity = valuesToSet.capacity;
    if (valuesToSet.description) aDomain.description = valuesToSet.description;
    if (valuesToSet.maturity) aDomain.maturity = valuesToSet.maturity;
    if (valuesToSet.restriction) aDomain.restriction = valuesToSet.restriction;
    if (valuesToSet.hosts) {
      aDomain.hosts = CleanedStringArray(valuesToSet.hosts);
    };
    if (valuesToSet.tags) {
      aDomain.tags = CleanedStringArray(valuesToSet.tags);
    };
    if (valuesToSet.heartbeat) {
      if (valuesToSet.heartbeat.num_users) aDomain.numUsers = Number(valuesToSet.heartbeat.num_users);
      if (valuesToSet.heartbeat.num_anon_users) aDomain.anonUsers = Number(valuesToSet.heartbeat.num_anon_users);
      aDomain.totalUsers = aDomain.numUsers + aDomain.anonUsers;

    };
    aDomain.timeOfLastHeartbeat = new Date();
  }
  else {
    req.vRestResp.respondFailure(req.vDomainError ?? 'Domain not found');
  };
  next();
};

// DELETE /domains/:domainId
const procDeleteDomains: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procDeleteDomains');
  if (req.vAuthAccount) {
    if (req.vAuthAccount.isAdmin) {
      if (req.vDomain) {
        Domains.removeDomain(req.vDomain);
      }
      else {
        req.vRestResp.respondFailure('Target domain does not exist');
      };
    }
    else {
      req.vRestResp.respondFailure('Not authorized');
    };
  }
  else {
    req.vRestResp.respondFailure('Not authorized');
  }
  next();
};

// We are passed a thing that should be just an array of strings
//    but make sure the caller isn't messing with us
function CleanedStringArray(pValues: any): string[] {
  const ret: string[] = [];
  if (Array.isArray(pValues)) {
    pValues.forEach( val => {
      if (typeof val === 'string') {
        ret.push(val);
      };
    });
  };
  return ret;
};

export const name = '/api/v1/domains/:domainId';

export const router = Router();

router.get(   '/api/v1/domains/:domainId',      [ setupMetaverseAPI,
                                                  domainFromParams,
                                                  procGetDomainsDomainid,
                                                  finishMetaverseAPI ] );
router.put(   '/api/v1/domains/:domainId',      [ setupMetaverseAPI,
                                                  domainFromParams,     // set vDomain
                                                  domainAPIkeyFromBody, // set vDomainAPIKey
                                                  verifyDomainAccess,
                                                  procPutDomains,
                                                  finishMetaverseAPI ] );
router.delete('/api/v1/domains/:domainId',      [ setupMetaverseAPI,
                                                  domainFromParams,
                                                  accountFromAuthToken,
                                                  procDeleteDomains,
                                                  finishMetaverseAPI ] );
