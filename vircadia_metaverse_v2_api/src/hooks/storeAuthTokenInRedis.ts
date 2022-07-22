import { NotAuthenticated } from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
import { authRepository, redisClient } from '../redis';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../utils/Misc';

export default () => {
    return async (context: HookContext): Promise<HookContext> => {
        if (
            context.path === 'authentication' &&
            context.method != 'remove' &&
            IsNotNullOrEmpty(context.result?.accessToken)
        ) {
            try {
                const authResult = context.result;

                const currentTime = Math.floor(Date.now() / 1000);

                const allAuthTokens = await authRepository
                    .search()
                    .return.all();

                if (IsNotNullOrEmpty(allAuthTokens)) {
                    // get expired tokens
                    const expiredAuths: any = await authRepository
                        .search()
                        .where('expires')
                        .lte(currentTime)
                        .returnAll();

                    // delete expired tokens
                    const deleteAuths =
                        IsNotNullOrEmpty(expiredAuths) &&
                        expiredAuths.map((expiredAuth: any) => {
                            return (
                                expiredAuth.prefix + ':' + expiredAuth.entityId
                            );
                        });

                    await redisClient.del(deleteAuths);
                }

                // create new token
                await authRepository.createAndSave({
                    token: authResult.accessToken,
                    tokenId: authResult.authentication.payload.jti,
                    userId: authResult.user.id,
                    expires: authResult.authentication.payload.exp,
                });
            } catch (e) {
                console.log(e);
                throw e;
            }
        }
        return context;
    };
};

