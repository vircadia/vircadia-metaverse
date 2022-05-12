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

'use strict';

import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { Application } from '../../declarations';
import config from '../../appconfig';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import { messages } from '../../utils/messages';
import { BadRequest, NotAcceptable } from '@feathersjs/errors';
import { buildAccountInfo } from '../../common/responsebuilder/accountsBuilder';
import { NullableId } from '@feathersjs/feathers';

/**
 * Friends.
 * @noInheritDoc
 */
export class Friends extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * POST Friend
     *
     * @remarks
     * This method is part of the POST friend
     * - Set a user as a friend. The other user must already have a "connection" with this user.
     * - Request Type - POST
     * - End Point - API_URL/friends
     *
     * @requires -authentication
     * @param requestBody - {"username": stringUsername}
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async create(data: any, params?: any): Promise<any> {
        const userName = data.username.toString().trim();
        const loginUser = extractLoggedInUserFromParams(params);
        const ParticularUserData: any = await this.findData(
            config.dbCollections.accounts,
            { query: { id: loginUser.id } }
        );
        if (ParticularUserData.data[0].connections.includes(userName)) {
            const newParticularUserData = ParticularUserData.data[0];
            newParticularUserData.friends.push(userName);
            const result = await this.patchData(
                config.dbCollections.accounts,
                loginUser.id,
                newParticularUserData
            );
            const accountResponse = await buildAccountInfo(result);
            return Promise.resolve(buildSimpleResponse(accountResponse));
        } else {
            throw new NotAcceptable(
                messages.common_messages_cannot_add_friend_who_not_connection
            );
        }
    }

    /**
     * GET Friend
     *
     * @remarks
     * Return a list of friends of the requesting account.
     * - Request Type - GET
     * - End Point - API_URL/friends
     *
     * @requires -authentication
     * @returns -  {"status": "success", "data": {"friends": [username,username,...]} or  { status: 'failure', message: 'message'}
     *
     */

    async find(params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (loginUser?.friends) {
            const friends = loginUser.friends;
            return Promise.resolve(buildSimpleResponse({ friends }));
        } else {
            throw new BadRequest(messages.common_messages_no_friend_found);
        }
    }

    /**
     * Delete Friend
     *
     * @remarks
     * This method is part of the delete friend
     * - Request Type - DELETE
     * - End Point - API_URL/friends/{username}
     *
     * @requires @param friend -username (URL param)
     * @requires -authentication
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async remove(userName: NullableId, params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (loginUser?.friends) {
            const ParticularUserData: any = await this.findData(
                config.dbCollections.accounts,
                { query: { id: loginUser.id } }
            );
            const friends = ParticularUserData.data[0].friends.filter(function (
                value: string
            ) {
                return value !== userName;
            });
            ParticularUserData.data[0].friends = friends;
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
}
