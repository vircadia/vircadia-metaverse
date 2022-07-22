//   Copyright 2020 Vircadia Contributors
//   Copyright 2022 DigiSomni LLC.
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

// Initializes the `minigame_quest` service on path `/minigame_quest`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { MiniGameQuest } from './minigame_quest.class';
import hooks from './minigame_quest.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
    interface ServiceTypes {
        minigame_quest: MiniGameQuest & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const options = {
        paginate: app.get('paginate'),
        id: 'id',
    };

    // Initialize our service with any options it requires
    app.use('/minigame_quest', new MiniGameQuest(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('minigame_quest');

    service.hooks(hooks);
}

