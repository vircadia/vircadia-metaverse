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
import { disallow } from 'feathers-hooks-common';
import attachOwnerIdInSavingContact from '../../../hooks/media/set-loggedin-user-in-body';
import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import requestFail from '../../../hooks/requestFail';
import requestSuccess from '../../../hooks/requestSuccess';

const { authenticate } = authentication.hooks;
export default {
    before: {
        all: [authenticate('jwt')],
        find: [],
        get: [],
        create: [attachOwnerIdInSavingContact('userId')],
        update: [disallow()],
        patch: [disallow()],
        remove: [disallow()],
    },
    after: {
        all: [],
        find: [requestSuccess()],
        get: [requestSuccess()],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
    error: {
        all: [],
        find: [requestFail()],
        get: [requestFail()],
        create: [],
        update: [requestFail()],
        patch: [requestFail()],
        remove: [requestFail()],
    },
} as HooksObject;
