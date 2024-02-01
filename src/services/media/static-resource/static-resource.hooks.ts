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

import { HookContext, HooksObject } from '@feathersjs/feathers';
import { hooks } from '@feathersjs/authentication';
import dauria from 'dauria';
import attachOwnerIdInQuery from '../../../hooks/media/set-loggedin-user-in-query';
import { Perm } from '../../../utils/Perm';
import userPermission from '../../../hooks/userPermission';

const { authenticate } = hooks;

export default {
    before: {
        all: [],
        find: [],
        get: [],
        create: [
            authenticate('jwt'),
            //userPermission([Perm.ADMIN]),
            (context: HookContext): HookContext => {
                if (!context.data.uri && context.params.file) {
                    const file = context.params.file;
                    const uri = dauria.getBase64DataURI(
                        file.buffer,
                        file.mimetype
                    );

                    const mimeType = context.data.mimeType ?? file.mimetype;
                    //console.log('mimeType is', file.mimetype);
                    const name = context.data.name ?? file.name;
                    context.data = { uri: uri, mimeType: mimeType, name: name };
                }
                return context;
            },
        ],
        update: [
            authenticate('jwt'),
            // userPermission([Perm.ADMIN])
        ],
        patch: [
            authenticate('jwt'),
            //userPermission([Perm.ADMIN])
        ],
        remove: [
            authenticate('jwt'),
            //userPermission([Perm.ADMIN]),
            attachOwnerIdInQuery('userId'),
        ],
    },

    after: {
        all: [],
        find: [],
        get: [],
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
