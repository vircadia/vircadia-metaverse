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

'use strict';

import { GenUUID } from '../../utils/Misc';
import { DatabaseServiceOptions } from './../../common/dbservice/DatabaseServiceOptions';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { Application } from '../../declarations';
import { Params, NullableId } from '@feathersjs/feathers';
import config from '../../appconfig';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';
import { messages } from '../../utils/messages';
import { buildInventoryItemInfo } from '../../common/responsebuilder/inventoryBuilder';
import { getUtcDate, isValidArray, isValidObject } from '../../utils/Utils';
import { NotFound, BadRequest } from '@feathersjs/errors';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import { RewardInterface } from '../../common/interfaces/RewardInterface';
import { shuffle } from 'lodash';
import { ItemSource } from '../../utils/InventoryUtils';
import moment from 'moment';

/**
 * Reward Item.
 * @noInheritDoc
 */
export class RewardItem extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    async updateArrayValues(arr: any[] = [], obj: any) {
        return await new Promise((resolve) => {
            const updatedArr: any[] = arr.map((val: any, index) => {
                return { ...val, ...obj, day: index + 1 };
            });

            return resolve([...updatedArr]);
        });
    }

    /**
     * Returns the Reward Items
     *
     * @remarks
     * This method is part of the get list of reward items
     * - Request Type - GET
     * - End Point - API_URL/reward-item
     *
     * @returns - Paginated reward item list { data:[{...},{...}], success:"true" }
     *
     */
    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);

        if (isValidObject(loginUser)) {
            const { id } = loginUser;

            const rewardItems = await this.findData(
                config.dbCollections.rewardItems,
                {
                    query: {
                        userId: id,
                        $limit: 30,
                    },
                }
            );

            // find every inventory items.
            const inventoryItemsResult = await this.findData(
                config.dbCollections.inventoryItem,
                {
                    query: {
                        $limit: 30,
                    },
                }
            );

            const { data: inventoriesData = [] } = inventoryItemsResult;
            if (!isValidArray(inventoriesData))
                throw new NotFound(
                    messages.common_messages_record_not_available
                );

            const { data: rewardData = [] } = rewardItems;

            // check if all rewards are not got by user
            const isAllClaimedRewards: any[] = rewardData.filter(
                (val: RewardInterface) => !!!val.isClaimed
            );

            // reward already has then send back
            if (isValidArray(isAllClaimedRewards) && isValidArray(rewardData)) {
                const finalRewardResult: any[] = [];

                for (let i = 0; i < rewardData.length; i++) {
                    const {
                        inventoryItemId,
                        id: rewardId,
                        createdAt,
                        updatedAt,
                        isClaimed,
                        userId,
                        day,
                    } = rewardData[i];
                    for (let j = 0; j < inventoriesData.length; j++) {
                        const { id, thumbnail, url, description, name } =
                            inventoriesData[j];

                        if (id === inventoryItemId) {
                            finalRewardResult.push({
                                id: rewardId,
                                createdAt,
                                updatedAt,
                                isClaimed,
                                userId,
                                day,
                                inventoryItemId,
                                item: {
                                    thumbnail,
                                    url,
                                    description,
                                    name,
                                },
                            } as RewardInterface);
                        }
                    }
                }

                return Promise.resolve(
                    buildSimpleResponse(
                        buildInventoryItemInfo(finalRewardResult as any)
                    )
                );
            }

            // remove old reward if it has stored in table
            await this.deleteMultipleData(config.dbCollections.rewardItems, {
                query: { userId: id },
            });

            const latestRewards: any[] = [];

            for (let i = 0; i < inventoriesData.length; i++) {
                const { id, thumbnail, url, description, name } =
                    inventoriesData[i];
                const genUUID = GenUUID();

                latestRewards.push({
                    id: genUUID,
                    inventoryItemId: id,
                    item: { thumbnail, url, description, name },
                    createdAt: getUtcDate(),
                } as RewardInterface);
            }

            // if rewards not full filled with 30 then store duplicates
            let updatedArray: any = latestRewards.slice(0, 30);

            if (updatedArray.length < 30) {
                const recursion = () => {
                    for (
                        let index = 0;
                        index < inventoriesData.length;
                        index++
                    ) {
                        if (updatedArray.length === 30) break;
                        const { id, thumbnail, url, description, name } =
                            inventoriesData[index];

                        updatedArray.push({
                            id: GenUUID(),
                            inventoryItemId: id,
                            item: { thumbnail, url, description, name },
                            createdAt: getUtcDate(),
                        } as RewardInterface);
                    }

                    if (updatedArray.length < 30) recursion();

                    return;
                };

                recursion();
            } else if (updatedArray.length > 30) {
                updatedArray = updatedArray.slice(0, 30);
            }

            // rearrange and update with days and other keys the array for random reward item
            const result: any = await this.updateArrayValues(
                shuffle(updatedArray),
                {
                    isClaimed: false,
                    userId: id,
                }
            );

            // remove item object for add in reward table
            const updateResult = [...result].map((res: any) => {
                const copyRes = { ...res };
                delete copyRes['item'];
                return copyRes;
            });

            const res = await this.createMultipleData(
                config.dbCollections.rewardItems,
                updateResult
            );

            if (isValidArray(res)) {
                return Promise.resolve(
                    buildSimpleResponse(buildInventoryItemInfo(result))
                );
            }
        }

        throw new NotFound(messages.common_messages_id_missing);
    }

    /**
     * Edit Reward Item
     *
     * @remarks
     * This method is part of the edit Reward Item
     * - Request Type - PATCH
     * - End Point - API_URL/reward-item/{RewardItemId}
     *
     * @requires - authentication
     *
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async patch(id: NullableId, data: any, params: Params): Promise<any> {
        if (id) {
            const loginUser = extractLoggedInUserFromParams(params);
            let rewardItem: any = {};

            if (isValidObject(loginUser)) {
                const { id: userId } = loginUser; // user id

                // check today user has already claimed reward or not

                const rewardCount = await this.findData(
                    config.dbCollections.rewardItems,
                    { query: { userId: userId } }
                );

                const rewardList: any[] = await this.findDataToArray(
                    config.dbCollections.rewardItems,
                    {
                        query: {
                            userId: userId,
                            $limit: rewardCount.total,
                        },
                    }
                );

                if (!isValidArray(rewardList))
                    throw new NotFound(
                        messages.common_messages_record_not_available
                    );

                let isTodaysClaimed = false;
                for (let index = 0; index < rewardList.length; index++) {
                    const { updatedAt } = rewardList[index];
                    if (updatedAt) {
                        isTodaysClaimed =
                            moment().diff(updatedAt, 'days') === 0;
                        if (isTodaysClaimed) break;
                    }
                }

                if (isTodaysClaimed)
                    throw new BadRequest(
                        messages.common_messages_today_reward_messages_already_claimed
                    );

                // check user exist with current update or not
                const rewardItems: any[] = await this.findDataToArray(
                    config.dbCollections.rewardItems,
                    {
                        query: {
                            id: id,
                            userId: userId,
                        },
                    }
                );

                if (!isValidArray(rewardItems))
                    throw new NotFound(
                        messages.common_messages_user_does_not_exist
                    );

                rewardItem = { ...rewardItems[0] };

                // check user has already claimed current reward or not
                const { isClaimed } = rewardItem;
                if (isClaimed)
                    throw new BadRequest(
                        messages.common_messages_reward_messages_already_claimed
                    );
            }

            if (isValidObject(rewardItem)) {
                const { inventoryItemId, userId } = rewardItem;

                // find inventory item has been stored or not
                const inventoryItemResult: any = await this.findDataToArray(
                    config.dbCollections.inventoryItem,
                    {
                        query: {
                            id: inventoryItemId,
                        },
                    }
                );

                if (!isValidArray(inventoryItemResult as any))
                    throw new NotFound(
                        messages.common_messages_error_inventory_item_not_found
                    );

                // find inventory quantity is in or not
                const inventoryResult: any = await this.findData(
                    config.dbCollections.inventory,
                    {
                        query: {
                            itemId: inventoryItemId,
                            itemSource: ItemSource.DAILY_REWARD,
                            userId: userId,
                        },
                    }
                );

                const { data: inventoryData = [] } = inventoryResult;

                if (isValidArray(inventoryData)) {
                    // update inventory item
                    const { id: inventoryId, qty } = inventoryData[0];

                    const res = await this.patchData(
                        config.dbCollections.inventory,
                        inventoryId,
                        {
                            qty: qty + 1,
                            updatedAt: getUtcDate(),
                        }
                    );

                    if (!isValidObject(res))
                        throw new NotFound(
                            messages.common_messages_data_notfound
                        );
                } else {
                    //add reward in inventory
                    const inventoryBody = {
                        id: GenUUID(),
                        itemId: inventoryItemId,
                        qty: 1,
                        itemSource: ItemSource.DAILY_REWARD,
                        userId: userId,
                        createdAt: getUtcDate(),
                    };

                    const res: any = await this.createData(
                        config.dbCollections.inventory,
                        inventoryBody
                    );

                    if (!isValidObject(res))
                        throw new NotFound(
                            messages.common_messages_data_notfound
                        );
                }

                // after successful of update or delete, update record in reward table
                const data = {
                    isClaimed: true,
                    updatedAt: getUtcDate(),
                };

                // update reward as claimed
                const rewardUpdateResult = await this.patchData(
                    config.dbCollections.rewardItems,
                    id,
                    data
                );

                if (isValidObject(rewardUpdateResult)) {
                    const { thumbnail, url, description, name } =
                        inventoryItemResult[0];

                    rewardUpdateResult['item'] = {
                        thumbnail,
                        url,
                        description,
                        name,
                    };

                    return Promise.resolve(
                        buildSimpleResponse(
                            buildInventoryItemInfo(rewardUpdateResult)
                        )
                    );
                }
                throw new NotFound(messages.common_messages_error);
            }
        }
        throw new BadRequest(messages.common_messages_id_missing);
    }

    async get(id: NullableId): Promise<any> {
        throw new NotFound(messages.common_messages_record_not_available);
    }

    async create(data: any): Promise<any> {
        throw new BadRequest(
            messages.common_messages_reward_item_id_already_exist
        );
    }

    async remove(id: NullableId): Promise<any> {
        throw new BadRequest(messages.common_messages_action_not_allowed);
    }
}

