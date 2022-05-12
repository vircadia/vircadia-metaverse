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

import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import config from '../../appconfig';
import { BadRequest, NotAcceptable } from '@feathersjs/errors';
import { AccountInterface } from '../../common/interfaces/AccountInterface';
import { buildAccountInfo } from '../../common/responsebuilder/accountsBuilder';
import {
    buildPaginationResponse,
    buildSimpleResponse,
} from '../../common/responsebuilder/responseBuilder';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import { messages } from '../../utils/messages';
import { IsNotNullOrEmpty } from '../../utils/Misc';

/**
 * Connections.
 * @noInheritDoc
 */
export class Connections extends DatabaseService {
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
     * - End Point - API_URL/connections
     *
     * @requires -authentication
     * @param requestBody - {"username": stringUsername}
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async create(data: any, params?: any): Promise<any> {
        if (data && IsNotNullOrEmpty(data.username)) {
            const useName = data.username.toString().trim();
            const loginUser = extractLoggedInUserFromParams(params);
            if (loginUser.connections.includes(useName)) {
                throw new NotAcceptable(
                    messages.common_messages_already_in_connection
                );
            } else if (
                loginUser.username.toString().toLowerCase() ===
                useName.toLowerCase()
            ) {
                throw new NotAcceptable(
                    messages.common_messages_not_allow_self_connect
                );
            }
            const userData: any = await this.getData(
                config.dbCollections.accounts,
                loginUser.id
            );
            userData.connections.push(useName);
            const result = await this.patchData(
                config.dbCollections.accounts,
                loginUser.id,
                userData
            );
            const accountResponse = await buildAccountInfo(result);
            return Promise.resolve(buildSimpleResponse(accountResponse));
        } else {
            throw new BadRequest(messages.common_messages_badly_formed_request);
        }
    }

    /**
     * Delete Connection
     *
     * @remarks
     * This method is part of the delete connection
     * - Request Type - DELETE
     * - End Point - API_URL/connections/{username}
     *
     * @requires @param acct -username (URL param)
     * @requires -authentication
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async remove(userName: NullableId, params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (IsNotNullOrEmpty(loginUser?.connections)) {
            const ParticularUserData: any = await this.findData(
                config.dbCollections.accounts,
                { query: { id: loginUser.id } }
            );
            const connections = ParticularUserData.data[0].connections.filter(
                function (value: string) {
                    return value !== userName;
                }
            );
            ParticularUserData.data[0].connections = connections;
            const newParticularUserData = ParticularUserData.data[0];
            const result = await this.patchData(
                config.dbCollections.accounts,
                loginUser.id,
                newParticularUserData
            );
            const accountResponse = await buildAccountInfo(result);
            return Promise.resolve(buildSimpleResponse(accountResponse));
        } else {
            throw new BadRequest(messages.common_messages_not_logged_in);
        }
    }

    /**
     * GET Connection
     *
     * @remarks
     * This method is part of the get list of users and their connection
     * - Request Type - GET
     * - End Point - API_URL/connections
     *
     * @param per_page - page size
     * @param page - page number
     *
     * @requires -authentication
     * @returns - { data:{user:[{...},{...}]},current_page:1,per_page:10,total_pages:1,total_entries:5}}, or { status: 'failure', message: 'message'}
     *
     */

    async find(params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const perPage = parseInt(params?.query?.per_page) || 10;
        const page = parseInt(params?.query?.page) || 1;
        const skip = (page - 1) * perPage;

        const usersData = await this.findData(config.dbCollections.accounts, {
            query: {
                accountIsActive: true,
                $skip: skip,
                $limit: perPage,
                connections: { $in: loginUser.connections },
            },
        });

        const userList: AccountInterface[] = usersData.data;

        const users: Array<any> = [];
        (userList as Array<AccountInterface>)?.forEach(async (element) => {
            users.push(await buildAccountInfo(element));
        });
        return Promise.resolve(
            buildPaginationResponse(
                { users },
                page,
                perPage,
                Math.ceil(usersData.total / perPage),
                usersData.total
            )
        );
    }
}
