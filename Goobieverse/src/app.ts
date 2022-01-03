import path from 'path';
import favicon from 'serve-favicon';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import feathers from '@feathersjs/feathers';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';
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
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());
export type HookContext<T = any> = { app: Application } & FeathersHookContext<T>;

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set Public folder path
app.set('public',config.server.publicPath);

//page favicon
app.use(favicon(path.join(app.settings.public, 'favicon.ico')));


// routes
app.use('/', publicRoutes);
// Host the public folder
app.use('/', express.static(app.settings.public));

 
// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.set('host', config.server.local ? config.server.hostName + ':' + config.server.port : config.server.hostName);
app.set('port',config.server.port);
app.set('paginate',config.server.paginate);
app.set('authentication', config.authentication);

app.configure(mongodb); 

// Configure other middleware (see `middleware/index.ts`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.ts`) 
app.configure(services);
// Set up event channels (see channels.ts)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger } as any));

app.hooks(appHooks);

export default app;
