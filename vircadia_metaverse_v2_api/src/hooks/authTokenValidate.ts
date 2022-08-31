import { NotAuthenticated } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { authRepository } from '../redis';
import { IsNullOrEmpty } from '../utils/Misc';
import { DatabaseService } from '../common/dbservice/DatabaseService';
import config from '../appconfig';
import { getUtcDate } from '../utils/Utils';

export default () => {
    return async (context: HookContext): Promise<HookContext> => {
        const dbService = new DatabaseService(
            { id: 'id', multi: ['remove'] },
            undefined,
            context
        );

        const contextAuth = context.params.authentication?.accessToken;
        let authToken = contextAuth
            ? contextAuth
            : context.params.headers?.authorization;

        let newAuthJwt = authToken.split(' ');

        const existAuth: any = await authRepository
            .search()
            .where('token')
            .equals(newAuthJwt[newAuthJwt.length - 1])
            .returnAll();

        await dbService.patchData(
            config.dbCollections.accounts,
            context.result.id,
            {
                timeOfLastHeartbeat: getUtcDate(),
            }
        );

        if (IsNullOrEmpty(existAuth)) {
            throw new NotAuthenticated('Invalid token');
        } else {
            return context;
        }
    };
};
