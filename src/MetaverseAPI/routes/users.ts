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

router.get(   '/api/v1/users',                       procGetUsers);
router.post(  '/api/v1/users',                       procPostUsers);
router.put(   '/api/v1/user/heartbeat',              procPutUserHeartbeat);

router.put(   '/api/v1/user/location',               procPutUserLocation);
router.get(   '/api/v1/users/:username/location',    procGetUserLocation);
router.get(   '/api/v1/user/profile',                procGetUserProfile);
router.put(   '/api/v1/user/public_key',             procPutUserPublicKey);
router.get(   '/api/v1/users/:username/public_key',  procGetUsersPublicKey);

router.get(   '/api/v1/user/friends',                procGetUserFriends);
router.post(  '/api/v1/user/friends',                procPostUserFriends);
router.delete('/api/v1/user/friends/:username',      procDeleteUserFriends);
router.post(  '/api/v1/user/connection_request',     procPostUserConnectionRequest);
router.delete('/api/v1/user/connections/:username',  procDeleteUserConnection);

router.get(   '/api/v1/user/locker',                 procGetUserLocker);
router.post(  '/api/v1/user/locker',                 procPostUserLocker);

export default router;
