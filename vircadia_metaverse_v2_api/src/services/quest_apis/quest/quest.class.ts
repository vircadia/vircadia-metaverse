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

import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../../declarations';
import { Id, NullableId, Params } from '@feathersjs/feathers';
import config from '../../../appconfig';
import { BadRequest, NotFound } from '@feathersjs/errors';
import { messages } from '../../../utils/messages';
import { buildSimpleResponse } from '../../../common/responsebuilder/responseBuilder';
import { buildQuestInfo } from '../../../common/responsebuilder/questBuilder';
import { GenUUID, IsNotNullOrEmpty, IsNullOrEmpty } from '../../../utils/Misc';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
import { getGameUserLevel, getUtcDate } from '../../../utils/Utils';
import { QuestInterface } from '../../../common/interfaces/QuestInterface';
import { ItemSource } from '../../../utils/InventoryUtils';
import { AccountInterface } from './../../../common/interfaces/AccountInterface';
import { UserInventoryInterface } from './../../../common/interfaces/Inventoryinterface';
import {
    QuestItemInterface,
    RewardItemInterface,
    XpRewardInterface,
    // GooRewardInterface,
} from './../../../common/interfaces/QuestItemInterface';

/**
 * Quest.
 * @noInheritDoc
 */
export class Quest extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Create the Quest
     *
     * @remarks
     * This method is part of creat Quest
     * - Request Type - POST
     * - Access - Internal only
     * - End Point - API_URL/quest
     *
     * @param body - { questId: '', ownerId:'', expiresOn: Date, isAccepted: false, isUnique: false, npcRequirements: [{"id":"8440b2b8-d512-4ecb-bfb7-b15b327057b1","quantity":2}], itemRequirements: [{"id":"8440b2b8-d512-4ecb-bfb7-b15b327057b2","quantity":2}], miniGameRequirements: [{"id":"8440b2b8-d512-4ecb-bfb7-b15b327057b3","quantity":2}], isCompleted: false, isActive: true }
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async create(data: any): Promise<any> {
        data.id = GenUUID();
        data.createdAt = getUtcDate();
        try {
            if (
                IsNullOrEmpty(
                    await super.getData(
                        config.dbCollections.questItem,
                        data.questId
                    )
                )
            ) {
                throw new BadRequest(
                    messages.common_messages_quest_item_not_found
                );
            }
        } catch (e) {
            throw new BadRequest(messages.common_messages_quest_item_not_found);
        }
        const result = await this.createData(config.dbCollections.quest, data);
        return Promise.resolve(buildSimpleResponse(buildQuestInfo(result)));
    }

    /**
     * Patch the Quest
     *
     * @remarks
     * This method is part of patch Quest
     * - Request Type - PATCH
     * - Access - Internal only
     * - End Point - API_URL/quest/{:questId}
     *
     * @param body - { expiresOn: Date, isAccepted: false, isUnique: false, npcRequirements: [{"id":"8440b2b8-d512-4ecb-bfb7-b15b327057b1","quantity":3}], itemRequirements: [{"id":"8440b2b8-d512-4ecb-bfb7-b15b327057b2","quantity":4}], miniGameRequirements: [{"id":"8440b2b8-d512-4ecb-bfb7-b15b327057b3","quantity":6}], isCompleted: false, isActive: true }
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async patch(id: NullableId, data: Partial<any>): Promise<any> {
        if (id === null) {
            throw new BadRequest(messages.common_messages_id_missing);
        }
        const result = await this.patchData(
            config.dbCollections.quest,
            id,
            data
        );
        return Promise.resolve(buildSimpleResponse(buildQuestInfo(result)));
    }

    /**
     * Get the Quest
     *
     * @remarks
     * This method is part of get Quest
     * - Request Type - GET
     * - Access - Owner only
     * - End Point - API_URL/quest/{:questId}
     *
     * @required @param questId: url param
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async get(id: Id, params?: Params): Promise<any> {
        const status = params?.query?.status;
        const loginUser = extractLoggedInUserFromParams(params);
        await this.removeExpiredQuest();

        let result = await this.getData(config.dbCollections.quest, id);
        if (IsNotNullOrEmpty(result) && result.ownerId === loginUser.id) {
            if (IsNotNullOrEmpty(status)) {
                if (status === 'accept') {
                    result = await this.acceptQuest(id);
                } else if (status === 'abandon') {
                    result = await this.abandonQuest(id);
                } else if (status === 'complete') {
                    result = await this.completeQuest(id, result);
                    if (result.hasOwnProperty('message')) {
                        return result;
                    }
                }
            }
            return Promise.resolve(buildSimpleResponse(buildQuestInfo(result)));
        } else {
            throw new NotFound(messages.common_messages_data_notfound);
        }
    }

    /**
     * Get the Quest
     *
     * @remarks
     * This method is part of get Quests
     * - Request Type - GET
     * - Access - Owner only
     * - End Point - API_URL/item-handler?ownerId=351b9b2a-1b87-4475-8b60-15945b46e443&questIds[]=1&questIds[]=2
     *
     * @required @param ownerId: url param
     * @param questIds: url param
     * @returns - { "status":"success", "data":[{...},{...}]}
     *
     */

    async find(params?: Params): Promise<any> {
        await this.removeExpiredQuest();
        if (params?.query?.ownerId === undefined) {
            throw new BadRequest(messages.common_messages_owner_id_missing);
        }
        const condition: any = {
            ownerId: params?.query?.ownerId,
            isCompleted: false,
        };
        if (IsNotNullOrEmpty(params?.query?.questIds)) {
            condition.questId = { $in: params?.query?.questIds };
        }

        let result = await this.findDataToArray(config.dbCollections.quest, {
            query: { ...condition },
        });

        if (result.length === 0 && IsNullOrEmpty(params?.query?.questIds)) {
            const userDetail = await this.getData(
                config.dbCollections.accounts,
                params?.query?.ownerId
            );

            const level = userDetail.level || 1;
            const questItemList: QuestItemInterface[] =
                await this.findDataToArray(config.dbCollections.questItem, {
                    query: {
                        'prerequisites.minLevel': { $lte: level },
                        'prerequisites.maxLevel': { $gte: level },
                    },
                });

            if (questItemList.length > 0) {
                const questItem = questItemList[0];
                const expireOn = getUtcDate();
                expireOn.setMilliseconds(questItem.prerequisites.expireAfter);
                const newQuest = await this.create({
                    questId: questItem.id,
                    ownerId: userDetail.id,
                    expiresOn: expireOn,
                    isAccepted: false,
                    isUnique: false, // for now unique set false, in future we will update it based on condition
                    npcProgress: [],
                    miniGameProgress: [],
                    isCompleted: false,
                    isActive: true,
                });
                result = [newQuest.data];
            }
        }

        const questList: any[] = [];
        result.forEach((item) => {
            questList.push(buildQuestInfo(item));
        });

        return Promise.resolve(buildSimpleResponse(questList));
    }

    /**
     * Remove Expired Quest
     */
    async removeExpiredQuest(): Promise<void> {
        await this.deleteMultipleData(config.dbCollections.quest, {
            query: { expiresOn: { $lt: getUtcDate() }, isUnique: false },
        });
        return Promise.resolve();
    }

    /**
     * Accept the Quest
     *
     * @remarks
     * This method is part of accept Quest
     * - Request Type - GET
     * - Access - Owner only
     * - End Point - API_URL/quest/{:questId}?status=accept
     *
     * @required @param questId: url param
     * @required @param status: url param
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async acceptQuest(id: Id): Promise<any> {
        return this.patchData(config.dbCollections.quest, id, {
            isAccepted: true,
        });
    }

    /**
     * Abandon
     *
     * @remarks
     * This method is part of abandon Quest
     * - Request Type - GET
     * - Access - Owner only
     * - End Point - API_URL/quest/{:questId}?status=abandon
     *
     * @required @param questId: url param
     * @required @param status: url param
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async abandonQuest(id: Id): Promise<any> {
        return this.patchData(config.dbCollections.quest, id, {
            isAccepted: false,
        });
    }

    /**
     * Complete the Quest
     *
     * @remarks
     * This method is part of complere Quest
     * - Request Type - GET
     * - Access - Owner only
     * - End Point - API_URL/quest/{:questId}?status=complete
     *
     * @required @param questId: url param
     * @required @param status: url param
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async completeQuest(id: Id, questData: QuestInterface): Promise<any> {
        if (questData.isCompleted === true) {
            throw new BadRequest(
                messages.common_messages_quest_already_completed
            );
        }

        if (questData.isAccepted) {
            const userInventoryList: UserInventoryInterface[] =
                await this.findDataToArray(config.dbCollections.inventory, {
                    query: { userId: questData.ownerId },
                });
            const questItem: QuestItemInterface = await this.getData(
                config.dbCollections.questItem,
                questData.questId
            );

            //Check quest requirement inventory item qty

            for (const itemRequirement of questItem.itemRequirements.items) {
                if (itemRequirement.itemId) {
                    let isFullFill = false;
                    for (const userInventoryItem of userInventoryList) {
                        if (
                            itemRequirement.itemId ==
                                userInventoryItem.itemId &&
                            userInventoryItem.qty >= itemRequirement.qty
                        ) {
                            isFullFill = true;
                            break;
                        }
                    }
                    if (!isFullFill) {
                        // TODO: As per David's suggestion changed the status code from 400 to 200
                        return {
                            message:
                                messages.common_messages_inventory_requirement_not_fulfill,
                        };
                    }
                }
            }

            for (const itemRequirement of questItem.itemRequirements.items) {
                if (itemRequirement.itemId) {
                    for (const userInventoryItem of userInventoryList) {
                        if (
                            itemRequirement.itemId == userInventoryItem.itemId
                        ) {
                            if (userInventoryItem.qty > itemRequirement.qty) {
                                const qty =
                                    userInventoryItem.qty - itemRequirement.qty;
                                await this.patchData(
                                    config.dbCollections.inventory,
                                    userInventoryItem.id,
                                    { qty: qty, updatedAt: getUtcDate() }
                                );
                            } else {
                                await this.deleteData(
                                    config.dbCollections.inventory,
                                    userInventoryItem.id
                                );
                            }
                        }
                    }
                }
            }

            const userInfo: AccountInterface = await this.getData(
                config.dbCollections.accounts,
                questData.ownerId
            );

            // let goo = userInfo.goo ? userInfo.goo : 0;
            let xp = userInfo.xp ? userInfo.xp : 0;

            for (const rewardItem of questItem.rewards) {
                if (this.isRewardItemInterface(rewardItem)) {
                    let isItemExist = false;

                    for (const userInventoryItem of userInventoryList) {
                        if (userInventoryItem.itemId === rewardItem.itemId) {
                            isItemExist = true;
                            const qty = userInventoryItem.qty + rewardItem.qty;
                            await this.patchData(
                                config.dbCollections.inventory,
                                userInventoryItem.id,
                                { qty: qty, updatedAt: getUtcDate() }
                            );
                            break;
                        }
                    }

                    if (!isItemExist) {
                        await this.app?.service('user-inventory').create({
                            itemId: rewardItem.itemId,
                            toUserId: userInfo.id,
                            qty: rewardItem.qty,
                            itemSource: ItemSource.REWARDED_FOR_QUEST,
                        });
                    }
                }
                // else if (this.isGooRewardInterface(rewardItem)) {
                //     goo += rewardItem.goo;
                // }
                else if (this.isXpRewardInterface(rewardItem)) {
                    xp += rewardItem.xp;
                }
            }

            const level = getGameUserLevel(xp);
            await this.patchData(config.dbCollections.accounts, userInfo.id, {
                // goo,
                xp,
                level,
            });
        } else {
            // TODO: As per David's suggestion changed the status code from 400 to 200
            return { message: messages.common_messages_quest_not_accepted };
        }
        return await this.patchData(config.dbCollections.quest, id, {
            isCompleted: true,
        });
    }

    isRewardItemInterface(item: any): item is RewardItemInterface {
        return (item as RewardItemInterface).itemId !== undefined;
    }

    // isGooRewardInterface(item: any): item is GooRewardInterface {
    //     return (item as GooRewardInterface).goo !== undefined;
    // }

    isXpRewardInterface(item: any): item is XpRewardInterface {
        return (item as XpRewardInterface).xp !== undefined;
    }
}

