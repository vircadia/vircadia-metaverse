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

import Config from '../config';

import express from 'express';
import { Router } from 'express';

import ActivityPubExpress from 'activitypub-express';

const baseUrl = Config.activitypub["url-base"];

const routes = {
  actor: baseUrl + '/u/:actor',
  object: baseUrl + '/o/:id',
  activity: baseUrl + '/s/:id',
  inbox: baseUrl + '/inbox/:actor',
  outbox: baseUrl + '/outbox/:actor'
};
export const apex = ActivityPubExpress({
  // 'domain' is the external, permanant domain address
  domain: Config.activitypub["external-hostname"],
  // these are the ':' parameters in the routes
  actorParam: 'actor',
  objectParam: 'id',
  activityParam: 'id',
  routes
});

export const apexRouter = Router();

apexRouter.use(express.json({ type: apex.consts.jsonldTypes }), apex);

// define routes using prepacakged middleware collections
apexRouter.route(routes.inbox)
  .get(apex.net.inbox.get)
  .post(apex.net.inbox.post);
apexRouter.route(routes.outbox)
  .get(apex.net.outbox.get)
  .post(apex.net.outbox.post);
apexRouter.get(routes.actor, apex.net.actor.get);
apexRouter.get(routes.object, apex.net.object.get);
apexRouter.get(routes.activity, apex.net.activityStream.get);
apexRouter.get('/.well-known/webfinger', apex.net.webfinger.get);
