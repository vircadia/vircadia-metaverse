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

import Config from '@Base/config';

import http from 'http';
import https from 'https';
import express from 'express';
import { Router } from 'express';

import { MongoClient } from 'mongodb';

import { apex, apexRouter }  from './ActivityPub/app';

import glob from 'glob';
import morgan from 'morgan';
import { Logger, morganOptions } from '@Tools/Logging';

Logger.setLogLevel(Config.debug.logLevel);

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
expr.use(apexRouter);

// Serving static files
expr.use(Config.server["static-base"], express.static('static'));

// If all the other routing didn't work, finally make errors
expr.use(createAPIRouter('routes-last'));

// custom side-effects for your app
// expr.on('apex-create', (msg: string) => {
//   console.log(`New ${msg.object.type} from ${msg.actor} to ${msg.recipient}`)
// });

const server = Config.debug.devel ? http.createServer(expr) : https.createServer(expr)
server.on('request', expr)
      .on('listening', () => {
        Logger.info('Listening');
      })
      .on('error', (err) => {
        Logger.error('server exception: ' + err.message);
      })
      .listen(Config.server["listen-port"], Config.server["listen-host"]);

// Search a directory for .js files that export a 'router' property and return a
//    new Router that routes to those exports.
function createAPIRouter(pBaseDir: string): Router {
  return glob
    // find all .js files in the passed subdirectory
    .sync('**/*.js', { cwd: `${__dirname}/${pBaseDir}/` })
    // read in those files and create array of all exported objects
    .map( filename => require(`./${pBaseDir}/${filename}`))
    // find all of those read in things that export a 'router' property
    .filter(router => router.hasOwnProperty('router'))
    // create a Router and add each found Router and end up with a Router with all found Routers
    .reduce((rootRouter, router) => rootRouter.use(router.router), Router({ mergeParams: true } ) );
}