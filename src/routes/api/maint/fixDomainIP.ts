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

import { Config } from '@Base/config';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI, param1FromParams } from '@Route-Tools/middleware';

import { Accounts } from '@Entities/Accounts';
import { Domains } from '@Entities/Domains';
import { GenericFilter } from '@Entities/EntityFilters/GenericFilter';

import { SArray, VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

// Temporary maint function to create the first admin account
const procFixDomainIP: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount && Accounts.isAdmin(req.vAuthAccount)) {
    if (req.vParam1 && typeof(req.vParam1) === 'string') {
      Logger.info(`procFixDomainIP: removing networkAddr ${req.vParam1} from domains`);
      for await (const aDomain of Domains.enumerateAsync( new GenericFilter( { 'networkAddr': req.vParam1 }) )) {
        const updates: VKeyedCollection = { 'networkAddr': null };
        await Domains.updateEntityFields(aDomain, updates);
        Logger.info(`procFixDomainIP: removed networkAddr ${req.vParam1} from domain ${aDomain.name}`);
      };
    };
  }
  else {
    Logger.error(`procFixDomainIP: non-admin attempt to reset domain IPs`);
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

export const name = '/api/maint/fixDomainIP';

export const router = Router();

router.get('/api/maint/fixDomainIP/:param1',  [ setupMetaverseAPI,
                                              param1FromParams,
                                              procFixDomainIP,
                                              finishMetaverseAPI ] );




