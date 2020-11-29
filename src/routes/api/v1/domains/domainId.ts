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
import { Perm } from '@Route-Tools/Perm';
import { checkAccessToEntity } from '@Route-Tools/Permissions';
import { buildDomainInfoV1 } from '@Route-Tools/Util';

import { Domains } from '@Entities/Domains';
import { Accounts } from '@Entities/Accounts';

import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';
import Config from '@Base/config';
import { IsNullOrEmpty } from '@Tools/Misc';

// GET /api/v1/domains/:domainId
// Return a small snippet if domain data for the domainId specified in the request
const procGetDomainsDomainid: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vDomain) {
    const aDomain = req.vDomain;
    const domainInfo = await buildDomainInfoV1(aDomain);
    // A few copies are added for compatibiliity with legacy code
    domainInfo.id = domainInfo.domainId;

    req.vRestResp.Data = {
      'domain': domainInfo
    };
    // For legacy code which expects the domain information at the top level
    req.vRestResp.addAdditionalField('domain', domainInfo);
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
      let valuesToSet = req.body.domain;
      if (valuesToSet) {
        // 'valuesToSet' are the values sent to use in the request.
        // Collect the specific values set. Cannot just accept all because the
        //     requestor could do things like set the password hash or other bad things.
        for (const field of ['version', 'protocol', 'network_address', 'network_port', 'automatic_networking',
                    'restricted', 'capacity', 'description', 'maturity', 'restriction', 'managers', 'tags' ]) {
          if (valuesToSet.hasOwnProperty(field)) {
            await Domains.setField(req.vAuthToken, req.vDomain, field, valuesToSet[field], req.vAuthAccount, updated);
          };
        };
        if (valuesToSet.hasOwnProperty('heartbeat')) {
          await Domains.setField(req.vAuthToken, req.vDomain, 'num_users', valuesToSet.heartbeat.num_users, req.vAuthAccount, updated);
          await Domains.setField(req.vAuthToken, req.vDomain, 'num_anon_users', valuesToSet.heartbeat.num_anon_users, req.vAuthAccount, updated);
        };

        if (valuesToSet.meta) {
          // Setting the domain specs with the domain settings pages returns 'meta' informtion
          valuesToSet = valuesToSet.meta;
          for (const field of [ 'capacity', 'contact_info', 'description', 'managers', 'tags', 'images',
                        'maturity', 'restriction', 'thumbnail', 'world_name' ]) {
            if (valuesToSet.hasOwnProperty(field)) {
              await Domains.setField(req.vAuthToken, req.vDomain, field, valuesToSet[field], req.vAuthAccount, updated);
            };
          };
        };

        /* FOLLOWING CODE DOES NOT WORK: the socker.remoteAddress is the IP addr
                    of the front end proxy server. Need to use 'x-forwarded-for:' header
                    or whatever is  the right source.
                    Could also have the domain-server send the information more often.
                    Need to figure out what this IP address is used for.
        // If domain doesn't have a network_address, assume the sender is the domain
        if (Config["metaverse-server"]["fix-domain-network-address"]) {
          if (IsNullOrEmpty(req.vDomain.networkAddr)) {
            req.vDomain.networkAddr = req.socket.remoteAddress;
            req.vDomain.networkPort = "40102";
            updated.networkAddr = req.vDomain.networkAddr;
            updated.networkPort = req.vDomain.networkPort;
            Logger.info(`Assuming domain address of "${req.vDomain.name}" to ${req.vDomain.networkAddr}:${req.vDomain.networkPort}`);
          };
        };
        */

        // This 'POST" is used as the domain heartbeat. Remember it's alive.
        updated.timeOfLastHeartbeat = new Date();
        Logger.debug('procPutDomains. updating=' + JSON.stringify(updated));
        Domains.updateEntityFields(req.vDomain, updated);
      }
      else {
        req.vRestResp.respondFailure('badly formed data');
      };
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
  if (req.vAuthAccount && req.vDomain) {
    if (req.vAuthAccount.id === req.vDomain.sponsorAccountId || Accounts.isAdmin(req.vAuthAccount)) {
      await Domains.removeDomain(req.vDomain);
      await Domains.removeDomainContext(req.vDomain);
    }
    else {
      req.vRestResp.respondFailure('Not authorized');
    };
  }
  else {
      req.vRestResp.respondFailure('No account or target domain');
  }
  next();
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
