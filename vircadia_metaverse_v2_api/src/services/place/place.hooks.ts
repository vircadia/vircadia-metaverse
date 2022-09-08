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
import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import requestFail from '../../hooks/requestFail';
import requestSuccess from '../../hooks/requestSuccess';
import checkAccessToAccount from '../../hooks/checkAccess';
import config from '../../appconfig';
import { Perm } from '../../utils/Perm';
import { disallow } from 'feathers-hooks-common';
import {
    createPlaceSchema,
    updatePlaceSchema,
    findPlaceSchema,
    joiOptions,
    joiReadOptions,
} from './place.joi';
import validators from '@feathers-plus/validate-joi';

export default {
    before: {
        all: [],
        find: [
            authenticate('jwt'),
            validators.form(findPlaceSchema, joiReadOptions),
        ],
        get: [
            authenticate('jwt'),
            checkAccessToAccount(config.dbCollections.places, [
                Perm.DOMAINACCESS,
                Perm.ADMIN,
            ]),
        ],
        create: [
            authenticate('jwt'),
            validators.form(createPlaceSchema, joiOptions),
            checkAccessToAccount(config.dbCollections.accounts, [
                Perm.PUBLIC,
                Perm.OWNER,
                Perm.ADMIN,
            ]),
        ],
        update: [
            authenticate('jwt'),
            validators.form(updatePlaceSchema, joiOptions),
            checkAccessToAccount(config.dbCollections.places, [
                Perm.DOMAINACCESS,
                Perm.ADMIN,
            ]),
        ],
        patch: [disallow()],
        remove: [
            authenticate('jwt'),
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
} as HooksObject;
