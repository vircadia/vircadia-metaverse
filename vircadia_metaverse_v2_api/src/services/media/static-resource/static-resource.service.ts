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

import { Application } from '../../../declarations';
import { StaticResource } from './static-resource.class';
import hooks from './static-resource.hooks';
import { ServiceAddons } from '@feathersjs/feathers';

declare module '../../../declarations' {
    interface ServiceTypes {
        'static-resource': StaticResource & ServiceAddons<any>;
    }
}

export default (app: Application) => {
    const options = {
        paginate: app.get('paginate'),
        id: 'id',
        multi: true,
    };

    /**
     * Initialize our service with any options it requires and docs
     *
     */
    const event = new StaticResource(options, app);

    app.use('static-resource', event);

    /**
     * Get our initialized service so that we can register hooks
     *
     */
    const service = app.service('static-resource');

    service.hooks(hooks);
};
