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
import { Socket }  from 'net';
import path from 'path';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import crypto from 'crypto';
import glob from 'glob';
import morgan from 'morgan';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';

import { initAccounts } from '@Entities/Accounts';
import { initDomains } from '@Entities/Domains';
import { initPlaces } from '@Entities/Places';
import { initTokens } from '@Entities/Tokens';
import { initSessions } from '@Entities/Sessions';
import { initRequests } from '@Entities/Requests';
import { initMonitoring } from '@Monitoring/Monitoring';

import { setupDB } from '@Tools/Db';
import { IsNotNullOrEmpty } from '@Tools/Misc';
import { Logger, initLogging, morganOptions } from '@Tools/Logging';

initializeConfiguration()
.catch ( err => {
  Logger.error('main: failed configuration: ' + err);
  return;
})
.then( () => {
  initLogging();
  initMonitoring();
  initSessions();
  initTokens();
  initRequests();
  initAccounts();
  initDomains();
  initPlaces();
  return setupDB();
})
.catch( err => {
  Logger.error('main: failure opening database: ' + err);
  return;
})
.then( () => {
  // Initialize and start ExpressJS
  const expr = express();

  // Setup the logger of messages
  expr.use(morgan('dev', morganOptions));

  // Set up the CORS allows headers and option handshakes
  expr.use(cors({
    'allowedHeaders': [ 'authorization', 'content-type', 'x-vircadia-error-handle' ],
    'credentials': true
  } ));

  // Most of the requests are JSON in an out.
  // This parses the JSON and adds 'Request.body'
  expr.use(express.json({
    'strict': false,
    'limit': Config.server['max-body-size']
  }));

  // There is a problem with some of the domain-server requests that don't
  //    include  the final closing curly-bracket on the JSON. Until that
  //    is fixed, this kludge re-parses the body with the closing curly-bracket
  //    if there is a JSON parse error.
  // In general, a JSON parse error returns HTTP status 400.
  expr.use( (err:Error, req:Request, resp:Response, next:NextFunction) => {
    if (err instanceof SyntaxError) {
      if ('body' in err) {
        Logger.error(`JSON parseError: have body and trying reparse with terminator`);
        try {
          /* tslint:disable-next-line */
          req.body = JSON.parse(err['body'] + '}');
          next();
        }
        catch (ex) {
          /* tslint:disable-next-line */
          Logger.error(`parseError: ${err['body']}`);
          resp.status(400).send({ 'status': 'failure', 'error': 'JSON parse error'});
        };
      }
      else {
        Logger.error(`JSON parseError: no body`);
        resp.status(400).send({ 'status': 'failure', 'error': 'JSON parse error'});
      };
    }
    else {
      next();
    };
  });

  // Early router entry to do any early debugging
  expr.use(createAPIRouter('routes-first'));

  // The metaverseAPI operations
  expr.use(createAPIRouter('routes'));

  // Serving static files
  expr.use(Config.server["static-base"] ?? '/static', express.static(path.join(__dirname, 'static')));

  // If all the other routing didn't work, finally make errors
  expr.use(createAPIRouter('routes-last'));

  // Build server to listen for requests
  // If certificates are provided, create an https server
  let server: http.Server | https.Server;
  if (IsNotNullOrEmpty(Config.server["key-file"])
        && IsNotNullOrEmpty(Config.server["cert-file"])) {
    try {
      const httpsOptions = {
        key:  fs.readFileSync(Config.server["key-file"], 'utf8'),
        cert: fs.readFileSync(Config.server["cert-file"], 'utf8'),
        secureProtocol: 'SSLv23_server_method',
        /* tslint:disable-next-line */
        secureOptions: crypto.constants.SSL_OP_NO_SSLv3 | crypto.constants.SSL_OP_NO_TLSv1
      };
      server = https.createServer(httpsOptions, expr);
    }
    catch (err) {
      Logger.error(`main: exception initializing https: ${err}`);
    };
  }
  else {
    server = http.createServer(expr);
  };

  // Keep track of connected sockets to enable clean shutdowns
  ManageServer(server);

  // When the server is ready, start listening
  server.on('listening', () => {
    Logger.info(`Started metaverse-server version ${Config.server["server-version"]['version-tag']}`);
  })
  .on('error', (err) => {
    Logger.error('server exception: ' + err.message);
  })
  .listen(Config.server["listen-port"], Config.server["listen-host"]);

  // Receive termination signals, shutdown server, stop receiving requests cleanly
  // SIGTERM is usually sent by Docker to stop the application. If this doesn't exit,
  //     a SIGKILL will be sent in 10 seconds.
  process.on('SIGTERM', () => {
    Logger.info('SIGTERM');
    ShutdownServer(server, 'SIGTERM');
  });
  // SIGINT (usually cntl-C) means to stop and exit
  process.on('SIGINT', () => {
    Logger.info('SIGINT');
    ShutdownServer(server, 'SIGINT');
  });
})
.catch( err => {
  Logger.error('main: bad failure: ' + err);
});

// The ExpressJS server won't shutdown if there are open connections
//    so this sets up something to remember connections and to destroy
//    them when this needs the server to shutdown.
// The ExpressJS operation 'server.close()' will hang until all connections
//    close so the connections have to be destroyed to stop the server.
// Technically we could wait if there is a long operation but ShutdownServer()
//    is called when the app needs to exit so the caller will
//    have to deal with the error.
let nextSockerId: number = 444;
const currentConnections: Map<number, Socket> = new Map<number, Socket>();
function ManageServer(pServer: http.Server|https.Server): void {
  pServer.on('connection', sock => {
    const sockId = nextSockerId++;
    currentConnections.set(sockId, sock);
    sock.on('close', () => {
      currentConnections.delete(sockId);
    });
  })
};
function ShutdownServer(pServer: http.Server|https.Server, pMsg: string): void {
  currentConnections.forEach( (val, id) => {
    val.destroy();
  });
  currentConnections.clear();
  pServer.close( () => {
    Logger.info(`${pMsg}: Stopped metaverse-server version ${Config.server["server-version"]['version-tag']}`);
    process.exit();
  });
};

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
};
