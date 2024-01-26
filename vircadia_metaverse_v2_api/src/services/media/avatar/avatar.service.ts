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

import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Avatar } from './avatar.class';
import hooks from './avatar.hooks';

declare module '../../../declarations' {
    /**
     * Interface for users input
     */
    interface ServiceTypes {
        avatar: Avatar & ServiceAddons<any>;
    }
}

export default (app: Application): void => {
    const options = {
        paginate: app.get('paginate'),
        id: 'id',
        multi: true,
    };

    const event = new Avatar(options, app);

    app.use('avatar', event);

    const service = app.service('avatar');

    service.hooks(hooks);
};
