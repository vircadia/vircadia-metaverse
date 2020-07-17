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

const proc_get_users: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_post_users: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_put_user_heartbeat: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_put_user_location: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_get_user_location: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_get_user_profile: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_put_user_public_key: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_get_users_public_key: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_get_user_friends: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_post_user_friends: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_delete_user_friends: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_post_user_connection_request: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_delete_user_connection: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_get_user_locker: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};
const proc_post_user_locker: RequestHandler = (req: Request, resp: Response, next: NextFunction) => {
};

const router = Router();

router.get(   '/users',                       proc_get_users);
router.post(  '/users',                       proc_post_users);
router.put(   '/user/heartbeat',              proc_put_user_heartbeat);

router.put(   '/user/location',               proc_put_user_location);
router.get(   '/users/:username/location',    proc_get_user_location);
router.get(   '/user/profile',                proc_get_user_profile);
router.put(   '/user/public_key',             proc_put_user_public_key);
router.get(   '/users/:username/public_key',  proc_get_users_public_key);

router.get(   '/user/friends',                proc_get_user_friends);
router.post(  '/user/friends',                proc_post_user_friends);
router.delete('/user/friends/:username',      proc_delete_user_friends);
router.post(  '/user/connection_request',     proc_post_user_connection_request);
router.delete('/user/connections/:username',  proc_delete_user_connection);

router.get(   '/user/locker',                 proc_get_user_locker);
router.post(  '/user/locker',                 proc_post_user_locker);

export default router;
