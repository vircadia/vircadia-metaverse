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

// Initializes the `email` service on path `/email`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Email } from './email.class';
import hooks from './email.hooks';
import config from '../../appconfig';
import smtpTransport from 'nodemailer-smtp-transport';
import Mailer from 'feathers-mailer';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        email: Email & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const event = Mailer(smtpTransport(config.email));
    app.use('email', event);

    const service = app.service('email');

    service.hooks(hooks);
}
