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

import { AchievementInterface } from './../../common/interfaces/Achievement';
import { DatabaseServiceOptions } from './../../common/dbservice/DatabaseServiceOptions';
import { DatabaseService } from './../../common/dbservice/DatabaseService';
import { Application } from '../../declarations';
import { Params, Id, NullableId } from '@feathersjs/feathers';
import { messages } from '../../utils/messages';
import { GenUUID, IsNotNullOrEmpty } from '../../utils/Misc';
import { getUtcDate } from '../../utils/Utils';
import config from '../../appconfig';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';
import { buildAchievement } from '../../common/responsebuilder/AchievementBuilder';
import { BadRequest, NotFound, NotAcceptable } from '@feathersjs/errors';

/**
 * Achievement.
 * @noInheritDoc
 */
export class Achievement extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Returns the User Achievements
     *
     * @remarks
     * This method is part of the get user Achievements
     * - Request Type - GET
     * - End Point - API_URL/achievement?userId=
     *
     * @param userId - query param
     * @returns -  Achievement { "status": "success", "data":[{"id": "","userId": "","item": {"id": "","icon": "","name": "","description": ""}}]}
     *
     */
    async find(params?: Params): Promise<any> {
        if (IsNotNullOrEmpty(params?.query?.userId)) {
            const userId = params?.query?.userId.toString().trim();
            const achievementList = await this.findDataToArray(
                config.dbCollections.achievements,
                { query: { userId: userId } }
            );
            const achievementItemIds = achievementList
                .map((item) => item.achievementItemId)
                .filter(
                    (value, index, self) =>
                        self.indexOf(value) === index && value !== undefined
                );
            const achievementItems = await this.findDataToArray(
                config.dbCollections.achievementItems,
                { query: { id: { $in: achievementItemIds } } }
            );
            const result: any[] = [];
            achievementList.map((achievement) => {
                let achievementItem: any;

                for (const item of achievementItems) {
                    if (item && item.id === achievement.achievementItemId) {
                        achievementItem = item;
                        break;
                    }
                }
                result.push(buildAchievement(achievement, achievementItem));
            });
            return Promise.resolve(buildSimpleResponse(result));
        } else {
            throw new BadRequest(messages.common_messages_badly_formed_request);
        }
    }

    /**
     * Returns the Achievement
     *
     * @remarks
     * This method is part of the get Achievement
     * - Request Type - GET
     * - End Point - API_URL/achievement/{achievementId}
     *
     * @param achievementId - url param
     * @returns -  Achievement { "status": "success", "data":{"id": "","userId": "","item": {"id": "","icon": "","name": "","description": ""}}}
     *
     */
    async get(id: Id): Promise<any> {
        const achievement = await this.getData(
            config.dbCollections.achievements,
            id
        );
        const achievementItem = await this.getData(
            config.dbCollections.achievementItems,
            achievement.achievementItemId
        );
        return Promise.resolve(
            buildSimpleResponse(buildAchievement(achievement, achievementItem))
        );
    }

    /**
     * Returns the Achievement
     *
     * @remarks
     * This method is part of the create Achievement
     * - Request Type - POST
     * - End Point - API_URL/achievement
     *
     * @param data - Json request body { "achievementItemId":"","userId":""}
     * @returns -  Achievement Item{ "status": "success", "data":{...}}
     *
     */
    async create(data: Partial<any>): Promise<any> {
        const achievementItem = await this.getData(
            config.dbCollections.achievementItems,
            data.achievementItemId
        );
        const achievementList = await this.findDataToArray(
            config.dbCollections.achievements,
            {
                query: {
                    achievementItemId: data.achievementItemId.toString().trim(),
                    userId: data.userId.toString().trim(),
                },
            }
        );
        if (achievementList.length > 0) {
            throw new NotAcceptable(
                messages.common_messages_achievement_already_achieved
            );
        }
        if (IsNotNullOrEmpty(achievementItem)) {
            const item: AchievementInterface = {
                id: GenUUID(),
                achievementItemId: data.achievementItemId.toString().trim(),
                userId: data.userId.toString().trim(),
                createdAt: getUtcDate(),
                updatedAt: getUtcDate(),
            };
            await this.createData(config.dbCollections.achievements, item);
            return Promise.resolve(
                buildSimpleResponse(buildAchievement(item, achievementItem))
            );
        } else {
            throw new NotFound(
                messages.common_messages_achievement_item_not_available
            );
        }
    }

    /**
     * Delete the Achievement
     *
     * @remarks
     * This method is part of the delete Achievement
     * - Request Type - DELETE
     * - End Point - API_URL/achievement/{id}
     *
     * @param id - Achievement Item (url param)
     * @returns -  Achievement Item{ "status": "success", "data":{}}
     *
     *
     * - End Point - API_URL/achievement?achievementItemId=5ef1951f-bd96-441f-8873-172422b325dd&userId=764ef37c-c1da-475c-8d19-5c0590faaf61
     *
     * @param achievementItemId - Achievement Item id (Query param)
     * @param userId - User id (Query param)
     * @returns -  Achievement Item{ "status": "success", "data":{}}
     *
     */
    async remove(id: NullableId, params?: Params): Promise<any> {
        if (IsNotNullOrEmpty(id) && id) {
            await this.deleteData(config.dbCollections.achievements, id);
            return Promise.resolve(buildSimpleResponse({}));
        } else if (
            params &&
            params.query &&
            IsNotNullOrEmpty(params?.query?.userId) &&
            IsNotNullOrEmpty(params?.query?.achievementItemId)
        ) {
            const result = await this.deleteMultipleData(
                config.dbCollections.achievements,
                {
                    query: {
                        achievementItemId: params.query.achievementItemId,
                        userId: params.query.userId,
                    },
                }
            );
            if (IsNotNullOrEmpty(result) && result.length > 0) {
                return Promise.resolve(buildSimpleResponse({}));
            } else {
                throw new NotFound(
                    messages.common_messages_achievement_not_found
                );
            }
        } else {
            throw new BadRequest(messages.common_messages_badly_formed_request);
        }
    }
}
