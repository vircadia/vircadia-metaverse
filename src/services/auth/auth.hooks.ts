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
import { disallow } from 'feathers-hooks-common';
import addOldToken from '../../hooks/addOldToken';
import updateLastOnline from '../../hooks/updateLastOnline';

import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
const { authenticate } = feathersAuthentication.hooks;
const { protect } = local.hooks;
import { iff, isProvider } from 'feathers-hooks-common';
import authTokenValidate from '../../hooks/authTokenValidate';

export default {
    before: {
        all: [],
        find: [authenticate('jwt')],
        get: [authenticate('jwt')],
        create: [disallow('external')],
        update: [disallow()],
        patch: [disallow('external')],
        remove: [disallow()],
    },

    after: {
        all: [protect(...['password', 'passwordSalt', 'passwordHash'])],
        find: [],
        get: [
            iff(isProvider('external'), addOldToken(), updateLastOnline()).else(
                authTokenValidate()
            ),
        ],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
} as HooksObject;
