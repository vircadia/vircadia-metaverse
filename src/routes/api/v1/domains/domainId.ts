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
import { Accounts } from '@Entities/Accounts';

import { VKeyedCollection } from '@Tools/vTypes';
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
  if (req.vDomain) {
    const updated: VKeyedCollection = {};
    const valuesToSet = req.body.domain;
    if (valuesToSet.hasOwnProperty('version')) updated.version = valuesToSet.version;
    if (valuesToSet.hasOwnProperty('protocol')) updated.protocol = valuesToSet.protocol;
    if (valuesToSet.hasOwnProperty('network_addr')) updated.networkAddr = valuesToSet.network_addr;
    if (valuesToSet.hasOwnProperty('automatic_networking')) updated.networkingMode = valuesToSet.automatic_networking;
    if (valuesToSet.hasOwnProperty('restricted')) updated.restricted = valuesToSet.restricted;
    if (valuesToSet.hasOwnProperty('capacity')) updated.capacity = valuesToSet.capacity;
    if (valuesToSet.hasOwnProperty('description')) updated.description = valuesToSet.description;
    if (valuesToSet.hasOwnProperty('maturity')) updated.maturity = valuesToSet.maturity;
    if (valuesToSet.hasOwnProperty('restriction')) updated.restriction = valuesToSet.restriction;
    if (valuesToSet.hasOwnProperty('hosts')) {
      updated.hosts = CleanedStringArray(valuesToSet.hosts);
    };
    if (valuesToSet.hasOwnProperty('tags')) {
      updated.tags = CleanedStringArray(valuesToSet.tags);
    };
    if (valuesToSet.hasOwnProperty('heartbeat')) {
      updated.numUsers = Number(valuesToSet.heartbeat.num_users);
      updated.anonUsers = Number(valuesToSet.heartbeat.num_anon_users);
      updated.totalUsers = updated.numUsers + updated.anonUsers;
    };
    updated.timeOfLastHeartbeat = new Date();

    Logger.debug('procPutDomains. updating=' + JSON.stringify(updated));
    await Domains.updateEntityFields(req.vDomain, updated);
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
    if (Accounts.isAdmin(req.vAuthAccount)) {
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
