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

// @ts-nocheck - may need to be at the start of file

import path from 'path';
import favicon from 'serve-favicon';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
// import socketio from '@feathersjs/socketio';
import { publicRoutes } from './routes/publicRoutes';
import config from './appconfig';
import { Application } from './declarations';
import logger from './logger';
import middleware from './middleware';
import services from './services';
import appHooks from './app.hooks';
import channels from './channels';
import { HookContext as FeathersHookContext } from '@feathersjs/feathers';
import authentication from './authentication';
import mongodb from './mongodb';
import socketio from '@feathersjs/socketio';
import { initMonitoring } from './common/Monitoring/Monitoring';
import { initDomains } from './common/DomainFields';

// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());
export type HookContext<T = any> = {
    app: Application;
} & FeathersHookContext<T>;

// Enable security, CORS, compression, favicon and body parsing
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('host', config.server.hostName);
app.set('port', config.server.port);
app.set('paginate', config.server.paginate);
app.set('authentication', config.authentication);
//set Public folder path
app.set('public', config.server.publicPath);

//page favicon
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// routes
app.use('/', publicRoutes);
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
app.configure(
    socketio(function (io) {
        io.sockets.setMaxListeners(0);
    })
);
app.configure(mongodb);

// Configure other middleware (see `middleware/index.ts`)
app.configure(middleware);
app.configure(authentication);
app.configure(initMonitoring);
app.configure(initDomains)
// Set up our services (see `services/index.ts`)
app.configure(services);
// Set up event channels (see channels.ts)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
 
// Use a concise error logger to reduce noisy stack traces in logs
const conciseErrorLogger = {
    info: (error: any): void => {
        const code = error?.code ?? 200;
        const name = error?.name ?? 'Info';
        const message = error?.message ?? '';
        const url = error?.data?.url;

        // Compact one-liner for non-5xx (Feathers uses info for 4xx like 404)
        logger.info(`HTTP ${code} ${name}: ${message}${url ? ` - ${url}` : ''}`);
    },
    error: (error: any): void => {
        const code = error?.code ?? 500;
        const name = error?.name ?? 'Error';
        const message = error?.message ?? '';
        const url = error?.data?.url;

        // Skip verbose stack logging for common 404s
        if (code === 404 || name === 'NotFound') {
            logger.info(`HTTP ${code} ${name}${url ? ` - ${url}` : ''}`);
            return;
        }

        // Log a single-line, high-signal error without stack
        logger.error(
            `HTTP ${code} ${name}: ${message}${url ? ` - ${url}` : ''}`
        );
    },
};

app.use(express.errorHandler({ logger: conciseErrorLogger } as any));

app.hooks(appHooks);

export default app;
