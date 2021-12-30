import { HooksObject } from '@feathersjs/feathers';
import { myHook } from '../../hooks/userData';
import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [],
    find: [],
    get: [
      (context: any) => {
        // delete context.params.user
        console.log(context.params.user, 'context');
        return context;
      },
    ],
    create: [hashPassword('password')],
    update: [],
    patch: [],
    remove: [],
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
