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

import { AchievementItemInterface } from '../../common/interfaces/Achievement';
import { Params, Id, NullableId } from '@feathersjs/feathers';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import config from '../../appconfig';
import {
    buildPaginationResponse,
    buildSimpleResponse,
} from '../../common/responsebuilder/responseBuilder';
import { buildAchievementItem } from '../../common/responsebuilder/AchievementBuilder';
import { messages } from '../../utils/messages';
import { GenUUID, IsNotNullOrEmpty } from '../../utils/Misc';
import { getUtcDate } from '../../utils/Utils';
import { NotFound, BadRequest } from '@feathersjs/errors';

/**
 * AchievementItems.
 * @noInheritDoc
 */
export class AchievementItems extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Returns the Achievement Items
     *
     * @remarks
     * This method is part of the get list of Achievement Items
     * - Request Type - GET
     * - End Point - API_URL/achievement-items?per_page=10&page=1 ....
     *
     * @param per_page - page size
     * @param page - page number
     * @returns - Paginated Achievement Items { "status": "success", "data":[{...},{...}],current_page:1,per_page:10,total_pages:1,total_entries:5}
     *
     */

    async find(params?: Params): Promise<any> {
        const perPage = parseInt(params?.query?.per_page) || 10;
        const page = parseInt(params?.query?.page) || 1;
        const skip = (page - 1) * perPage;
        const achievementItemsData = await this.findData(
            config.dbCollections.achievementItems,
            {
                query: {
                    $skip: skip,
                    $limit: perPage,
                },
            }
        );

        const achievementItemList: any[] = [];
        achievementItemsData.data.map((item) => {
            achievementItemList.push(buildAchievementItem(item));
        });
        return Promise.resolve(
            buildPaginationResponse(
                achievementItemList,
                page,
                perPage,
                Math.ceil(achievementItemsData.total / perPage),
                achievementItemsData.total
            )
        );
    }

    /**
     * Returns the Achievement Item
     *
     * @remarks
     * This method is part of the get Achievement Item
     * - Request Type - GET
     * - End Point - API_URL/achievement-items/{itemId}
     *
     * @param itemId - url param
     * @returns -  Achievement Item{ "status": "success", "data":{...}}
     *
     */
    async get(id: Id): Promise<any> {
        const achievementItem = await this.getData(
            config.dbCollections.achievementItems,
            id
        );
        if (achievementItem) {
            return Promise.resolve(
                buildSimpleResponse(buildAchievementItem(achievementItem))
            );
        } else {
            throw new NotFound(
                messages.common_messages_achievement_item_not_available
            );
        }
    }

    /**
     * Returns the Achievement Item
     *
     * @remarks
     * This method is part of the create Achievement Item
     * - Request Type - POST
     * - End Point - API_URL/achievement-items
     *
     * @param data - Json request body { "icon":"url","name":"name","description":"description"}
     * @returns -  Achievement Item{ "status": "success", "data":{...}}
     *
     */
    async create(data: Partial<any>): Promise<any> {
        const item: AchievementItemInterface = {
            id: GenUUID(),
            icon: data.icon.toString().trim(),
            name: data.name.toString().trim(),
            description: data.description.toString().trim(),
            createdAt: getUtcDate(),
            updatedAt: getUtcDate(),
        };
        const achievementItem = await this.createData(
            config.dbCollections.achievementItems,
            item
        );
        return Promise.resolve(
            buildSimpleResponse(buildAchievementItem(achievementItem))
        );
    }

    /**
     * Returns the Achievement Item
     *
     * @remarks
     * This method is part of the create Achievement Item
     * - Request Type - PATCH
     * - End Point - API_URL/achievement-items/{id}
     *
     * @param id - Achievement Item (url param)
     * @param data - Json request body { "icon":"url","name":"name","description":"description"}
     * @returns -  Achievement Item{ "status": "success", "data":{...}}
     *
     */
    async patch(id: NullableId, data: Partial<any>): Promise<any> {
        if (IsNotNullOrEmpty(id) && id) {
            const item = await this.getData(
                config.dbCollections.achievementItems,
                id
            );
            if (IsNotNullOrEmpty(item)) {
                const itemNewData: any = {};
                if (IsNotNullOrEmpty(data.icon)) {
                    itemNewData.icon = data.icon.toString().trim();
                }
                if (IsNotNullOrEmpty(data.name)) {
                    itemNewData.name = data.name.toString().trim();
                }
                if (IsNotNullOrEmpty(data.description)) {
                    itemNewData.description = data.description
                        .toString()
                        .trim();
                }

                itemNewData.updatedAt = getUtcDate();
                const achievementItem = await this.patchData(
                    config.dbCollections.achievementItems,
                    id,
                    itemNewData
                );
                return Promise.resolve(
                    buildSimpleResponse(buildAchievementItem(achievementItem))
                );
            } else {
                throw new NotFound(
                    messages.common_messages_achievement_item_not_available
                );
            }
        } else {
            throw new BadRequest(messages.common_messages_data_notfound);
        }
    }

    /**
     * Delete the Achievement Item
     *
     * @remarks
     * This method is part of the delete Achievement Item
     * - Request Type - DELETE
     * - End Point - API_URL/achievement-items/{id}
     *
     * @param id - Achievement Item (url param)
     * @returns -  Achievement Item{ "status": "success", "data":{}}
     *
     */
    async remove(id: NullableId): Promise<any> {
        if (id) {
            const result = await this.deleteData(
                config.dbCollections.achievementItems,
                id
            );
            if (result) {
                await this.deleteMultipleData(
                    config.dbCollections.achievements,
                    { query: { achievementItemId: id } }
                );
            }
            return Promise.resolve(buildSimpleResponse({}));
        } else {
            throw new BadRequest(messages.common_messages_data_notfound);
        }
    }
}
