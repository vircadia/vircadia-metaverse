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

import validators from '@feathers-plus/validate-joi';
import * as feathersAuthentication from '@feathersjs/authentication';
import { HooksObject } from '@feathersjs/feathers';
import { disallow, iff, isProvider } from 'feathers-hooks-common';
import requestFail from '../../../hooks/requestFail';
import requestSuccess from '../../../hooks/requestSuccess';
import { joiOptions, patchMiniGameSchema } from './minigame_quest.joi';
const { authenticate } = feathersAuthentication.hooks;

export default {
    before: {
        all: [iff(isProvider('external'), authenticate('jwt'))],
        find: [disallow()],
        get: [disallow()],
        create: [disallow()],
        update: [disallow()],
        patch: [
            iff(isProvider('external'), authenticate('jwt')),
            validators.form(patchMiniGameSchema, joiOptions),
        ],
        remove: [disallow()],
    },

    after: {
        all: [requestSuccess()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },

    error: {
        all: [requestFail()],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
} as HooksObject;

