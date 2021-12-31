import { HooksObject } from '@feathersjs/feathers';
import { myHook } from '../../hooks/userData';
import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import  requestFail  from '../../hooks/requestFail';
import requestSuccess from '../../hooks/requestSuccess';
import { Perm } from '../../utils/Perm';
import   checkAccessToAccount from '../../hooks/checkAccessToAccount';

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [hashPassword('password')],
    update: [hashPassword('password')],
    patch: [],
    remove: [],
  },

  after: {
    all: [protect('password'),requestSuccess()],
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
