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
import { DomainInterface } from '../../common/interfaces/DomainInterface';
import { AccountInterface } from '../../common/interfaces/AccountInterface';
import config from '../../appconfig';
import { Availability } from '../../common/sets/Availability';
import { Params, Id } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { buildAccountProfile } from '../../common/responsebuilder/accountsBuilder';
import { IsNotNullOrEmpty } from '../../utils/Misc';
import { messages } from '../../utils/messages';
import {
    buildPaginationResponse,
    buildSimpleResponse,
} from '../../common/responsebuilder/responseBuilder';
import { NotFound } from '@feathersjs/errors';

/**
 * Profiles.
 * @noInheritDoc
 */
export class Profiles extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Returns the Profile
     *
     * @remarks
     * This method is part of the get list of profile
     * - Request Type - GET
     * - End Point - API_URL/profiles?per_page=10&page=1
     *
     * @param per_page - page size
     * @param page - page number
     * @returns - Paginated profiles { data:[{...},{...}],current_page:1,per_page:10,total_pages:1,total_entries:5}
     *
     */

    async find(params?: Params): Promise<any> {
        const perPage = parseInt(params?.query?.per_page) || 10;
        const page = parseInt(params?.query?.page) || 1;
        const skip = (page - 1) * perPage;

        const accountData = await this.findData(config.dbCollections.accounts, {
            query: {
                $or: [
                    { availability: undefined },
                    { availability: Availability.ALL },
                ],
                $skip: skip,
                $limit: perPage,
            },
        });

        const accounts: AccountInterface[] =
            accountData.data as Array<AccountInterface>;

        const domainIds = accounts
            .map((item) => item.locationDomainId)
            .filter(
                (value, index, self) =>
                    self.indexOf(value) === index && value !== undefined
            );

        const domains = await this.findDataToArray(
            config.dbCollections.domains,
            { query: { id: { $in: domainIds } } }
        );

        const profiles: Array<any> = [];

        (accounts as Array<AccountInterface>)?.forEach(async (element) => {
            let DomainInterface: DomainInterface | undefined;
            for (const domain of domains) {
                if (domain && domain.id === element.locationDomainId) {
                    DomainInterface = domain;
                    break;
                }
            }
            profiles.push(await buildAccountProfile(element, DomainInterface));
        });
        return Promise.resolve(
            buildPaginationResponse(
                { profiles },
                page,
                perPage,
                Math.ceil(accountData.total / perPage),
                accountData.total
            )
        );
    }

    /**
     * Returns the Profile
     *
     * @remarks
     * This method is part of the get profile
     * - Request Type - GET
     * - End Point - API_URL/profiles/{profileId}
     * - Access - Public, Owner, Admin
     *
     * @param ProfileId - Profile id (Url param)
     * @returns - Profile { data:{...}}
     *
     */
    async get(id: Id): Promise<any> {
        const account = await this.getData(config.dbCollections.accounts, id);

        if (IsNotNullOrEmpty(account)) {
            const domains = await this.findDataToArray(
                config.dbCollections.domains,
                { id: { $eq: account.locationDomainId } }
            );
            let DomainInterface: any;
            if (IsNotNullOrEmpty(domains)) {
                DomainInterface = domains[0];
            }
            if (IsNotNullOrEmpty(account?.achievementId)) {
                const achievementData = await this.getData(
                    config.dbCollections.achievementItems,
                    account?.achievementId
                );
                const profile = await buildAccountProfile(
                    account,
                    DomainInterface,
                    achievementData
                );
                return Promise.resolve(buildSimpleResponse({ profile }));
            }
            const profile = await buildAccountProfile(account, DomainInterface);
            return Promise.resolve(buildSimpleResponse({ profile }));
        } else {
            throw new NotFound(
                messages.common_messages_target_profile_notfound
            );
        }
    }
}
