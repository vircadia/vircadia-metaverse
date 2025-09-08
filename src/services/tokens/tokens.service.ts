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

'use strict';

// Initializes the `users` service on path `/users`
import express from 'express';
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Token } from './tokens.class';
import hooks from './tokens.hooks';
import config from '../../appconfig';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'token/new': Token & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {
        paginate: app.get('paginate'),
        id: 'id',
    };

    // Initialize our service with any options it requires
    app.use('/token/new', new Token(options, app));
    app.use('/api/v1/token/new', app.service('token/new'));
    app.use(
        '/user/tokens/new',
        (
            req: any,
            res: any,
            next: any
        ) => {
            if (req?.feathers?.headers?.authorization) {
                next();
            } else {
                res.redirect(config.metaverseServer.tokengen_url);
            }
        },
        app.service('token/new'),
        async (request: any, response: any) => {
            response.set('Content-Type', 'text/html');
            response.data.htmlBody && response.send(response.data.htmlBody);
            response.data.body && response.send(response.data.body);
        }
    );

    // Get our initialized service so that we can register hooks
    const service = app.service('token/new');

    service.hooks(hooks);
}

