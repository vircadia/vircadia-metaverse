import { HooksObject } from '@feathersjs/feathers';
import * as local from '@feathersjs/authentication-local';
import  requestFail  from '../../hooks/requestFail';
import requestSuccess from '../../hooks/requestSuccess';
// import { Perm } from '../../utils/Perm';
// import checkAccessToAccount from '../../hooks/checkAccessToAccount';
import * as authentication from '@feathersjs/authentication';

const { authenticate } = authentication.hooks;
const { hashPassword } = local.hooks;

export default {
    before: {
        all: [],
        find: [authenticate('jwt')],
        get: [],
        create: [hashPassword('password')],
        update: [hashPassword('password')],
        patch: [],
        remove: [],
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
