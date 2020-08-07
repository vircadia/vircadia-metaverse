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
'use strict'

import 'module-alias/register';

import { Config, initializeConfiguration } from '@Base/config';

import http from 'http';
import https from 'https';
import path from 'path';
import express from 'express';
import { Router } from 'express';

import { setupDB } from '@Tools/Db';

import glob from 'glob';
import morgan from 'morgan';
import { Logger, morganOptions } from '@Tools/Logging';
import { initTokens } from '@Entities/Tokens';
import { initSessions } from '@Entities/Sessions';

initializeConfiguration()
.catch ( err => {
  Logger.error('main: failured configuration: ' + err);
})
.then( () => {
  initSessions();
  initTokens();
  return setupDB();
})
.catch( err => {
  Logger.error('main: failure opening database: ' + err);
})
.then( () => {
  // Initialize and start ExpressJS
  const expr = express();

  // Setup the logger of messages
  expr.use(morgan('dev', morganOptions));

  // Most of the requests are JSON in an out
  expr.use(express.json());

  // Early router entry to do any early debugging
  expr.use(createAPIRouter('routes-first'));

  // The metaverseAPI operations
  expr.use(createAPIRouter('routes'));

  // Acting as an ActivityPub server
  // expr.use(createAPIRouter('ActivityPub'));

  // Serving static files
  expr.use(Config.server["static-base"] ?? '/static', express.static(path.join(__dirname, 'static')));

  // If all the other routing didn't work, finally make errors
  expr.use(createAPIRouter('routes-last'));

  // custom side-effects for your app
  // expr.on('apex-create', (msg: string) => {
  //   console.log(`New ${msg.object.type} from ${msg.actor} to ${msg.recipient}`)
  // });

  const server = Config.debug.devel ? http.createServer(expr) : https.createServer(expr)
  server.on('listening', () => {
          Logger.info(`Started metaverse-server version ${Config.server["server-version"]} at ${new Date().toISOString()}`);
        })
        .on('error', (err) => {
          Logger.error('server exception: ' + err.message);
        })
        .listen(Config.server["listen-port"], Config.server["listen-host"]);
})
.catch( err => {
  Logger.error('main: bad failure: ' + err);
});

// Search a directory for .js files that export a 'router' property and return a
//    new Router that routes to those exports.
function createAPIRouter(pBaseDir: string): Router {
  // Logger.debug('createAPIRouter: adding routes from ' + pBaseDir);
  return glob
    // find all .js files in the passed subdirectory
    .sync('**/*.js', { cwd: `${__dirname}/${pBaseDir}/` })
    // read in those files and create array of all exported objects
    .map( filename => require(`./${pBaseDir}/${filename}`))
    // filter down to those things that export a 'router' property
    .filter(router => router.hasOwnProperty('router'))
    // print out debugging about which routers are being created
    .map(rr => { Logger.debug('createAPIRouter: adding ' + rr.name ?? 'UNKNOWN'); return rr; })
    // create a Router and add each found Router and end up with a Router with all found Routers
    .reduce((rootRouter, router) => rootRouter.use(router.router), Router({ mergeParams: true } ) );
}
