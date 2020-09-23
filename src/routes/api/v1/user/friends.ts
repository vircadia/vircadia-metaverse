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
import { getAccountField } from '@Entities/AccountEntity';

import { SArray, VKeyedCollection } from '@Tools/vTypes';
import { IsNotNullOrEmpty } from '@Tools/Misc';

// Get the friends of the logged in account
const procGetUserFriends: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    let friends = await getAccountField(req.vAuthToken, req.vAuthAccount, 'friends', req.vAuthAccount);
    friends = typeof(friends) === 'undefined'
              ? []        // if no friends info, return empty list
              : req.vAuthAccount.friends;
    req.vRestResp.Data = {
      'friends': friends
    };
  }
  else {
    req.vRestResp.respondFailure('account token did not work');
  }
  next();
};

// Upgrade a connection to a friend.
// Not implemented as something needs to be done with request_connection, etc
const procPostUserFriends: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  req.vRestResp.respondFailure('cannot add friends this way');
  next();
};

// Remove a friend from my friend list.
const procDeleteUserFriends: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (IsNotNullOrEmpty(req.vAuthAccount.friends)) {
      if (SArray.has(req.vAuthAccount.friends, req.vUsername)) {
        SArray.remove(req.vAuthAccount.friends, req.vUsername);

        const updates: VKeyedCollection = {
          'friends': req.vAuthAccount.friends
        };
        Accounts.updateEntityFields(req.vAuthAccount, updates);
      };
    };
  }
  else {
    req.vRestResp.respondFailure('account token did not work');
  };
  next();
};

export const name = '/api/v1/user/friends';

export const router = Router();

router.get(   '/api/v1/user/friends',         [ setupMetaverseAPI,
                                                accountFromAuthToken,
                                                procGetUserFriends,
                                                finishMetaverseAPI
                                              ] );
router.post(  '/api/v1/user/friends',         [ setupMetaverseAPI,
                                                accountFromAuthToken,
                                                procPostUserFriends,
                                                finishMetaverseAPI
                                              ] );
router.delete('/api/v1/user/friends/:username', [ setupMetaverseAPI,
                                                accountFromAuthToken,
                                                usernameFromParams,
                                                procDeleteUserFriends,
                                                finishMetaverseAPI
                                              ] );