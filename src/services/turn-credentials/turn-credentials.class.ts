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
        const DEFAULT_ICE_SERVERS = [
            { urls: ['stun:stun.l.google.com:19302'], username: '', credential: '' },
            { urls: ['stun:stun1.l.google.com:19302'], username: '', credential: '' },
            { urls: ['stun:stun2.l.google.com:19302'], username: '', credential: '' },
            { urls: ['stun:stun3.l.google.com:19302'], username: '', credential: '' },
            { urls: ['stun:stun4.l.google.com:19302'], username: '', credential: '' },
        ];

        const response: TurnCredentialsResponse = {
            iceServers: [...DEFAULT_ICE_SERVERS]
        };

        if (config.metaverse.turn?.enabled) {
            const tokenId = config.metaverse.turn.token_id;
            const apiToken = config.metaverse.turn.api_token;

            if (tokenId && apiToken) {
                const ttl = data.ttl || 86400; // Default to 24 hours if not specified

                try {
                    const cfResponse = await axios.post(
                        `https://rtc.live.cloudflare.com/v1/turn/keys/${tokenId}/credentials/generate`,
                        { ttl },
                        {
                            headers: {
                                'Authorization': `Bearer ${apiToken}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    if (cfResponse.data && cfResponse.data.iceServers) {
                        response.iceServers.push(...cfResponse.data.iceServers);
                    } else {
                        console.warn('Upstream TURN provider returned invalid response: Missing iceServers');
                    }
                } catch (error: any) {
                    const cfError = error.response?.data?.errors?.[0]?.message;
                    const errorMsg = cfError || error.message;
                    console.error('Error generating TURN credentials:', error.response?.data || error.message);
                    // We don't throw here, just log the error so we still return the default ICE servers
                }
            } else {
                console.warn('TURN service is enabled but not configured: Missing Cloudflare credentials');
            }
        }

        return response;
    }
}
