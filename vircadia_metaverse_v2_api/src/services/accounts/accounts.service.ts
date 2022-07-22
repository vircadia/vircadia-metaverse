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

// Initializes the `accounts` service on path `/accounts`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Accounts } from './accounts.class';
import hooks from './accounts.hooks';
import config from '../../appconfig';
// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        accounts: Accounts & ServiceAddons<any>;
    }
}

function redirect(req: any, res: any): Promise<any> {
    try {
        const url = (
            res.hook.result.message
                ? config.metaverseServer.email_verification_failure_redirect
                : config.metaverseServer.email_verification_success_redirect
        )
            .replace(
                'METAVERSE_SERVER_URL',
                config.metaverse.metaverseServerUrl
            )
            .replace('FAILURE_REASON', res.hook?.result?.message);
        console.log('redirecting to: ' + url);
        return res.redirect(url);
    } catch (err) {
        throw err;
    }
}

export default function (app: Application): void {
    const options = {
        paginate: app.get('paginate'),
        id: 'id',
        multi: ['remove'],
    };

    // Initialize our service with any options it requires
    app.use('/accounts', new Accounts(options, app));

    app.use('/api/v1/accounts', app.service('accounts'));

    app.use('/api/v1/account', app.service('accounts'));
    app.use('/api/v1/account/:accountId', app.service('accounts'));

    app.use('/api/v1/accounts/verify/email', app.service('accounts'), redirect);

    // Get our initialized service so that we can register hooks
    const service = app.service('accounts');
    service.hooks(hooks);
}

