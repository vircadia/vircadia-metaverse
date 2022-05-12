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

import { disallow } from 'feathers-hooks-common';
import { HooksObject } from '@feathersjs/feathers';
import requestFail from '../../hooks/requestFail';
import requestSuccess from '../../hooks/requestSuccess';
import validators from '@feathers-plus/validate-joi';
import {
    createAchievementItemsSchema,
    editAchievementItemsSchema,
    findAchievementItemsSchema,
    joiOptions,
    joiReadOptions,
} from './achivement-item.joi';
import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import isAdminUser from '../../hooks/isAdminUser';
import { iff } from 'feathers-hooks-common';

export default {
    before: {
        all: [
            authenticate('jwt'),
            iff(isAdminUser()).else(disallow('external')),
        ],
        find: [validators.form(findAchievementItemsSchema, joiReadOptions)],
        get: [],
        create: [validators.form(createAchievementItemsSchema, joiOptions)],
        update: [disallow()],
        patch: [validators.form(editAchievementItemsSchema, joiOptions)],
        remove: [],
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
