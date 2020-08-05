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
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';
import { domainFromParams } from '@Route-Tools/middleware';

import multer from 'multer';
import crypto from 'crypto';

import { Accounts } from '@Entities/Accounts';
import { Domains } from '@Entities/Domains';
import { DomainEntity } from '@Entities/DomainEntity';
import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { AccountEntity } from '@Entities/AccountEntity';
import { IsNullOrEmpty } from '@Tools/Misc';

import { Logger } from '@Tools/Logging';
import { createSimplifiedPublicKey } from '@Route-Tools/Util';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

// GET /domains
const procGetDomains: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procGetDomains');
  if (req.vAuthAccount) {
    const pagination = new PaginationInfo(1,1000);
    pagination.parametersFromRequest(req);
    const domainArray: any[] = [];
    for await (const aDomain of Domains.enumerateAsync(pagination)) {
      domainArray.push( {
        'domainId': aDomain.domainId,
        'place_name': aDomain.placeName,
        'public_key': aDomain.publicKey ? createSimplifiedPublicKey(aDomain.publicKey) : undefined,
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
        'hosts': aDomain.hosts,
        'tags': aDomain.tags,
        'time_of_last_heartbeat': aDomain.timeOfLastHeartbeat ? aDomain.timeOfLastHeartbeat.toISOString() : undefined,
        'last_sender_key': aDomain.lastSenderKey,
        'addr_of_first_contact': aDomain.iPAddrOfFirstContact,
        'when_domain_entry_created': aDomain.whenDomainEntryCreated ? aDomain.whenDomainEntryCreated.toISOString() : undefined
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

export const name = '/api/v1/domains';

export const router = Router();

router.get(   '/api/v1/domains',                [ setupMetaverseAPI,
                                                  accountFromAuthToken,
                                                  procGetDomains,
                                                  finishMetaverseAPI ] );