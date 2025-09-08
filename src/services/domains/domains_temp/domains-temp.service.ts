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

// Initializes the `domains` service on path `/domains`
import { ServiceAddons } from '@feathersjs/feathers';
import express from 'express';
import multer from 'multer';
import { Application } from '../../../declarations';
import { DomainTemp } from './domains-temp.class';
import hooks from './domains-temp.hooks';
const multipartMiddleware = multer({ limits: { fieldSize: Infinity } });

// Add this service to the service type index
declare module '../../../declarations' {
    interface ServiceTypes {
        'domains/create_temporary': DomainTemp & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {
        paginate: app.get('paginate'),
        id: 'id',
    };

    // Initialize our service with any options it requires
    app.use(
        '/domains/create_temporary',
        multipartMiddleware.any(),
        (
            req: any,
            res: any,
            next: any
        ) => {
            if (req?.feathers) {
                req.feathers.address = (req as any).socket.address();
                req.feathers.body = req.body;
                req.feathers.args = (req as any).args;
            }
            next();
        },
        new DomainTemp(options, app)
    );

    app.use(
        'api/v1/domains/temporary',
        app.service('domains/create_temporary')
    );

    // Get our initialized service so that we can register hooks
    const service = app.service('domains/create_temporary');

    service.hooks(hooks);
}
