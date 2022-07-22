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
import requestSuccess from '../../hooks/requestSuccess';
import requestFail from '../../hooks/requestFail';
import checkAccessToAccount from '../../hooks/checkAccess';
import config from '../../appconfig';
import { Perm } from '../../utils/Perm';
import isHasAuthToken from '../../hooks/isHasAuthToken';
import { iff } from 'feathers-hooks-common';
import { disallow } from 'feathers-hooks-common';
import validators from '@feathers-plus/validate-joi';
import {
    patchAccountsSchema,
    findAccountsSchema,
    joiOptions,
    joiReadOptions,
} from './accounts.joi';
import app from '../../app';

export default {
    before: {
        all: [],
        find: [
            iff(isHasAuthToken(), authenticate('jwt')),
            validators.form(findAccountsSchema, joiReadOptions),
        ],
        get: [
            iff(isHasAuthToken(), authenticate('jwt')),
            checkAccessToAccount(config.dbCollections.accounts, [
                Perm.PUBLIC,
                Perm.OWNER,
                Perm.ADMIN,
            ]),
        ],
        create: [
            async (context: any) => {
                const data = context.data;
                const accountId = context.params.route.accountId;
                const params = context.params;
                const response = await app
                    .service('accounts')
                    .patch(accountId, data, params);
                context.data = response;
                return Promise.resolve(context);
            },
        ],
        update: [disallow()],
        patch: [
            authenticate('jwt'),
            validators.form(patchAccountsSchema, joiOptions),
        ],
        remove: [
            authenticate('jwt'),
            checkAccessToAccount(config.dbCollections.accounts, [Perm.ADMIN]),
        ],
    },

    after: {
        all: [requestSuccess()],
        find: [],
        get: [],
        create: [
            async (context: any) => {
                if (context.result.status === 'failure') {
                    context.statusCode = 400;
                }
                return Promise.resolve(context);
            },
        ],
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
