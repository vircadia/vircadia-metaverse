import { NullableId } from '@feathersjs/feathers';
//   Copyright 2020 Vircadia Contributors
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

('use strict');

import { BadRequest } from '@feathersjs/errors';
import config from '../../appconfig';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';
import { RequestType } from '../../common/sets/RequestType';
import { Application } from '../../declarations';
import { messages } from '../../utils/messages';
import { IsNotNullOrEmpty, GenUUID } from '../../utils/Misc';
import { VKeyedCollection } from '../../utils/vTypes';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import { RequestInterface } from '../../common/interfaces/RequestInterface';

/**
 * ConnectionRequest.
 * @noInheritDoc
 */
export class ConnectionRequest extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * POST Connection
     *
     * @remarks
     * This method is part of the POST connection
     * - Request Type - POST
     * - End Point - API_URL/api/v1/user/connection_request
     *
     * @requires -authentication
     * @param requestBody - {
     *                           "user_connection_request": {
     *                                      "node_id" : "",
     *                                      "proposed_node_id" : "",
     *                            }
     *                      }
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async create(data: any, params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        let pending = true;
        if (IsNotNullOrEmpty(loginUser)) {
            if (data.user_connection_request) {
                const thisNode = data.user_connection_request.node_id;
                const otherNode = data.user_connection_request.proposed_node_id;

                const pType = RequestType.HANDSHAKE;
                const wayone: VKeyedCollection = {};
                wayone['requesterNodeId'] = thisNode;
                wayone['targetNodeId'] = otherNode;
                const waytwo: VKeyedCollection = {};
                waytwo['requesterNodeId'] = thisNode;
                waytwo['targetNodeId'] = otherNode;

                const previousAsk = await this.findDataToArray(
                    config.dbCollections.requests,
                    {
                        query: {
                            $or: [wayone, waytwo],
                            requestType: pType,
                        },
                    }
                );

                if (IsNotNullOrEmpty(previousAsk[0])) {
                    if (previousAsk[0].requesterNodeId === thisNode) {
                        if (previousAsk[0].targetAccepted) {
                            await this.BuildNewConnection(previousAsk[0]);

                            pending = false;
                            const otherAccount = await this.getData(
                                config.dbCollections.accounts,
                                previousAsk[0].targetAccountId
                            );
                            const connection = {
                                new_connection: true,
                                username: otherAccount
                                    ? otherAccount.username
                                    : 'UNKNOWN',
                            };
                            return Promise.resolve({
                                connection,
                            });
                        } else {
                            throw new BadRequest('Request is not accepted');
                        }
                    } else {
                        previousAsk[0].targetAccepted = true;
                        previousAsk[0].targetAccountId = loginUser.id;

                        await this.patchData(
                            config.dbCollections.requests,
                            previousAsk[0].id,
                            previousAsk[0]
                        );
                        const areConnected = await this.BuildNewConnection(
                            previousAsk[0]
                        );
                        if (areConnected) {
                            const otherAccount = await this.getData(
                                config.dbCollections.accounts,
                                previousAsk[0].requestingAccountId
                            );
                            pending = false;
                            const connection = {
                                new_connection: true,
                                username: otherAccount
                                    ? otherAccount.username
                                    : 'UNKNOWN',
                            };

                            return Promise.resolve({
                                connection,
                            });
                        } else {
                            return new BadRequest('Error making connection');
                        }
                    }
                } else {
                    const aRequest: RequestInterface = {};
                    aRequest.id = GenUUID();
                    aRequest.expirationTime = new Date(Date.now() + 1000 * 60);
                    aRequest.whenCreated = new Date();
                    aRequest.requestType = RequestType.HANDSHAKE;
                    aRequest.requesterNodeId = thisNode;
                    aRequest.requesterAccepted = false;
                    aRequest.targetNodeId = otherNode;
                    aRequest.targetAccepted = false;
                    const expirationMinutes =
                        config.metaverseServer
                            .handshake_request_expiration_minutes;
                    aRequest.expirationTime = new Date(
                        Date.now() + 1000 * 60 * expirationMinutes
                    );
                    aRequest.requesterAccepted = true;
                    aRequest.requestingAccountId = loginUser.id;

                    await this.createData(
                        config.dbCollections.requests,
                        aRequest
                    );
                }
                if (pending) {
                    // The above didn't create a response so we're just waiting
                    return Promise.resolve({
                        connection: 'pending',
                    });
                }
            } else {
                throw new BadRequest(
                    messages.common_messages_badly_formed_data
                );
            }
        }
    }

    async BuildNewConnection(pRequest: RequestInterface): Promise<any> {
        let wasConnected = false;

        const requestingAccount = await this.getData(
            config.dbCollections.accounts,
            pRequest.requestingAccountId as any
        );
        const targetAccount = await this.getData(
            config.dbCollections.accounts,
            pRequest.targetAccountId as any
        );

        if (requestingAccount && targetAccount) {
            requestingAccount.connections.push(targetAccount.username);

            targetAccount.connections.push(requestingAccount.username);

            await this.patchData(
                config.dbCollections.accounts,
                targetAccount.id,
                targetAccount
            );

            await this.patchData(
                config.dbCollections.accounts,
                requestingAccount.id,
                requestingAccount
            );

            wasConnected = true;
        } else {
            throw new BadRequest(
                'Acceptance for connection but accounts not found'
            );
        }
        return wasConnected;
    }

    /**
     * Delete Connection
     *
     * @remarks
     * This method is part of the delete connection
     * - Request Type - DELETE
     * - End Point - API_URL/api/v1/user/connection_request
     *
     * @requires -authentication
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async remove(id: NullableId, params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (IsNotNullOrEmpty(loginUser)) {
            const criteria: any = {
                requestingAccount: loginUser.id,
            };

            const pRequestType = RequestType.HANDSHAKE;

            if (IsNotNullOrEmpty(pRequestType)) {
                criteria.requestType = pRequestType;
            }

            const deletedCount = await this.deleteMultipleData(
                config.dbCollections.requests,
                criteria
            );

            return Promise.resolve(buildSimpleResponse(deletedCount));
        } else {
            throw new BadRequest(messages.common_messages_not_logged_in);
        }
    }
}

