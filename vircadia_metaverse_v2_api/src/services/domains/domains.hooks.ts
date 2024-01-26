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
import allowDomainAccessTokenAuth from '../../hooks/allowDomainAccessTokenAuth';
import config from '../../appconfig';
import { Perm } from '../../utils/Perm';
import validators from '@feathers-plus/validate-joi';
import { editDomainSchema, joiOptions } from './domains.joi';
import { disallow } from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';
import { IsNullOrEmpty } from '../../utils/Misc';

export default {
    before: {
        all: [
            allowDomainAccessTokenAuth(),
            authenticate('jwt', 'domain-access-token')],
        find: [],
        get: [],
        create: [],
        update: [
            (context: HookContext) => {
                if(context && IsNullOrEmpty(context.id)) {
                    context.id = context.params?.id || context.params?.route?.id;
                }
                return context;
            },
            checkAccessToAccount(config.dbCollections.domains, [
                Perm.SPONSOR,
                Perm.MANAGER,
                Perm.ADMIN,
            ]),
            /* FIXME: validators.form(editDomainSchema, joiOptions), fails domain server heartbeat request */
        ],
        patch: [disallow()],
        remove: [
            checkAccessToAccount(config.dbCollections.domains, [
                Perm.SPONSOR,
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
