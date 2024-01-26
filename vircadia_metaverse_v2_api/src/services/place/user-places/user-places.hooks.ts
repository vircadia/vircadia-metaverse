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
import { disallow } from 'feathers-hooks-common';
import requestFail from '../../../hooks/requestFail';
import requestSuccess from '../../../hooks/requestSuccess';
const { authenticate } = feathersAuthentication.hooks;
import checkAccessToAccount from '../../../hooks/checkAccess';
import config from '../../../appconfig';
import { Perm } from '../../../utils/Perm';
import validators from '@feathers-plus/validate-joi';
import { joiOptions, createUserPlaceSchema } from './user-places.joi';
export default {
    before: {
        all: [authenticate('jwt')],
        find: [],
        get: [],
        create: [
            validators.form(createUserPlaceSchema, joiOptions),
        ],
        update: [disallow()],
        patch: [disallow()],
        remove: [
            checkAccessToAccount(config.dbCollections.places, [
                Perm.DOMAINACCESS,
                Perm.ADMIN,
            ]),
        ],
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

