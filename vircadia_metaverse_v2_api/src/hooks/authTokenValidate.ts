import { NotAuthenticated } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { authRepository } from '../redis';
import { IsNullOrEmpty } from '../utils/Misc';

export default () => {
    return async (context: HookContext): Promise<HookContext> => {
        const contextAuth = context.params.authentication?.accessToken;
        console.log('AuthTokenValidate hook called');
        const authToken = contextAuth
            ? contextAuth
            : context.params.headers?.authorization;
        console.log('AuthTokenValidate hook called authToken: ' + authToken);

        const existAuth: any = await authRepository
            .search()
            .where('token')
            .equals(authToken)
            .returnAll();
        console.log('AuthTokenValidate hook called existAuthToken: ' + existAuth);

        if (IsNullOrEmpty(existAuth)) {
            throw new NotAuthenticated('Invalid token');
        } else {
            return context;
        }
    };
};
