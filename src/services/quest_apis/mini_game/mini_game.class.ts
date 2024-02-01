//   Copyright 2020 Vircadia Contributors
//   Copyright 2022 DigiSomni LLC.
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
import { Id, NullableId, Params } from '@feathersjs/feathers';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../../declarations';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../../../utils/Misc';
import { getUtcDate } from '../../../utils/Utils';
import config from '../../../appconfig';
import {
    buildSimpleResponse,
    buildPaginationResponse,
} from '../../../common/responsebuilder/responseBuilder';
import { messages } from '../../../utils/messages';
import { BadRequest } from '@feathersjs/errors';
import { buildMiniGameInfo } from '../../../common/responsebuilder/miniGameBuilder';

export class MiniGame extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * minigame Item
     *
     * @remarks
     * This method is part of the Create minigame
     * - Request Type - POST
     * - Access - Admin
     * - End Point - API_URL/minigame
     *
     * @requires - authentication
     * @param requestBody - {
     *               "id": "boss-1",
     *               "name": "Bob",
     *               "giver": "gy-gyc-goblin-1",
     *               "description": "I give quests and sell wares.",
     *               "prerequisites":
     *                   "minLevel": 1,
     *                   "maxLevel": 3,
     *                   "maxActive": 1,
     *                   "expireAfter": 500000,
     *                   "maxSimultaneous": 5
     *               },
     *               "attributes": {
     *                   "enemyId": "gy-gyc-goblin-1",
     *                   "enemyHitpoints": "500",
     *                   "enemyPhysicalDamageLevel": 10,
     *                   "enemyPhysicalDefenceLevel": 10
     *               }
     *           }
     * @returns - {
     *              status: 'success',
     *              data:{
     *               "id": "boss-1",
     *               "name": "Bob",
     *               "giver": "gy-gyc-goblin-1",
     *               "description": "I give quests and sell wares.",
     *               "prerequisites":
     *                   "minLevel": 1,
     *                   "maxLevel": 3,
     *                   "maxActive": 1,
     *                   "expireAfter": 500000,
     *                   "maxSimultaneous": 5
     *               },
     *               "attributes": {
     *                   "enemyId": "gy-gyc-goblin-1",
     *                   "enemyHitpoints": "500",
     *                   "enemyPhysicalDamageLevel": 10,
     *                   "enemyPhysicalDefenceLevel": 10
     *               }
     *           } or  { status: 'failure', message: 'message'}
     *
     */
    async create(data: any): Promise<any> {
        const miniGameList = await this.findDataToArray(
            config.dbCollections.minigame,
            {
                query: { $limit: 1, id: data.id },
            }
        );

        if (miniGameList.length > 0) {
            throw new BadRequest(
                messages.common_messages_minigame_id_already_exist
            );
        }

        data.createdAt = getUtcDate();
        data.updatedAt = getUtcDate();

        const result = await this.createData(
            config.dbCollections.minigame,
            data
        );
        return Promise.resolve(buildSimpleResponse(buildMiniGameInfo(result)));
    }

    /**
     * Edit minigame
     *
     * @remarks
     * This method is part of the edit minigame
     * - Request Type - PATCH
     * - Access - Admin
     * - End Point - API_URL/minigame/{:minigamId}
     *
     * @requires - authentication
     * @requires @param minigameId - pass minigameId as a url param
     * @param requestBody - {
     *               "id": "boss-1",
     *               "name": "Bob",
     *               "giver": "gy-gyc-goblin-1",
     *               "description": "I give quests and sell wares.",
     *               "prerequisites":
     *                   "minLevel": 1,
     *                   "maxLevel": 3,
     *                   "maxActive": 1,
     *                   "expireAfter": 500000,
     *                   "maxSimultaneous": 5
     *               },
     *               "attributes": {
     *                   "enemyId": "gy-gyc-goblin-1",
     *                   "enemyHitpoints": "500",
     *                   "enemyPhysicalDamageLevel": 10,
     *                   "enemyPhysicalDefenceLevel": 10
     *               },
     *              "rewards":{
     *                  "items":[
     *                        {
     *                          "id":"item-1",
     *                          "quantity":1
     *                     }
     *                 ],
     *                 "xp":100,
     *              }
     *           }
     * @returns - {
     *              status: 'success',
     *              data:{
     *               "id": "boss-1",
     *               "name": "Bob",
     *               "giver": "gy-gyc-goblin-1",
     *               "description": "I give quests and sell wares.",
     *               "prerequisites":
     *                   "minLevel": 1,
     *                   "maxLevel": 3,
     *                   "maxActive": 1,
     *                   "expireAfter": 500000,
     *                   "maxSimultaneous": 5
     *               },
     *               "attributes": {
     *                   "enemyId": "gy-gyc-goblin-1",
     *                   "enemyHitpoints": "500",
     *                   "enemyPhysicalDamageLevel": 10,
     *                   "enemyPhysicalDefenceLevel": 10
     *               },
     *               "rewards":{
     *                  "items":[
     *                        {
     *                          "id":"item-1",
     *                          "quantity":1
     *                     }
     *                 ],
     *                 "xp":100,
     *              }
     *           } or  { status: 'failure', message: 'message'}
     *
     */
    async patch(id: NullableId, data: any): Promise<any> {
        if (id === null) {
            throw new BadRequest(messages.common_messages_id_missing);
        }
        try {
            data.updatedAt = getUtcDate();
            const result = await this.patchData(
                config.dbCollections.minigame,
                id,
                data
            );
            return Promise.resolve(
                buildSimpleResponse(buildMiniGameInfo(result))
            );
        } catch (e) {
            throw new BadRequest(messages.commmon_messages_minigame_not_found);
        }
    }

    /**
     * Get minigame
     *
     * @remarks
     * This method is part of the get minigame
     * - Request Type - GET
     * - Access - Admin
     * - End Point - API_URL/minigame/{:minigameId}
     *
     * @requires - authentication
     * @requires @param minigameId - pass minigameId as a url param
     * @returns - {
     *              status: 'success',
     *              data:{
     *               "id": "boss-1",
     *               "name": "Bob",
     *               "giver": "gy-gyc-goblin-1",
     *               "description": "I give quests and sell wares.",
     *               "prerequisites":
     *                   "minLevel": 1,
     *                   "maxLevel": 3,
     *                   "maxActive": 1,
     *                   "expireAfter": 500000,
     *                   "maxSimultaneous": 5
     *               },
     *               "attributes": {
     *                   "enemyId": "gy-gyc-goblin-1",
     *                   "enemyHitpoints": "500",
     *                   "enemyPhysicalDamageLevel": 10,
     *                   "enemyPhysicalDefenceLevel": 10
     *               }
     *               "rewards":{
     *                  "items":[
     *                        {
     *                          "id":"item-1",
     *                          "quantity":1
     *                     }
     *                 ],
     *                 "xp":100,
     *              }
     *           } or  { status: 'failure', message: 'message'}
     */

    async get(id: Id): Promise<any> {
        try {
            const result = await this.getData(
                config.dbCollections.minigame,
                id
            );
            return Promise.resolve(
                buildSimpleResponse(buildMiniGameInfo(result))
            );
        } catch (e) {
            throw new BadRequest(messages.commmon_messages_minigame_not_found);
        }
    }

    /**
     * Returns the minigame list
     *
     * @remarks
     * This method is part of the get list of minigame
     * - Request Type - GET
     * - Access - Admin
     * - End Point - API_URL/minigame?per_page=10&page=1
     *
     * @param per_page - page size
     * @param page - page number
     * @returns - Paginated minigame item list { data:[{...},{...}],current_page:1,per_page:10,total_pages:1,total_entries:5}
     *
     */
    async find(params?: Params): Promise<any> {
        const perPage = parseInt(params?.query?.per_page) || 10;
        const page = parseInt(params?.query?.page) || 1;
        const skip = (page - 1) * perPage;
        const minigameData = await this.findData(
            config.dbCollections.minigame,
            {
                query: {
                    $skip: skip,
                    $limit: perPage,
                },
            }
        );
        const responseData: Array<any> = [];

        (minigameData.data as Array<any>)?.forEach(async (item) => {
            responseData.push(buildMiniGameInfo(item));
        });
        return Promise.resolve(
            buildPaginationResponse(
                responseData,
                page,
                perPage,
                Math.ceil(minigameData.total / perPage),
                minigameData.total
            )
        );
    }
}

