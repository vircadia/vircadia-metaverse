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
import { HTTPStatusCode } from '@Route-Tools/RESTResponse';

import { accountFromAuthToken } from '@Route-Tools/middleware';
import { domainFromParams } from '@Route-Tools/middleware';
import { checkAccessToEntity, Perm } from '@Route-Tools/Permissions';
import { buildDomainInfoV1 } from '@Route-Tools/Util';

import { Domains } from '@Entities/Domains';
import { setDomainField } from '@Entities/DomainEntity';
import { Accounts } from '@Entities/Accounts';
import { Tokens, TokenScope } from '@Entities/Tokens';

import { IsNullOrEmpty } from '@Tools/Misc';
import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

// GET /api/v1/domains/:domainId
// Return a small snippet if domain data for the domainId specified in the request
const procGetDomainsDomainid: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procGetDomainDomainid');
  if (req.vDomain) {
    const aDomain = req.vDomain;
    const domainInfo = await buildDomainInfoV1(aDomain);
    // A few copies are added for compatibiliity with legacy code
    domainInfo.id = domainInfo.domainId;
    domainInfo.name = domainInfo.place_name;
    req.vRestResp.Data = {
      'domain': domainInfo
    };
  }
  else {
    req.vRestResp.respondFailure(req.vDomainError ?? 'Domain not found');
    // HTTP error will force domain renegotation
    req.vRestResp.HTTPStatus = HTTPStatusCode.Unauthorized;
  };
  next();
};

// PUT /api/v1/domains/:domainId
// Set domain parameters. Used by domain for heartbeat.
// The sender can send or not send lots of different fields so we have to be specific.
const procPutDomains: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vDomain) {
    // Either the domain itself or an admin can update the domain information
    if (await checkAccessToEntity(req.vAuthToken, req.vDomain, [ Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN ])) {
      const updated: VKeyedCollection = {};
      const valuesToSet = req.body.domain;
      // 'valuesToSet' are the values sent to use in the request.
      // Collect the specific values set. Cannot just accept all because the
      //     requestor could do things like set the password hash or other bad things.
      for (const field of ['version', 'protocol', 'network_addr', 'automatic_networking', 'restricted',
                  'capacity', 'description', 'maturity', 'restriction' ]) {
        if (valuesToSet.hasOwnProperty(field)) {
          await setDomainField(req.vAuthToken, req.vDomain, field, valuesToSet[field], req.vAuthAccount, updated);
        };
      };
      if (valuesToSet.hasOwnProperty('hosts')) {
        await setDomainField(req.vAuthToken, req.vDomain, 'hosts', { 'set': CleanedStringArray(valuesToSet.hosts)}, req.vAuthAccount, updated);
      };
      if (valuesToSet.hasOwnProperty('tags')) {
        await setDomainField(req.vAuthToken, req.vDomain, 'tags', { 'set': CleanedStringArray(valuesToSet.tags)}, req.vAuthAccount, updated);
      };
      if (valuesToSet.hasOwnProperty('heartbeat')) {
        await setDomainField(req.vAuthToken, req.vDomain, 'num_users', valuesToSet.heartbeat.num_users, req.vAuthAccount, updated);
        await setDomainField(req.vAuthToken, req.vDomain, 'num_anon_users', valuesToSet.heartbeat.num_anon_users, req.vAuthAccount, updated);
      };

      updated.timeOfLastHeartbeat = new Date();

      Logger.debug('procPutDomains. updating=' + JSON.stringify(updated));
      Domains.updateEntityFields(req.vDomain, updated);
    }
    else {
      req.vRestResp.respondFailure('Unauthorized');
    };
  }
  else {
    req.vRestResp.respondFailure(req.vDomainError ?? 'Domain not found');
    // HTTP error will force domain renegotation
    req.vRestResp.HTTPStatus = HTTPStatusCode.Unauthorized;
  };
  next();
};

// DELETE /api/v1/domains/:domainId
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
    for (const val of pValues) {
      if (typeof(val) === 'string') {
        ret.push(val);
      };
    };
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
