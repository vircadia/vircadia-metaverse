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

import { messages } from '../../../utils/messages';
import { Id, NullableId, Params } from '@feathersjs/feathers';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../../declarations';
import { QuestItemInterface } from '../../../common/interfaces/QuestItemInterface';
import { getUtcDate } from '../../../utils/Utils';
import config from '../../../appconfig';
import { buildQuestItemInfo } from '../../../common/responsebuilder/questItemBuilder';
import { BadRequest } from '@feathersjs/errors';
import {
    buildSimpleResponse,
    buildPaginationResponse,
} from '../../../common/responsebuilder/responseBuilder';

/**
 * Quest Item.
 * @noInheritDoc
 */
export class QuestItem extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Create Quest Item
     *
     * @remarks
     * This method is part of the Create Quest Item
     * - Request Type - POST
     * - Access - Admin
     * - End Point - API_URL/quest-item
     *
     * @requires - authentication
     * @param requestBody - {
     *                   "id": "gy-gyc-bob-shop-fetch-sticks",
     *                   "name": "A sticky situation.",
     *                   "giver": "gy-gyc-bob-shop",
     *                   "description":"A sticky situation.",
     *                   "dialogue": {
     *                       "0": [
     *                           [
     *                               "player",
     *                               "Hello!"
     *                           ],
     *                           [
     *                               "npc",
     *                               "Oh no... This isn't good."
     *                           ],
     *                           [
     *                               "player",
     *                               "What's the matter?"
     *                           ],
     *                           [
     *                               "npc",
     *                               "I can't find my bundle of sticks that I was going to use to make an elixir."
     *                           ],
     *                           [
     *                               "player",
     *                               "Oh, I'm sorry to hear that."
     *                           ],
     *                           [
     *                               "npc",
     *                               "Can you perhaps help me?"
     *                           ],
     *                           [
     *                               "prompt",
     *                               "Sure.",
     *                               "1",
     *                               "I'd rather not.",
     *                               "2"
     *                           ]
     *                       ],
     *                       "1": [
     *                           [
     *                               "quest",
     *                               "accept"
     *                           ],
     *                           [
     *                               "npc",
     *                               "Awesome, fetch me 5 branches and I will reward you handsomely."
     *                           ],
     *                           [
     *                               "player",
     *                               "Okay."
     *                           ]
     *                       ],
     *                       "2": [
     *                           [
     *                               "quest",
     *                               "deny"
     *                           ],
     *                           [
     *                               "npc",
     *                               "Oh well... *sigh*"
     *                           ]
     *                       ]
     *                   },
     *                   "itemRequirements": {
     *                       "items": [
     *                           {
     *                               "itemId": "regular-stick",
     *                               "qty": 5
     *                           }
     *                       ]
     *                   },
     *                   "npcRequirements": {},
     *                   "miniGameRequirements": {},
     *                   "rewards": [
     *                       {
     *                           "itemId": "basic-elixir-of-health",
     *                           "qty": 1
     *                       },
     *                       {
     *                           "xp": 500
     *                       },
     *                       {
     *                           "goo": 5
     *                       }
     *                   ],
     *                   "prerequisites": {
     *                       "minLevel": 1,
     *                       "maxLevel": 3,
     *                       "maxActive": 1,
     *                       "expireAfter": 500000,
     *                       "maxSimultaneous": 5
     *                   }
     *               }
     * @returns - {
     *              status: 'success',
     *              data:{
     *                  "id": "gy-gyc-bob-shop-fetch-sticks",
     *                   "name": "A sticky situation.",
     *                   "giver": "gy-gyc-bob-shop",
     *                   "description":"A sticky situation.",
     *                   "dialogue": {
     *                       "0": [
     *                           [
     *                               "player",
     *                               "Hello!"
     *                           ],
     *                           [
     *                               "npc",
     *                               "Oh no... This isn't good."
     *                           ],
     *                           [
     *                               "player",
     *                               "What's the matter?"
     *                           ],
     *                           [
     *                               "npc",
     *                               "I can't find my bundle of sticks that I was going to use to make an elixir."
     *                           ],
     *                           [
     *                               "player",
     *                               "Oh, I'm sorry to hear that."
     *                           ],
     *                           [
     *                               "npc",
     *                               "Can you perhaps help me?"
     *                           ],
     *                           [
     *                               "prompt",
     *                               "Sure.",
     *                               "1",
     *                               "I'd rather not.",
     *                               "2"
     *                           ]
     *                       ],
     *                       "1": [
     *                           [
     *                               "quest",
     *                               "accept"
     *                           ],
     *                           [
     *                               "npc",
     *                               "Awesome, fetch me 5 branches and I will reward you handsomely."
     *                           ],
     *                           [
     *                               "player",
     *                               "Okay."
     *                           ]
     *                       ],
     *                       "2": [
     *                           [
     *                               "quest",
     *                               "deny"
     *                           ],
     *                           [
     *                               "npc",
     *                               "Oh well... *sigh*"
     *                           ]
     *                       ]
     *                   },
     *                   "itemRequirements": {
     *                       "items": [
     *                           {
     *                               "itemId": "regular-stick",
     *                               "qty": 5
     *                           }
     *                       ]
     *                   },
     *                   "npcRequirements": {},
     *                   "miniGameRequirements": {},
     *                   "rewards": [
     *                       {
     *                           "itemId": "basic-elixir-of-health",
     *                           "qty": 1
     *                       },
     *                       {
     *                           "xp": 500
     *                       },
     *                       {
     *                           "goo": 5
     *                       }
     *                   ],
     *                   "prerequisites": {
     *                       "minLevel": 1,
     *                       "maxLevel": 3,
     *                       "maxActive": 1,
     *                       "expireAfter": 500000,
     *                       "maxSimultaneous": 5
     *                   }
     *               }  or  { status: 'failure', message: 'message'}
     *
     */
    async create(data: any): Promise<any> {
        const questItemList = await this.findDataToArray(
            config.dbCollections.questItem,
            { query: { $limit: 1, id: data.id } }
        );

        if (questItemList.length > 0) {
            throw new BadRequest(
                messages.common_messages_quest_id_already_exist
            );
        }

        data.createdAt = getUtcDate();
        data.updatedAt = getUtcDate();
        const result = await this.createData(
            config.dbCollections.questItem,
            data
        );
        return Promise.resolve(buildSimpleResponse(buildQuestItemInfo(result)));
    }

    /**
     * Edit Quest Item
     *
     * @remarks
     * This method is part of the edit Quest Item
     * - Request Type - PATCH
     * - Access - Admin
     * - End Point - API_URL/quest-item/{:questId}
     *
     * @requires - authentication
     * @requires @param questId - pass questId as a url param
     * @param requestBody - {
     *                   "name": "A sticky situation.",
     *                   "giver": "gy-gyc-bob-shop",
     *                   "description":"A sticky situation.",
     *                   "dialogue": {
     *                       "0": [
     *                           [
     *                               "player",
     *                               "Hello!"
     *                           ],
     *                           [
     *                               "npc",
     *                               "Oh no... This isn't good."
     *                           ],
     *                           [
     *                               "player",
     *                               "What's the matter?"
     *                           ],
     *                           [
     *                               "npc",
     *                               "I can't find my bundle of sticks that I was going to use to make an elixir."
     *                           ],
     *                           [
     *                               "player",
     *                               "Oh, I'm sorry to hear that."
     *                           ],
     *                           [
     *                               "npc",
     *                               "Can you perhaps help me?"
     *                           ],
     *                           [
     *                               "prompt",
     *                               "Sure.",
     *                               "1",
     *                               "I'd rather not.",
     *                               "2"
     *                           ]
     *                       ],
     *                       "1": [
     *                           [
     *                               "quest",
     *                               "accept"
     *                           ],
     *                           [
     *                               "npc",
     *                               "Awesome, fetch me 5 branches and I will reward you handsomely."
     *                           ],
     *                           [
     *                               "player",
     *                               "Okay."
     *                           ]
     *                       ],
     *                       "2": [
     *                           [
     *                               "quest",
     *                               "deny"
     *                           ],
     *                           [
     *                               "npc",
     *                               "Oh well... *sigh*"
     *                           ]
     *                       ]
     *                   },
     *                   "itemRequirements": {
     *                       "items": [
     *                           {
     *                               "itemId": "regular-stick",
     *                               "qty": 5
     *                           }
     *                       ]
     *                   },
     *                   "npcRequirements": {},
     *                   "miniGameRequirements": {},
     *                   "rewards": [
     *                       {
     *                           "itemId": "basic-elixir-of-health",
     *                           "qty": 1
     *                       },
     *                       {
     *                           "xp": 500
     *                       },
     *                       {
     *                           "goo": 5
     *                       }
     *                   ],
     *                   "prerequisites": {
     *                       "minLevel": 1,
     *                       "maxLevel": 3,
     *                       "maxActive": 1,
     *                       "expireAfter": 500000,
     *                       "maxSimultaneous": 5
     *                   }
     *               }
     * @returns - {
     *              status: 'success',
     *              data:{
     *                   "id": "gy-gyc-bob-shop-fetch-sticks",
     *                   "name": "A sticky situation.",
     *                   "giver": "gy-gyc-bob-shop",
     *                   "description":"A sticky situation.",
     *                   "dialogue": {
     *                       "0": [
     *                           [
     *                               "player",
     *                               "Hello!"
     *                           ],
     *                           [
     *                               "npc",
     *                               "Oh no... This isn't good."
     *                           ],
     *                           [
     *                               "player",
     *                               "What's the matter?"
     *                           ],
     *                           [
     *                               "npc",
     *                               "I can't find my bundle of sticks that I was going to use to make an elixir."
     *                           ],
     *                           [
     *                               "player",
     *                               "Oh, I'm sorry to hear that."
     *                           ],
     *                           [
     *                               "npc",
     *                               "Can you perhaps help me?"
     *                           ],
     *                           [
     *                               "prompt",
     *                               "Sure.",
     *                               "1",
     *                               "I'd rather not.",
     *                               "2"
     *                           ]
     *                       ],
     *                       "1": [
     *                           [
     *                               "quest",
     *                               "accept"
     *                           ],
     *                           [
     *                               "npc",
     *                               "Awesome, fetch me 5 branches and I will reward you handsomely."
     *                           ],
     *                           [
     *                               "player",
     *                               "Okay."
     *                           ]
     *                       ],
     *                       "2": [
     *                           [
     *                               "quest",
     *                               "deny"
     *                           ],
     *                           [
     *                               "npc",
     *                               "Oh well... *sigh*"
     *                           ]
     *                       ]
     *                   },
     *                   "itemRequirements": {
     *                       "items": [
     *                           {
     *                               "itemId": "regular-stick",
     *                               "qty": 5
     *                           }
     *                       ]
     *                   },
     *                   "npcRequirements": {},
     *                   "miniGameRequirements": {},
     *                   "rewards": [
     *                       {
     *                           "itemId": "basic-elixir-of-health",
     *                           "qty": 1
     *                       },
     *                       {
     *                           "xp": 500
     *                       },
     *                       {
     *                           "goo": 5
     *                       }
     *                   ],
     *                   "prerequisites": {
     *                       "minLevel": 1,
     *                       "maxLevel": 3,
     *                       "maxActive": 1,
     *                       "expireAfter": 500000,
     *                       "maxSimultaneous": 5
     *                   }
     *               }  or  { status: 'failure', message: 'message'}
     *
     */
    async patch(id: NullableId, data: any): Promise<any> {
        try {
            data.updatedAt = getUtcDate();
            const result = await this.patchData(
                config.dbCollections.questItem,
                id || '',
                data
            );
            return Promise.resolve(
                buildSimpleResponse(buildQuestItemInfo(result))
            );
        } catch (e) {
            throw new BadRequest(messages.common_messages_quest_item_not_found);
        }
    }

    /**
     * Get Quest Item
     *
     * @remarks
     * This method is part of the get Quest Item
     * - Request Type - GET
     * - End Point - API_URL/quest-item/{:questId}
     *
     * @requires - authentication
     * @requires @param questId - pass questId as a url param
     * @returns - { status: 'success', data:{...}  or  { status: 'failure', message: 'message'}
     *
     */
    async get(id: Id): Promise<any> {
        try {
            const result = await this.getData(
                config.dbCollections.questItem,
                id
            );
            return Promise.resolve(
                buildSimpleResponse(buildQuestItemInfo(result))
            );
        } catch (e) {
            throw new BadRequest(messages.common_messages_quest_item_not_found);
        }
    }

    /**
     * Returns the Quest Items
     *
     * @remarks
     * This method is part of the get list of Quest items
     * - Request Type - GET
     * - Access - Admin
     * - End Point - API_URL/quest-item?per_page=10&page=1
     *
     * @param per_page - page size
     * @param page - page number
     * @returns - Paginated Quest item list { data:[{...},{...}],current_page:1,per_page:10,total_pages:1,total_entries:5}
     *
     */
    async find(params?: Params): Promise<any> {
        const perPage = parseInt(params?.query?.per_page) || 10;
        const page = parseInt(params?.query?.page) || 1;
        const skip = (page - 1) * perPage;
        const questItemData = await this.findData(
            config.dbCollections.questItem,
            {
                query: {
                    $skip: skip,
                    $limit: perPage,
                },
            }
        );
        const responseData: Array<any> = [];

        (questItemData.data as Array<QuestItemInterface>)?.forEach(
            async (item) => {
                responseData.push(buildQuestItemInfo(item));
            }
        );
        return Promise.resolve(
            buildPaginationResponse(
                responseData,
                page,
                perPage,
                Math.ceil(questItemData.total / perPage),
                questItemData.total
            )
        );
    }
}
