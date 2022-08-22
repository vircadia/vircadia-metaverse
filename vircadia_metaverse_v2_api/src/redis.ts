import { Client, Entity, Schema } from 'redis-om';

const client = new Client();

client.open(`${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
console.log("redis connection established")
class AuthJwt extends Entity {}

const authToken = new Schema(AuthJwt, {
    token: { type: 'string' },
    tokenId: { type: 'string' },
    expires: { type: 'number' },
    userId: { type: 'string' },
});
console.log("redis auth repository created",authToken)

/* use the client to create a Repository */
export const authRepository = client.fetchRepository(authToken);
console.log("redis auth repository",authRepository)

authRepository.createIndex();

console.log("redis auth repository index created",authRepository)
