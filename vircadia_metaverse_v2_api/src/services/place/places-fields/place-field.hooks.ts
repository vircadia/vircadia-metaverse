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

import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import requestSuccess from '../../../hooks/requestSuccess';
import requestFail from '../../../hooks/requestFail';
import checkAccessToAccount from '../../../hooks/checkAccess';
import config from '../../../appconfig';
import { Perm } from '../../../utils/Perm';
import validators from '@feathers-plus/validate-joi';
import {
    editDomainSchema,
    joiOptions,
    findPlaceFieldSchema,
    joiReadOptions,
} from './place-field.joi';
import { disallow } from 'feathers-hooks-common';

export default {
    before: {
        all: [authenticate('jwt')],
        find: [validators.form(findPlaceFieldSchema, joiReadOptions)],
        get: [disallow()],
        create: [],
        update: [disallow()],
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
};

