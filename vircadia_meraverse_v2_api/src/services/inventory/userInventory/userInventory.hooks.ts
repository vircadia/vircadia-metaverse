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

import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import requestFail from '../../../hooks/requestFail';

import requestSuccess from '../../../hooks/requestSuccess';
import { iff, isProvider, disallow } from 'feathers-hooks-common';
const { authenticate } = authentication.hooks;
import validators from '@feathers-plus/validate-joi';
import {
    userInventorySchema,
    editUserInventorySchema,
    findUserInventorySchema,
    joiOptions,
    joiReadOptions,
} from './userInventory.joi';
import isAdminUser from '../../../hooks/isAdminUser';

export default {
    before: {
        all: [],
        find: [
            authenticate('jwt'),
            validators.form(findUserInventorySchema, joiReadOptions),
        ],
        get: [authenticate('jwt')],
        create: [
            iff(isProvider('external'), authenticate('jwt')),
            iff(isAdminUser()).else(disallow('external')),
            validators.form(userInventorySchema, joiOptions),
        ],
        update: [disallow()],
        patch: [
            iff(isProvider('external'), authenticate('jwt')),
            iff(isAdminUser()).else(disallow('external')),
            validators.form(editUserInventorySchema, joiOptions),
        ],
        remove: [iff(isProvider('external'), authenticate('jwt'))],
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

