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

import { Accounts } from '@Entities/Accounts';

import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';
import { buildLocationInfo, buildImageInfo } from '@Route-Tools/Util';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';

import { SArray, VKeyedCollection } from '@Tools/vTypes';
import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

// Get the connections of the logged in account
const procGetUsersConnections: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const pager = new PaginationInfo();
    pager.parametersFromRequest(req);

    let connections: string[] = await Accounts.getField(req.vAuthToken, req.vAuthAccount, 'connections', req.vAuthAccount);
    connections = IsNullOrEmpty(connections)
              ? []        // if no connections info, return empty list
              : connections;

    Logger.debug(`procGetUsersConnections: user=${req.vAuthAccount.username}, connections=${JSON.stringify(connections)}`);
    const connectionInfo: any[] = [];
    for (const connectionUsername of connections) {
      if (pager.criteriaTest(connectionUsername)) {
        const aAccount = await Accounts.getAccountWithUsername(connectionUsername);
        if (aAccount) {
          connectionInfo.push( {
            'username': connectionUsername,
            'connection': SArray.has(req.vAuthAccount.friends, connectionUsername) ? 'friend' : 'connection',
            'images': await buildImageInfo(aAccount),
            'location': await buildLocationInfo(aAccount)
          });
        }
        else {
          Logger.error(`procGetUsersConnections: connection name with no account. acct=${req.vAuthAccount.id}, name=${connectionUsername}`);
          connectionInfo.push( {
            'username': connectionUsername,
            'connection': 'unknown'
          });
        };
      };
    };
    req.vRestResp.Data = {
      'users': connectionInfo
    };
    // Add the 'current_page' and 'total_pages' to the response
    pager.addResponseFields(req);
  }
  else {
    req.vRestResp.respondFailure(req.vAccountError ?? 'Not logged in');
  };
  next();
};

export const name = '/api/v1/users/connections';

export const router = Router();

router.get('/api/v1/users/connections', [ setupMetaverseAPI,
                                        accountFromAuthToken,
                                        procGetUsersConnections,
                                        finishMetaverseAPI
                                        ] );

