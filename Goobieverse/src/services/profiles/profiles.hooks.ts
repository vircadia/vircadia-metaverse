import { disallow } from 'feathers-hooks-common';
import checkAccessToAccount from '../../hooks/checkAccess';
import  requestFail  from '../../hooks/requestFail';
import requestSuccess from '../../hooks/requestSuccess';
import {Perm} from '../../utils/Perm';
import config from '../../appconfig';
import { iff } from 'feathers-hooks-common';
import isHasAuthToken from '../../hooks/isHasAuthToken';
import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;


export default {
    before: {
        all: [iff(isHasAuthToken(),authenticate('jwt'))],
        find: [],
        get: [checkAccessToAccount(config.dbCollections.accounts,[Perm.PUBLIC,Perm.OWNER,Perm.ADMIN])],
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
