import { Id, NullableId, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import config from '../../appconfig';
import axios from 'axios';
import { BadRequest, GeneralError, Unavailable } from '@feathersjs/errors';

interface TurnCredentialsData {
    ttl?: number;
}

interface TurnCredentialsResponse {
    iceServers: {
        urls: string[];
        username: string;
        credential: string;
    }[];
}

export class TurnCredentials implements Partial<ServiceMethods<any>> {
    app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    async create(data: TurnCredentialsData, params?: Params): Promise<TurnCredentialsResponse> {
        if (!config.metaverse.turn?.enabled) {
            throw new Unavailable('TURN service is not enabled');
        }

        const tokenId = config.metaverse.turn.token_id;
        const apiToken = config.metaverse.turn.api_token;

        if (!tokenId || !apiToken) {
            throw new Unavailable('TURN service is not configured correctly');
        }

        const ttl = data.ttl || 86400; // Default to 24 hours if not specified

        try {
            const response = await axios.post(
                `https://rtc.live.cloudflare.com/v1/turn/keys/${tokenId}/credentials/generate`,
                { ttl },
                {
                    headers: {
                        'Authorization': `Bearer ${apiToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Error generating TURN credentials:', error.response?.data || error.message);
            throw new GeneralError('Failed to generate TURN credentials');
        }
    }
}
