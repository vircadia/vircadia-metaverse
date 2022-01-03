import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import  requestFail  from '../../hooks/requestFail';
import requestSuccess from '../../hooks/requestSuccess';

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
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
