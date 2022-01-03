import { HooksObject } from '@feathersjs/feathers';
import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { disallow } from 'feathers-hooks-common';
const { authenticate } = feathersAuthentication.hooks;
const {  protect } = local.hooks;

export default {
    before: {
        all: [],
        find: [ authenticate('jwt') ],
        get: [ authenticate('jwt') ],
        create: [disallow('external')],
        update: [disallow('external')],
        patch: [disallow('external')],
        remove: [ disallow('external')]
    },

    after: {
        all: [protect('password')],
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
