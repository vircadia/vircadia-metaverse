import { disallow } from 'feathers-hooks-common';
import   checkAccessToAccount from '../../hooks/checkAccessToAccount';
import  requestFail  from '../../hooks/requestFail';
import requestSuccess from '../../hooks/requestSuccess';
import {Perm} from '../../utils/Perm';
export default {
  before: {
    all: [],
    find: [],
    get: [checkAccessToAccount([Perm.PUBLIC,Perm.OWNER,Perm.ADMIN])],
    create: [disallow()],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },

  after: {
    all: [requestSuccess()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [requestFail()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
