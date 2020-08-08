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
import { VKeyedCollection } from '@Tools/vTypes';

// Get the friends of the logged in account
const procGetUserFriends: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const friends = typeof(req.vAuthAccount.friends) === 'undefined'
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

// Add a friend to my friend collection.
// Not implemented as something needs to be done with request_connection, etc
const procPostUserFriends: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  req.vRestResp.respondFailure('cannot add friends this way');
  next();
};

// Remove a friend from my friend list.
const procDeleteUserFriends: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (typeof(req.vAuthAccount.friends) !== 'undefined') {
      const idx = req.vAuthAccount.friends.indexOf(req.vUsername);
      if (idx >= 0) {
        const updates: VKeyedCollection = {
          'friends': req.vAuthAccount.friends.splice(idx, 1)
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