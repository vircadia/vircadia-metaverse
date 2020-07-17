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


import Config from './config';

import express from 'express';
import logger from 'morgan';

import Route_Debugg       from './MetaverseAPI/debugg';
import Route_MetaverseAPI from './MetaverseAPI/apiv1';
import Route_Misc         from './MetaverseAPI/misc';
import Route_Tokens       from './MetaverseAPI/tokens';
import Route_Errors       from './MetaverseAPI/errors';

import Route_ActivityPub  from './ActivityPub/app';

const expr = express();

expr.use(logger('dev'));

// Print stuff out and other debugging pre-processing
expr.use(Route_Debugg);

// Most of the requests are JSON in an out
expr.use(express.json());

// The base metaverse operations
expr.use('/api/v1/', Route_MetaverseAPI);

// Acting as an ActivityPub server
expr.use(Route_ActivityPub);

// Serving static files
expr.use(Config.server["static-base"], express.static('static'));

expr.use(Route_Tokens);

// There are various odd and end links that don't fit into the '/api/v1/ model
expr.use(Route_Misc);

// Error Processing of requests
expr.use(Route_Errors);

expr.listen( Config.server["listen-port"], Config.server["listen-host"]);
