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

// Initializes the `current` service on path `/current`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Current } from './current.class';
import hooks from './current.hooks';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        current: Current & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {
        paginate: app.get('paginate'),
        id: 'id',
    };

    // Initialize our service with any options it requires
    app.use('/current', new Current(options, app));
    app.use('api/v1/places/current', app.service('current'));

    // Get our initialized service so that we can register hooks
    const service = app.service('current');

    service.hooks(hooks);
}
