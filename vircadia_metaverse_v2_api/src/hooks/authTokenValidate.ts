import { NotAuthenticated } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { authRepository } from '../redis';
import { IsNullOrEmpty } from '../utils/Misc';

export default () => {
    return async (context: HookContext): Promise<HookContext> => {
        const contextAuth = context.params.authentication?.accessToken;
        const authToken = contextAuth
            ? contextAuth
            : context.params.headers?.authorization;

        const existAuth: any = await authRepository
            .search()
            .where('token')
            .equals(authToken)
            .returnAll();

        if (IsNullOrEmpty(existAuth)) {
            throw new NotAuthenticated('Invalid token');
        } else {
            return context;
        }
    };
};
