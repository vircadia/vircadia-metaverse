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
import { accountFromAuthToken, usernameFromParams } from '@Route-Tools/middleware';
import { Accounts } from '@Entities/Accounts';
import { getAccountField, setAccountField } from '@Entities/AccountEntity';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';

import { SArray, VKeyedCollection } from '@Tools/vTypes';
import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
import { buildLocationInfo, buildImageInfo } from '@Route-Tools/Util';

// Get the connections of the logged in account
const procGetUsersConnections: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const pager = new PaginationInfo();
    pager.parametersFromRequest(req);

    let connections: string[] = await getAccountField(req.vAuthToken, req.vAuthAccount, 'connections', req.vAuthAccount);
    connections = IsNullOrEmpty(connections)
              ? []        // if no connections info, return empty list
              : connections;
    req.vRestResp.Data = {
      'users': connections.map( async (connectionUsername) => {
        const aAccount = await Accounts.getAccountWithUsername(connectionUsername);
        if (aAccount) {
          return {
            'username': connectionUsername,
            'connection': SArray.has(req.vAuthAccount.friends, connectionUsername) ? 'is_friend' : 'is_connection',
            'images': await buildImageInfo(aAccount),
            'placeName': await buildLocationInfo(aAccount)
          };
        };
        return {
          'username': connectionUsername,
          'connection': 'unknown'
        };

      } )
    };
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
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

