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

'use strict'

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { buildAccountProfile } from '@Route-Tools/Util';

import { Accounts } from '@Entities/Accounts';

import { Availability } from '@Entities/Sets/Availability';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';

import { Logger } from '@Tools/Logging';
import { GenericFilter } from '@Entities/EntityFilters/GenericFilter';

// Return account information
// The accounts returned depend on the scope (whether admin) and the search criteria (infoer)
const procGetProfiles: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  const pager = new PaginationInfo();
  // Can only see accounts that have unspecified availability or "all"
  const scoper = new GenericFilter( { "$or": [ { "availability": { "$exists": false }},
                                               { "availability": Availability.ALL },
                                             ] } );
  pager.parametersFromRequest(req);

  // Loop through all the filtered accounts and create array of info
  const accts: any[] = [];
  for await (const acct of Accounts.enumerateAsync(scoper, pager)) {
    accts.push(await buildAccountProfile(req, acct));
  };

  req.vRestResp.Data = {
    profiles: accts
  };

  scoper.addResponseFields(req);
  pager.addResponseFields(req);

  next();
};

export const name = '/api/v1/profiles';

export const router = Router();

router.get(   '/api/v1/profiles',                 [ setupMetaverseAPI,      // req.vRestResp, req.vAuthToken
                                                    procGetProfiles,
                                                    finishMetaverseAPI ] );
