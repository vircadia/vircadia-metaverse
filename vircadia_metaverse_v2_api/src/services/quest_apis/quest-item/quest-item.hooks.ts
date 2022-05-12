import { HooksObject } from '@feathersjs/feathers';
import requestFail from '../../../hooks/requestFail';
import requestSuccess from '../../../hooks/requestSuccess';
import { iff, disallow, isProvider } from 'feathers-hooks-common';
import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import isAdminUser from '../../../hooks/isAdminUser';
import validators from '@feathers-plus/validate-joi';
import {
    createQuestItemSchema,
    patchQuestItemSchema,
    findQuestItemSchema,
    joiOptions,
    joiReadOptions,
} from './quest-item.joi';

export default {
    before: {
        all: [],
        find: [
            iff(isProvider('external'), authenticate('jwt')),
            iff(isAdminUser()).else(disallow('external')),
            validators.form(findQuestItemSchema, joiReadOptions),
        ],
        get: [],
        create: [
            iff(isProvider('external'), authenticate('jwt')),
            iff(isAdminUser()).else(disallow('external')),
            validators.form(createQuestItemSchema, joiOptions),
        ],
        update: [disallow()],
        patch: [
            iff(isProvider('external'), authenticate('jwt')),
            iff(isAdminUser()).else(disallow('external')),
            validators.form(patchQuestItemSchema, joiOptions),
        ],
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
