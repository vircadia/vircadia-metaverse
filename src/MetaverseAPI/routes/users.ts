//   Copyright 2020 Robert Adams
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

// metaverseServerApp.use(express.urlencoded({ extended: false }));

const procGetUsers: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procPostUsers: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procPutUserHeartbeat: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procPutUserLocation: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procGetUserLocation: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procGetUserProfile: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procPutUserPublicKey: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procGetUsersPublicKey: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procGetUserFriends: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procPostUserFriends: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procDeleteUserFriends: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procPostUserConnectionRequest: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procDeleteUserConnection: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procGetUserLocker: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};
const procPostUserLocker: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
  next();
};

const router = Router();

router.get(   '/users',                       procGetUsers);
router.post(  '/users',                       procPostUsers);
router.put(   '/user/heartbeat',              procPutUserHeartbeat);

router.put(   '/user/location',               procPutUserLocation);
router.get(   '/users/:username/location',    procGetUserLocation);
router.get(   '/user/profile',                procGetUserProfile);
router.put(   '/user/public_key',             procPutUserPublicKey);
router.get(   '/users/:username/public_key',  procGetUsersPublicKey);

router.get(   '/user/friends',                procGetUserFriends);
router.post(  '/user/friends',                procPostUserFriends);
router.delete('/user/friends/:username',      procDeleteUserFriends);
router.post(  '/user/connection_request',     procPostUserConnectionRequest);
router.delete('/user/connections/:username',  procDeleteUserConnection);

router.get(   '/user/locker',                 procGetUserLocker);
router.post(  '/user/locker',                 procPostUserLocker);

export default router;
