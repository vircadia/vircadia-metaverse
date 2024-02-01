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
import * as authentication from '@feathersjs/authentication';
const { authenticate } = authentication.hooks;
import requestFail from '../../hooks/requestFail';
import requestSuccess from '../../hooks/requestSuccess';
import isAdminUser from '../../hooks/isAdminUser';
import { iff, isProvider } from 'feathers-hooks-common';

import validators from '@feathers-plus/validate-joi';

import {
    createItemHandlerSchema,
    editItemHandlerSchema,
    joiOptions,
} from './item-handler.joi';

export default {
    before: {
        all: [],
        find: [authenticate('jwt')],
        get: [authenticate('jwt')],
        create: [
            iff(isProvider('external'), authenticate('jwt')),
            iff(isAdminUser()).else(disallow('external')),
            validators.form(createItemHandlerSchema, joiOptions),
        ],
        update: [disallow()],
        patch: [
            iff(isProvider('external'), authenticate('jwt')),
            iff(isAdminUser()).else(disallow('external')),
            validators.form(editItemHandlerSchema, joiOptions),
        ],
        remove: [authenticate('jwt')],
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
