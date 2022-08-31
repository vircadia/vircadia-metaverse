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

import { DomainInterface } from '../../common/interfaces/DomainInterface';
import { Params, NullableId } from '@feathersjs/feathers';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import config from '../../appconfig';
import { buildDomainInfoV1 } from '../../common/responsebuilder/domainsBuilder';
import { isAdmin } from '../../utils/Utils';
import { AccountInterface } from '../../common/interfaces/AccountInterface';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../../utils/Misc';
import { messages } from '../../utils/messages';
import {
    buildPaginationResponse,
    buildSimpleResponse,
} from '../../common/responsebuilder/responseBuilder';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import { BadRequest, NotFound } from '@feathersjs/errors';

/**
 * Domains.
 * @noInheritDoc
 */
export class Domains extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * GET Domains
     *
     * @remarks
     * Return a list of domain.
     * - Request Type - GET
     * - End Point - API_URL/domains
     *
     * @requires -authentication
     *
     * @optional @param per_page - page size
     * @optional @param page - page number
     * @optional @param account - Account id
     * @optional @param asAdmin - true | false if logged in account is administrator, list all accounts. Value is optional.
     * @returns -  {"status": "success", "data": {"domains": [{...},{...},...]} or  { status: 'failure', message: 'message'}
     *
     */
    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const perPage = parseInt(params?.query?.per_page) || 10;
        const page = parseInt(params?.query?.page) || 1;
        const skip = (page - 1) * perPage;
        let asAdmin = params?.query?.asAdmin === 'true' ? true : false;
        const targetAccount = params?.query?.account ?? '';
        const loginUserId = loginUser?.id ?? '';
        if (
            asAdmin &&
            IsNotNullOrEmpty(loginUser) &&
            isAdmin(loginUser as AccountInterface) &&
            IsNullOrEmpty(targetAccount)
        ) {
            asAdmin = true;
        } else {
            asAdmin = false;
        }

        const queryParams: any = {};

        if (asAdmin && IsNotNullOrEmpty(targetAccount)) {
            queryParams.sponsorAccountId = targetAccount;
        } else if (!asAdmin) {
            queryParams.sponsorAccountId = loginUserId;
        }
        const domainsData = await this.findData(config.dbCollections.domains, {
            query: {
                ...queryParams,
                $skip: skip,
                $limit: perPage,
            },
        });
        const domainList: DomainInterface[] = domainsData.data;
        const domains: Array<any> = [];

        await Promise.all(
            domainList.map(async (element) => {
                domains.push(await buildDomainInfoV1(this, element));
            })
        );

        return Promise.resolve(
            buildPaginationResponse(
                { domains: domains },
                page,
                perPage,
                Math.ceil(domainsData.total / perPage),
                domainsData.total
            )
        );
    }

    /**
     * Returns the domain
     *
     * @remarks
     * This method is part of the get domain
     * - Request Type - GET
     * - End Point - API_URL/domains/{domainId}
     *
     * @required @param domainsId - Domain id (Url param)
     * @returns - domain { data:{domain{...}}}
     *
     */
    async get(id: NullableId): Promise<any> {
        if (IsNotNullOrEmpty(id) && id) {
            const objDomain = await this.getData(
                config.dbCollections.domains,
                id
            );
            if (IsNotNullOrEmpty(objDomain)) {
                const domain = await buildDomainInfoV1(this, objDomain);
                return Promise.resolve(buildSimpleResponse({ domain }));
            }
        }
        throw new NotFound(messages.common_messages_target_domain_notfound);
    }

    /**
     * Patch domain
     *
     * @remarks
     * This method is part of the edit domain
     * - Request Type - PATCH
     * - End Point - API_URL/domains/{domainId}
     *
     * @requires -authentication
     * @param domainId = Url param
     * @param body = {
     *                name:"",
     *                version:"",
     *                protocol:"",
     *                network_address:"",
     *                restricted:"",
     *                capacity:10,
     *                description:"",
     *                maturity:"",
     *                restriction:"",
     *                managers:[],
     *                tags:[],
     *                heartbeat:{num_users:3,anon_users:5}
     *               }
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */
    async update(id: NullableId, data: any): Promise<any> {
        if (IsNotNullOrEmpty(id) && id) {
            const domainData = data.domain;
            const updateDomain: any = {};
            if (IsNotNullOrEmpty(domainData?.name)) {
                updateDomain.name = domainData.name;
            }

            if (IsNotNullOrEmpty(domainData.version)) {
                updateDomain.version = domainData.version;
            }

            if (IsNotNullOrEmpty(domainData.protocol)) {
                updateDomain.protocol = domainData.protocol;
            }

            if (IsNotNullOrEmpty(domainData.network_address)) {
                updateDomain.networkAddr = domainData.network_address;
            }

            if (IsNotNullOrEmpty(domainData.restricted)) {
                updateDomain.restricted = domainData.restricted;
            }

            if (IsNotNullOrEmpty(domainData.capacity)) {
                updateDomain.capacity = domainData.capacity;
            }
            if (IsNotNullOrEmpty(domainData.description)) {
                updateDomain.description = domainData.description;
            }

            if (IsNotNullOrEmpty(domainData.maturity)) {
                updateDomain.maturity = domainData.maturity;
            }

            if (IsNotNullOrEmpty(domainData.restriction)) {
                updateDomain.restriction = domainData.restriction;
            }

            if (IsNotNullOrEmpty(domainData.managers)) {
                updateDomain.managers = domainData.managers;
            }

            if (IsNotNullOrEmpty(domainData.tags)) {
                updateDomain.tags = domainData.tags;
            }

            if (IsNotNullOrEmpty(domainData.heartbeat)) {
                if (IsNotNullOrEmpty(domainData.heartbeat.num_users)) {
                    updateDomain.numUsers = domainData.heartbeat.num_users;
                }

                if (IsNotNullOrEmpty(domainData.heartbeat.anon_users)) {
                    updateDomain.anonUsers = domainData.heartbeat.anon_users;
                }
            }
            updateDomain.timeOfLastHeartbeat = new Date();
            await this.patchData(
                config.dbCollections.domains,
                id,
                updateDomain
            );
            return Promise.resolve({});
        } else {
            throw new BadRequest(
                messages.common_messages_target_domain_notfound
            );
        }
    }

    /**
     * Delete domain
     *
     * @remarks
     * This method is part of the delete domain
     * - Request Type - DELETE
     * - End Point - API_URL/domains/{domainId}
     *
     * @requires -authentication
     * @param domainId = Url param
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */
    async remove(id: NullableId): Promise<any> {
        if (IsNotNullOrEmpty(id) && id) {
            await this.deleteData(config.dbCollections.domains, id);
            return Promise.resolve({});
        } else {
            throw new BadRequest(
                messages.common_messages_target_domain_notfound
            );
        }
    }
}
