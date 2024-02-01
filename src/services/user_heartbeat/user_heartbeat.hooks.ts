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

import * as local from '@feathersjs/authentication-local';
import { HooksObject } from '@feathersjs/feathers';
import requestFail from '../../hooks/requestFail';
import requestSuccess from '../../hooks/requestSuccess';
// import { Perm } from '../../utils/Perm';
// import checkAccessToAccount from '../../hooks/checkAccessToAccount';
import * as authentication from '@feathersjs/authentication';
import { disallow } from 'feathers-hooks-common';
const { authenticate } = authentication.hooks;
const { hashPassword } = local.hooks;

export default {
    before: {
        all: [],
        find: [authenticate('jwt')],
        get: [disallow()],
        create: [disallow()],
        update: [authenticate('jwt')],
        patch: [disallow()],
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

