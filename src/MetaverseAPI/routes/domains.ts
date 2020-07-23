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

'use strict';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI } from '../Middleware';
import { accountFromAuthToken } from '../Middleware';
import { domainFromParams } from '../Middleware';

import { Accounts } from '../../Entities/Accounts';
import { Domains } from '../../Entities/Domains';
import { DomainEntity } from '../../Entities/DomainEntity';
import { PaginationInfo } from '../../Entities/EntityFilters/PaginationInfo';
import { AccountEntity } from '../../Entities/AccountEntity';
import { IsNullOrEmpty } from '../../Tools/Misc';

import { Logger } from '../../Tools/Logging';

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

// GET /domains
const procGetDomains: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procGetDomains');
  if (req.vAuthAccount) {
    const pagination = new PaginationInfo(1,1000);
    pagination.parametersFromRequest(req.vRestResp);
    const domainArray: any[] = [];
    for await (const aDomain of Domains.enumerate(pagination)) {
      domainArray.push( {
        'domainid': aDomain.domainId,
        'place_name': aDomain.placeName,
        'public_key': aDomain.publicKey,
        'sponser_accountid': aDomain.sponserAccountID,
        'ice_server': aDomain.iceServerAddr,
        'version': aDomain.version,
        'protocol_version': aDomain.protocol,
        'network_addr': aDomain.networkAddr,
        'networking_mode': aDomain.networkingMode,
        'restricted': aDomain.restricted,
        'num_users': aDomain.numUsers,
        'anon_users': aDomain.anonUsers,
        'total_users': aDomain.totalUsers,
        'capacity': aDomain.capacity,
        'description': aDomain.description,
        'maturity': aDomain.maturity,
        'restriction': aDomain.restriction,
        '[] hosts': aDomain.hosts,
        '[] tags': aDomain.tags,
        'time_of_last_heartbeat': aDomain.timeOfLastHeartbeat.toISOString(),
        'last_sender_key': aDomain.lastSenderKey,
        'addr_of_first_contact': aDomain.iPAddrOfFirstContact,
        'when_domain_entry_created': aDomain.whenDomainEntryCreated.toISOString()
      });
    };
    req.vRestResp.Data = {
      'domains': domainArray
    };
  }
  else {
    req.vRestResp.respondFailure("Unauthorized");
  };
  next();
};

// PUT /domains/:domainId
// Set domain parameters.
// The sender can send or not send lots of different fields so we have to be specific
const procPutDomains: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procPutDomains');
  if (req.vRestResp) {
    if (req.vDomain) {
      let apikey:string;
      if (req.body && req.body.domain && req.body.domain.api_key) {
        apikey = req.body.domain.api_key;
      }
      if (await verifyDomainAccess(req.vDomain, req.vRestResp.getAuthToken(), apikey)) {
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
        req.vRestResp.respondFailure('Domain not authorized');
      };
    }
    else {
      req.vRestResp.respondFailure(req.vDomainError ?? 'Domain not found');
    };
  };
  next();
};

// DELETE /domains/:domainId
const procDeleteDomains: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procDeleteDomains');
  if (req.vRestResp && req.vAuthAccount) {
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
  };
  next();
};

// PUT /domains/:domainId/ice_server_address
const procPutDomainsIceServerAddress: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procPutDomainsIceServerAddress');
  if (req.vRestResp) {
    if (req.vDomain) {
        let apikey:string;
        if (req.body && req.body.domain && req.body.domain.api_key) {
          apikey = req.body.domain.api_key;
        }
      if (verifyDomainAccess(req.vDomain, req.vRestResp.getAuthToken(), apikey)) {
        if (req.body && req.body.domain && req.body.domain.ice_server_address) {
          req.vDomain.iceServerAddr = req.body.domain.ice_server_address;
        };
      }
    }
    else {
      req.vRestResp.respondFailure(req.vDomainError ?? 'unauthorized');
    };
  };
next();
};

// POST /domains/temporary
const procPostDomainsTemporary: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procPostDomainsTemporary');
  next();
};

// PUT /domains/:domainId/public_key
const procPutDomainsPublicKey: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procPutDomainsPublicKey');
  if (req.vRestResp && req.vDomain) {
    let apikey:string;
    // Get 'api_key' from multipart body
    if (req.body && req.body.domain && req.body.domain.api_key) {
      apikey = req.body.domain.api_key;
    }
    if (verifyDomainAccess(req.vDomain, req.vRestResp.getAuthToken(), apikey)) {
      Logger.debug('procPutDomainsPublicKey: domain found');
    };
  };
  next();
};

// GET /domains/:domainId/public_key
const procGetDomainsPublicKey: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procGetDomainsPublicKey');
  if (req.vRestResp && req.vDomainError) {
    req.vRestResp.Data = {
      'public_key': req.vDomain.publicKey
    };
  };
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

// Verify that the passed domain has access by either the passed authToken or the passed apikey.
async function verifyDomainAccess(pDomain: DomainEntity, pAuthToken: string, pAPIKey: string): Promise<boolean> {
  Logger.debug(`verifyDomainAccess: domainId: ${pDomain.domainId}, authT: ${pAuthToken}, apikey: ${pAPIKey}`);
  let ret: boolean = false;
  if (typeof(pAuthToken) === 'undefined' || pAuthToken === null) {
    // Auth token not available. See if APIKey does the trick
    if (pDomain.apiKey === pAPIKey) {
      ret = true;
    };
  }
  else {
    const aAccount: AccountEntity = await Accounts.getAccountWithAuthToken(pAuthToken);
    if (aAccount) {
      if (IsNullOrEmpty(pDomain.sponserAccountID)) {
        // If the domain doesn't have an associated account, form the link to this account
        pDomain.sponserAccountID = aAccount.accountId;
      };
      if (pDomain.sponserAccountID === aAccount.accountId) {
        ret = true;
      };
    };
  };
  return ret;
};

const router = Router();

router.get(   '/api/v1/domains/:domainId',      [ setupMetaverseAPI,
                                                  domainFromParams,
                                                  procGetDomainsDomainid,
                                                  finishMetaverseAPI ] );
router.get(   '/api/v1/domains',                [ setupMetaverseAPI,
                                                  accountFromAuthToken,
                                                  procGetDomains,
                                                  finishMetaverseAPI ] );
router.put(   '/api/v1/domains/:domainId',      [ setupMetaverseAPI,
                                                  domainFromParams,
                                                  procPutDomains,
                                                  finishMetaverseAPI ] );
router.delete('/api/v1/domains/:domainId',      [ setupMetaverseAPI,
                                                  domainFromParams,
                                                  accountFromAuthToken,
                                                  procDeleteDomains,
                                                  finishMetaverseAPI ] );

router.put(   '/api/v1/domains/:domainId/ice_server_address', [ setupMetaverseAPI,
                                                  domainFromParams,
                                                  procPutDomainsIceServerAddress,
                                                  finishMetaverseAPI ] );
router.post(  '/api/v1/domains/temporary',      [ setupMetaverseAPI,
                                                  procPostDomainsTemporary,
                                                  finishMetaverseAPI ] );

router.put(   '/api/v1/domains/:domainId/public_key',  [ setupMetaverseAPI,
                                                  domainFromParams,
                                                  procPutDomainsPublicKey,
                                                  finishMetaverseAPI ] );
router.get(   '/api/v1/domains/:domainId/public_key',  [ setupMetaverseAPI,
                                                  domainFromParams,
                                                  procGetDomainsPublicKey,
                                                  finishMetaverseAPI ] );

export default router;
