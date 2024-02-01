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

// Initializes the `user-inventory` service on path `/user-inventory`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { UserInventory } from './userInventory.class';
import hooks from './userInventory.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
    interface ServiceTypes {
        'user-inventory': UserInventory & ServiceAddons<any>;
    }
}

export default (app: Application) => {
    const options = {
        paginate: app.get('paginate'),
        id: 'id',
    };

    // Initialize our service with any options it requires
    app.use('/user-inventory', new UserInventory(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('user-inventory');

    service.hooks(hooks);
};

