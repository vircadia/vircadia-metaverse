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

import { iff, disallow, isProvider } from 'feathers-hooks-common';
import { HooksObject } from '@feathersjs/feathers';
import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import validators from '@feathers-plus/validate-joi';
import {
    createMiniGameSchema,
    patchMiniGameSchema,
    findMiniGameSchema,
    joiOptions,
    joiReadOptions,
} from './mini_game.joi';
import requestFail from '../../../hooks/requestFail';
import requestSuccess from '../../../hooks/requestSuccess';
import isAdminUser from '../../../hooks/isAdminUser';

export default {
    before: {
        all: [iff(isProvider('external'), authenticate('jwt'))],
        find: [
            iff(isProvider('external'), authenticate('jwt')),
            iff(isAdminUser()).else(disallow('external')),
            validators.form(findMiniGameSchema, joiReadOptions),
        ],
        get: [],
        create: [
            iff(isProvider('external'), authenticate('jwt')),
            iff(isAdminUser()).else(disallow('external')),
            validators.form(createMiniGameSchema, joiOptions),
        ],
        update: [disallow()],
        patch: [
            iff(isProvider('external'), authenticate('jwt')),
            iff(isAdminUser()).else(disallow('external')),
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

