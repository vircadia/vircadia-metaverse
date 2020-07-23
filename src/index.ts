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

import Config from './config';

import http from 'http';
import https from 'https';
import express from 'express';

import { MongoClient } from 'mongodb';

import Route_Debugg       from './MetaverseAPI/debugg';
import Route_MetaverseAPI from './MetaverseAPI/apiv1';
import Route_Tokens       from './MetaverseAPI/tokens';
import Route_Misc         from './MetaverseAPI/misc';
import Route_Errors       from './MetaverseAPI/errors';

import { apex, apexRouter }  from './ActivityPub/app';

import morgan from 'morgan';
import { Logger, morganOptions } from './Tools/Logging';

Logger.setLogLevel(Config.debug.logLevel);
Logger.debug('starting...');

const expr = express();

// Setup the logger of messages
expr.use(morgan('dev', morganOptions));

// Print stuff out and other debugging pre-processing
expr.use(Route_Debugg);

// Most of the requests are JSON in an out
expr.use(express.json());

// The base metaverse operations
expr.use(Route_MetaverseAPI);

// Acting as an ActivityPub server
expr.use(apexRouter);

expr.use(Route_Tokens);

// There are various odd and end links that don't fit into the '/api/v1/ model
expr.use(Route_Misc);

// Serving static files
expr.use(Config.server["static-base"], express.static('static'));

// Error Processing of requests
expr.use(Route_Errors);

// custom side-effects for your app
// expr.on('apex-create', (msg: string) => {
//   console.log(`New ${msg.object.type} from ${msg.actor} to ${msg.recipient}`)
// });

Logger.debug('starting the listener ...');
const server = Config.debug.devel ?
      http.createServer(expr)
          .listen(Config.server["listen-port"], Config.server["listen-host"])
    :
      https.createServer(expr)
          .listen(Config.server["listen-port"], Config.server["listen-host"]);
