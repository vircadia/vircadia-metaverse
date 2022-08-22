import { Client, Entity, Schema } from 'redis-om';

const client = new Client();

client.open(`${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
class AuthJwt extends Entity {}

const authToken = new Schema(AuthJwt, {
    token: { type: 'string' },
    tokenId: { type: 'string' },
    expires: { type: 'number' },
    userId: { type: 'string' },
});

/* use the client to create a Repository */
export const authRepository = client.fetchRepository(authToken);

authRepository.createIndex();

