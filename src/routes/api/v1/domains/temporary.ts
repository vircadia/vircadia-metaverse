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

import { Domains } from '@Entities/Domains';
import { DomainEntity } from '@Entities/DomainEntity';

import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';

import { GenUUID } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

// https://www.npmjs.com/package/unique-names-generator
// https://github.com/andreasonny83/unique-names-generator

// POST /domains/temporary
const procPostDomainsTemporary: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('procPostDomainsTemporary');

  const customConfig: Config = {
    dictionaries: [ adjectives, colors, animals ],
    separator: '-',
    length: 3
  };
  const generatedPlacename: string = uniqueNamesGenerator(customConfig);

  const generatedAPIkey: string = GenUUID();

  const newDomain = new DomainEntity();
  newDomain.placeName = generatedPlacename;
  newDomain.domainId = GenUUID();
  newDomain.apiKey = generatedAPIkey;
  if (req.vSenderKey) {
    newDomain.iPAddrOfFirstContact = req.vSenderKey;
  };
  Domains.addDomain(newDomain);

  req.vRestResp.Data = {
    'domain': {
      'id': newDomain.domainId,
      'name': newDomain.placeName,
      'api_key': newDomain.apiKey
    }
  };
  next();
};

export const name = '/api/v1/domains/temporary';

export const router = Router();

router.post(  '/api/v1/domains/temporary',      [ setupMetaverseAPI,
                                                  procPostDomainsTemporary,
                                                  finishMetaverseAPI ] );