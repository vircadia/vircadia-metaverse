import { NotAuthenticated } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { authRepository } from '../redis';
import { IsNullOrEmpty } from '../utils/Misc';

export default () => {
    return async (context: HookContext): Promise<HookContext> => {
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

        if (IsNullOrEmpty(existAuth)) {
            throw new NotAuthenticated('Invalid token');
        } else {
            return context;
        }
    };
};
