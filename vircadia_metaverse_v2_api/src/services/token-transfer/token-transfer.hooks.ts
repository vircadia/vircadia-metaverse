//   Copyright 2022 Vircadia Contributors
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

import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { disallow } from 'feathers-hooks-common';
import requestSuccess from '../../hooks/requestSuccess';
import requestFail from '../../hooks/requestFail';
const { authenticate } = authentication.hooks;
import validateSignature from '../../hooks/validateSignature';
import connectToGooTokenContract from '../../hooks/blockchain/connectToGooTokenContract';
import validators from '@feathers-plus/validate-joi';
import { tokenTransferSchema, joiOptions } from './token-transfer.joi';
import { BlockchainOptions } from './token-transfer.class';

export default (blockchainOptions: BlockchainOptions): Partial<HooksObject> => {
    return {
        before: {
            all: [],
            find: [disallow()],
            get: [disallow()],
            create: [
                authenticate('jwt'),
                validators.form(tokenTransferSchema, joiOptions),
                connectToGooTokenContract(blockchainOptions),
                validateSignature(),
            ],
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
};

