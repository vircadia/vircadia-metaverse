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

import { BadRequest, NotAuthenticated } from '@feathersjs/errors';
import { NullableId, Params } from '@feathersjs/feathers';
import _ from 'lodash';
import config from '../../../appconfig';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { buildSimpleResponse } from '../../../common/responsebuilder/responseBuilder';
import { Application } from '../../../declarations';
import { messages } from '../../../utils/messages';
import { IsNotNullOrEmpty } from '../../../utils/Misc';
import {
    convertBinKeyToPEM,
    createSimplifiedPublicKey,
} from '../../../utils/Utils';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
/**
account public key
 * @noInheritDoc
 */
export class AccountPublickey extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * GET account public key
     *
     * @remarks
     * Return a account public key.
     * - Request Type - GET
     * - End Point - API_URL/user/{accountId}/public_key
     *
     * @requires -authentication
     *
     * @param accountId - account id
     * @returns -  {"status": "success", "data": {"": [{...},{...},...]} or  { status: 'failure', message: 'message'}
     *
     */

    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const accountId = params?.route?.accountId;
        const accountInfo = await this.getData(
            config.dbCollections.accounts,
            accountId as any
        );

        if (IsNotNullOrEmpty(accountInfo)) {
            return Promise.resolve({
                public_key: createSimplifiedPublicKey(
                    accountInfo.sessionPublicKey
                ),
                username: accountInfo.username,
                account_id: accountInfo.id,
            });
        } else {
            throw new BadRequest(
                messages.common_messages_target_account_notfound
            );
        }
    }

    /**
     * POST account public key
     *
     * @remarks
     * This method is to update logged in account public key
     * - Request Type - POST
     * - End Point - API_URL/user/public_key
     *
     * @requires -authentication
     * @param files = File upload bin file
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async patch(id: NullableId, data: any, params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (IsNotNullOrEmpty(loginUser)) {
            if (IsNotNullOrEmpty(params?.files)) {
                const publicKeyBin: Buffer = _.find(params?.files as any, {
                    fieldname: 'public_key',
                }).buffer;

                if (IsNotNullOrEmpty(publicKeyBin)) {
                    const sessionPublicKey = convertBinKeyToPEM(publicKeyBin);

                    const result = await this.patchData(
                        config.dbCollections.accounts,
                        loginUser.id,
                        { sessionPublicKey }
                    );

                    return Promise.resolve(buildSimpleResponse(result));
                } else {
                    throw new BadRequest(
                        messages.common_messages_bad_publickey
                    );
                }
            } else {
                throw new BadRequest(
                    messages.common_messages_asset_file_missing
                );
            }
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }
}

