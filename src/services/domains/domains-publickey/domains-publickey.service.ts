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
import { DomainPublickey } from './domains-publickey.class';
import hooks from './domains-publickey.hooks';
const multipartMiddleware = multer({ limits: { fieldSize: Infinity } });
import { domainAccessTokenMiddleware } from '../../strategies/domain-access-token';

// Add this service to the service type index
declare module '../../../declarations' {
    interface ServiceTypes {
        'domains/:domainId/public_key': DomainPublickey & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {
        paginate: app.get('paginate'),
        id: 'id',
    };

    const multerAdapter = (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        if (req?.feathers) {
            req.feathers.files = (req as any).files?.media
                ? (req as any).files?.media
                : (req as any).files;
                req.feathers.body = req.body;
                req.feathers.args = (req as any).args;
        }
        next();
    };

    // Initialize our service with any options it requires
    app.use(
        '/domains/:domainId/public_key',
        multipartMiddleware.any(),
        multerAdapter,
        new DomainPublickey(options, app)
    );
    app.use(
        'api/v1/domains/:domainId/public_key',
        multipartMiddleware.any(),
        multerAdapter,
        domainAccessTokenMiddleware,
        app.service('domains/:domainId/public_key')
    );

    // Get our initialized service so that we can register hooks
    const service = app.service('domains/:domainId/public_key');

    service.hooks(hooks);
}
