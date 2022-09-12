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

import { BadRequest } from '@feathersjs/errors';
import { NullableId, Params } from '@feathersjs/feathers';
import _ from 'lodash';
import config from '../../../appconfig';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { AccountInterface } from '../../../common/interfaces/AccountInterface';
import { buildSimpleResponse } from '../../../common/responsebuilder/responseBuilder';
import { Application } from '../../../declarations';
import { messages } from '../../../utils/messages';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../../../utils/Misc';
import { TokenScope } from '../../../utils/Tokens';
import {
    convertBinKeyToPEM,
    createSimplifiedPublicKey,
} from '../../../utils/Utils';
import { SArray } from '../../../utils/vTypes';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
/**
Domain public key
 * @noInheritDoc
 */
export class DomainPublickey extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * GET Domain public key
     *
     * @remarks
     * Return a domain public key.
     * - Request Type - GET
     * - End Point - API_URL/domains/{domainId}/public_key
     *
     * @requires -authentication
     *
     * @param domainId - Domain id
     * @returns -  {"status": "success", "data": {"": [{...},{...},...]} or  { status: 'failure', message: 'message'}
     *
     */

    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const domainId = params?.route?.domainId;
        if (IsNotNullOrEmpty(domainId)) {
            const domainInfo = await this.getData(
                config.dbCollections.domains,
                domainId as any
            );

            if (IsNotNullOrEmpty(domainInfo)) {
                const public_key = createSimplifiedPublicKey(
                    domainInfo.publicKey
                );

                return Promise.resolve({ public_key });
            } else {
                throw new BadRequest(
                    messages.common_messages_target_domain_notfound
                );
            }
        } else {
            throw new BadRequest(messages.common_domainId_notFound);
        }
    }

    /**
     * PUT domain public key
     *
     * @remarks
     * This method is to update domain public key
     * - Request Type - PUT
     * - End Point - API_URL/domains/{domainId}/public_key
     *
     * @requires -authentication
     * @param domainId = Url param
     * @param files = File upload bin file
     * @param api_key = api key of domain
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async update(id: NullableId, data: any, params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const domainId = params?.route?.domainId;
        const api_key = params?.body?.api_key;
        const auth_token = params.headers.authorization;
        const domainInfo = await this.getData(
            config.dbCollections.domains,
            domainId
        );
        let verified = false;

        if (IsNullOrEmpty(auth_token)) {
            if (api_key === domainInfo.apiKey) {
                verified = true;
            }
        } else {
            const tokenInfo = await this.findDataToArray(
                config.dbCollections.tokens,
                { query: { accountId: loginUser.id, scope: [ TokenScope.DOMAIN ] } }
            );

            if (IsNotNullOrEmpty(tokenInfo) && tokenInfo[0].accountId) {
                if (IsNullOrEmpty(domainInfo.sponsorAccountId)) {
                    const aAccount: AccountInterface = await this.getData(
                        config.dbCollections.accounts,
                        tokenInfo[0].accountId
                    );
                }

                if (
                    domainInfo.sponsorAccountId === tokenInfo[0].accountId
                ) {
                    verified = true;
                }
            } else {
                throw new BadRequest(
                    messages.common_messages_no_domain_token
                );
            }
        }

        if (verified) {
            const result = await this.updatePublicKey(domainId, params?.files);
            if (IsNotNullOrEmpty(result)) {
                return Promise.resolve(buildSimpleResponse(result));
            }
        } else {
            throw new BadRequest(messages.common_messages_domain_unauthorized);
        }
    }

    async updatePublicKey(domainId: any, files: any): Promise<any> {
        if (IsNotNullOrEmpty(domainId)) {
            if (IsNotNullOrEmpty(files)) {
                const publicKeyBin: Buffer = _.find(files as any, {
                    fieldname: 'public_key',
                }).buffer;

                const publicKey = convertBinKeyToPEM(publicKeyBin);
                const result = await this.patchData(
                    config.dbCollections.domains,
                    domainId,
                    {
                        publicKey,
                    }
                );
                return result;
            } else {
                throw new BadRequest(
                    messages.common_messages_asset_file_missing
                );
            }
        } else {
            throw new BadRequest(
                messages.common_messages_target_domain_notfound
            );
        }
    }
}

