import * as feathersAuthentication from '@feathersjs/authentication';
const { authenticate } = feathersAuthentication.hooks;
import requestSuccess from '../../hooks/requestSuccess';
import  requestFail  from '../../hooks/requestFail';
import checkAccessToAccount from '../../hooks/checkAccess';
import config from '../../appconfig';
import {Perm} from '../../utils/Perm';
import isHasAuthToken from '../../hooks/isHasAuthToken';
import { iff } from 'feathers-hooks-common';
import { disallow } from 'feathers-hooks-common';

export default {
    before: {
        all: [],
        find: [authenticate('jwt')],
        get: [iff(isHasAuthToken(),authenticate('jwt')),checkAccessToAccount(config.dbCollections.accounts,[Perm.PUBLIC,Perm.OWNER,Perm.ADMIN])],
        create: [disallow()],
        update: [disallow()],
        patch: [authenticate('jwt')],
        remove: [authenticate('jwt'),checkAccessToAccount(config.dbCollections.accounts,[Perm.ADMIN])]
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
