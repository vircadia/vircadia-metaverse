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
import { accountFromAuthToken, param1FromParams } from '@Route-Tools/middleware';
import { Accounts } from '@Entities/Accounts';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';

import { VKeyedCollection } from '@Tools/vTypes';
import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';

// Get the connections of the logged in account
const procGetUserConnections: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const pager = new PaginationInfo();
    pager.parametersFromRequest(req);

    let connections = await Accounts.getField(req.vAuthToken, req.vAuthAccount, 'connections', req.vAuthAccount);
    connections = IsNullOrEmpty(connections)
              ? []        // if no connections info, return empty list
              : connections;
    req.vRestResp.Data = {
      'connections': connections
    };

    pager.addResponseFields(req);
  }
  else {
    req.vRestResp.respondFailure(req.vAccountError ?? 'Not logged in');
  };
  next();
};

// Upgrade a connection to a friend.
// Not implemented as something needs to be done with request_connection, etc
const procPostUserConnections: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  req.vRestResp.respondFailure('cannot add connections this way');
  next();
};

// Remove a friend from my friend list.
const procDeleteUserConnections: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    await Accounts.removeConnection(req.vAuthAccount, req.vParam1);
  }
  else {
    req.vRestResp.respondFailure(req.vAccountError ?? 'Not logged in');
  };
  next();
};

export const name = '/api/v1/user/connections';

export const router = Router();

router.get(   '/api/v1/user/connections',     [ setupMetaverseAPI,      // req.vRestResp, vAuthToken
                                                accountFromAuthToken,   // req.vAuthAccount
                                                procGetUserConnections,
                                                finishMetaverseAPI
                                              ] );
router.post(  '/api/v1/user/connections',         [ setupMetaverseAPI,  // req.vRestResp, vAuthToken
                                                accountFromAuthToken,   // req.vAuthAccount
                                                procPostUserConnections,
                                                finishMetaverseAPI
                                              ] );
router.delete('/api/v1/user/connections/:param1', [ setupMetaverseAPI,// req.vRestResp, vAuthToken
                                                accountFromAuthToken,   // req.vAuthAccount
                                                param1FromParams,     // req.vParam1
                                                procDeleteUserConnections,
                                                finishMetaverseAPI
                                              ] );
