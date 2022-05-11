import { disallow } from 'feathers-hooks-common';
import { HooksObject } from '@feathersjs/feathers';
import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import requestFail from '../../hooks/requestFail';
import requestSuccess from '../../hooks/requestSuccess';

export default {
    before: {
        all: [],
        find: [disallow()],
        get: [disallow()],
        create: [authenticate('jwt')],
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
} as HooksObject;
