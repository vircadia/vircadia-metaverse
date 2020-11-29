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

import { SArray, VKeyedCollection } from '@Tools/vTypes';
import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';

// Get the friends of the logged in account
const procGetUserFriends: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const pager = new PaginationInfo();
    pager.parametersFromRequest(req);

    let friends = await Accounts.getField(req.vAuthToken, req.vAuthAccount, 'friends', req.vAuthAccount);
    friends = IsNullOrEmpty(friends)
              ? []        // if no friends info, return empty list
              : friends;
    req.vRestResp.Data = {
      'friends': friends
    };

    pager.addResponseFields(req);
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

// Upgrade a connection to a friend.
const procPostUserFriends: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (req.body.username && typeof(req.body.username) === 'string') {
      const newFriend = req.body.username;
      // Verify the username is a connection.
      const connections: string[] = await Accounts.getField(req.vAuthToken, req.vAuthAccount, 'connections', req.vAuthAccount) ?? [];
      if (SArray.hasNoCase(connections, newFriend)) {
        const updates: VKeyedCollection = {};
        await Accounts.setField(req.vAuthToken, req.vAuthAccount, 'friends', { "add": newFriend }, req.vAuthAccount, updates);
        await Accounts.updateEntityFields(req.vAuthAccount, updates);
      }
      else {
        req.vRestResp.respondFailure('cannot add friend who is not a connection');
      };
    }
    else {
      req.vRestResp.respondFailure('badly formed request');
    };
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

// Remove a friend from my friend list.
const procDeleteUserFriends: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    await Accounts.removeFriend(req.vAuthAccount, req.vParam1);
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

export const name = '/api/v1/user/friends';

export const router = Router();

router.get(   '/api/v1/user/friends',         [ setupMetaverseAPI,    // req.vRestResp, req.vAuthToken
                                                accountFromAuthToken, // req.vAuthAccount
                                                procGetUserFriends,
                                                finishMetaverseAPI
                                              ] );
router.post(  '/api/v1/user/friends',         [ setupMetaverseAPI,    // req.vRestResp, req.vAuthToken
                                                accountFromAuthToken, // req.vAuthAccount
                                                procPostUserFriends,
                                                finishMetaverseAPI
                                              ] );
router.delete('/api/v1/user/friends/:param1', [ setupMetaverseAPI,  // req.vRestResp, req.vAuthToken
                                                accountFromAuthToken, // req.vAuthAccount
                                                param1FromParams,     // req.vParam1
                                                procDeleteUserFriends,
                                                finishMetaverseAPI
                                              ] );