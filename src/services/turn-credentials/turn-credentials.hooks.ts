import { HooksObject } from '@feathersjs/feathers';
import * as feathersAuthentication from '@feathersjs/authentication';
import { disallow, iff } from 'feathers-hooks-common';
import config from '../../appconfig';

const { authenticate } = feathersAuthentication.hooks;

const isAnonymousAllowed = () => {
    return config.metaverse.turn?.allow_anonymous === true;
};

export default {
    before: {
        all: [],
        find: [disallow()],
        get: [disallow()],
        create: [
            iff(
                () => !isAnonymousAllowed(),
                authenticate('jwt')
            )
        ],
        update: [disallow()],
        patch: [disallow()],
        remove: [disallow()]
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
} as HooksObject;
