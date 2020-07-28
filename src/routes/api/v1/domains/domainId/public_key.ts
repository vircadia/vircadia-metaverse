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
import { domainFromParams, domainAPIkeyFromMultipart, verifyDomainAccess } from '@Route-Tools/middleware';

import multer from 'multer';
import crypto from 'crypto';

import { Accounts } from '@Entities/Accounts';
import { Domains } from '@Entities/Domains';
import { DomainEntity } from '@Entities/DomainEntity';
import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { AccountEntity } from '@Entities/AccountEntity';
import { IsNullOrEmpty } from '@Tools/Misc';

import { Logger } from '@Tools/Logging';

// GET /domains/:domainId/public_key
const procGetDomainsPublicKey: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procGetDomainsPublicKey');
  if (req.vDomain) {
    req.vRestResp.Data = {
      'public_key': req.vDomain.publicKey
    };
  }
  else {
    req.vRestResp.respondFailure('No domain');
  };
  next();
};

// PUT /domains/:domainId/public_key
const procPutDomainsPublicKey: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procPutDomainsPublicKey');
  if (req.vDomain) {
  };
  next();
};

export const name = '/api/v1/domains/public_key';

export const router = Router();

router.get(   '/api/v1/domains/:domainId/public_key',  [ setupMetaverseAPI,
                                                  domainFromParams,
                                                  procGetDomainsPublicKey,
                                                  finishMetaverseAPI ] );

// The public key is sent in binary in a multipart-form.
// This creates an unpacker to catch fields 'api_key' and 'public_key'
const multiStorage = multer.memoryStorage();
const uploader = multer( { storage: multiStorage, });
  // .fields( [ { name: 'api_key' }, { name: 'public_key' }]);
router.put(   '/api/v1/domains/:domainId/public_key',  [ setupMetaverseAPI,
                                                  domainFromParams,           // vRESTResp.vDomain
                                                  uploader.none(),    // body['api_key'], files['public_key'].buffer
                                                  domainAPIkeyFromMultipart,  // vRestRest.vDomainAPIKey
                                                  verifyDomainAccess,
                                                  procPutDomainsPublicKey,
                                                  finishMetaverseAPI ] );

