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

import { Id, NullableId, Params } from '@feathersjs/feathers';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../../declarations';
import {
    buildPaginationResponse,
    buildSimpleResponse,
} from '../../../common/responsebuilder/responseBuilder';
import config from '../../../appconfig';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
import {
    UserInventoryInterface,
    InventoryItemInterface,
} from '../../../common/interfaces/Inventoryinterface';
import { buildInventoryInfo } from '../../../common/responsebuilder/inventoryBuilder';
import { getUtcDate, isAdmin } from '../../../utils/Utils';
import { IsNotNullOrEmpty, GenUUID, IsNullOrEmpty } from '../../../utils/Misc';
import { BadRequest, NotAuthenticated, NotFound } from '@feathersjs/errors';
import { messages } from '../../../utils/messages';

/**
 * UserInventory.
 * @noInheritDoc
 */
export class UserInventory extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Returns the User Inventory
     *
     * @remarks
     * This method is part of the get list of user inventory
     * - Request Type - GET
     * - End Point - API_URL/user-inventory/${userInventoryItemId}
     *
     * @param userInventoryItemId - url param
     * @returns -  { "result":"success", "data":{...}}
     *
     */
    async get(id: Id, params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (IsNotNullOrEmpty(loginUser)) {
            const userInventoryItem = await this.getData(
                config.dbCollections.inventory,
                id
            );
            if (
                IsNotNullOrEmpty(userInventoryItem) &&
                userInventoryItem.userId === loginUser.id
            ) {
                const inventoryItem = await this.getData(
                    config.dbCollections.inventoryItem,
                    userInventoryItem.itemId
                );
                return Promise.resolve(
                    buildSimpleResponse(
                        buildInventoryInfo(userInventoryItem, inventoryItem)
                    )
                );
            } else {
                throw new NotFound(
                    messages.common_messages_target_item_notfound
                );
            }
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }

    /**
     * Returns the User Inventory
     *
     * @remarks
     * This method is part of the get list of user inventory
     * - Request Type - GET
     * - End Point - API_URL/user-inventory?per_page=10&page=1
     *
     * @param per_page - page size
     * @param page - page number
     * @returns - Paginated inventory item list { data:[{...},{...}],current_page:1,per_page:10,total_pages:1,total_entries:5}
     *
     */
    async find(params?: Params): Promise<any> {
        const perPage = parseInt(params?.query?.per_page) || 10;
        const page = parseInt(params?.query?.page) || 1;
        const skip = (page - 1) * perPage;
        const loginUser = extractLoggedInUserFromParams(params);
        const paginate = params?.query?.paginate;
        const filterquery = {} as any;

        const inventoryCountData = await this.findData(
            config.dbCollections.inventory,
            {
                query: {
                    userId: loginUser.id,
                },
            }
        );

        if (paginate) {
            filterquery.$skip = skip;
            filterquery.$limit = perPage;
        } else {
            filterquery.$limit = inventoryCountData.total;
        }

        const inventoryData = await this.findData(
            config.dbCollections.inventory,
            {
                query: {
                    userId: loginUser.id,
                    $sort: {
                        orderNo: 1,
                    },
                    ...filterquery,
                },
            }
        );

        const inventoryItemsIdList = (
            inventoryData.data as UserInventoryInterface[]
        )
            .map((item) => item.itemId)
            .filter(
                (value, index, self) =>
                    self.indexOf(value) === index && value !== undefined
            );

        const inventoryItemsList = await this.findDataToArray(
            config.dbCollections.inventoryItem,
            {
                query: {
                    id: { $in: inventoryItemsIdList },
                    $limit: inventoryCountData.total,
                },
            }
        );
        const inventoryList: any[] = [];

        (inventoryData.data as UserInventoryInterface[]).forEach(
            async (userInventory) => {
                let inventoryItem: InventoryItemInterface | undefined;
                for (const item of inventoryItemsList) {
                    if (item && item.id === userInventory.itemId) {
                        inventoryItem = item;
                        break;
                    }
                }
                inventoryList.push(
                    buildInventoryInfo(userInventory, inventoryItem)
                );
            }
        );
        return Promise.resolve(
            buildPaginationResponse(
                inventoryList,
                page,
                perPage,
                Math.ceil(inventoryData.total / perPage),
                inventoryData.total
            )
        );
    }

    /**
     * Create the User Inventory item
     *
     * @remarks
     * This method is part of creat user inventory item
     * - Request Type - POST
     * - Access - Admin
     * - End Point - API_URL/user-inventory
     *
     * @param body - {"itemId":"", "toUserId":"",qty:10,"itemSource":""}
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async create(data: any): Promise<any> {
        if (IsNotNullOrEmpty(data)) {
            const { itemId, toUserId, qty, itemSource } = data;

            const inventoryItem = await this.getData(
                config.dbCollections.inventoryItem,
                itemId
            );

            const userInventoryItemList = await this.findDataToArray(
                config.dbCollections.inventory,
                { query: { itemId: itemId, userId: toUserId } }
            );

            const totalQty = parseInt(`${qty}`);

            const lastInserted = await this.findDataToArray(
                config.dbCollections.inventory,
                {
                    query: {
                        $sort: {
                            _id: -1,
                        },
                        $limit: 1,
                        userId: toUserId,
                    },
                }
            );
            let order = 1;

            if (IsNotNullOrEmpty(lastInserted)) {
                if (IsNullOrEmpty(lastInserted[0].orderNo)) {
                    await this.patchData(
                        config.dbCollections.inventory,
                        lastInserted[0].id,
                        {
                            orderNo: 0,
                        }
                    );
                } else {
                    order = isNaN(lastInserted[0].orderNo)
                        ? 0
                        : lastInserted[0].orderNo + 1;
                }
            }

            if (IsNotNullOrEmpty(inventoryItem)) {
                if (totalQty > 0) {
                    if (userInventoryItemList.length === 0) {
                        const toUserInventoryItem: UserInventoryInterface = {
                            id: GenUUID(),
                            itemId: inventoryItem.id,
                            qty: qty,
                            itemSource: itemSource.trim(),
                            userId: toUserId,
                            createdAt: getUtcDate(),
                            updatedAt: getUtcDate(),
                            orderNo: order,
                        };
                        const result = await this.createData(
                            config.dbCollections.inventory,
                            toUserInventoryItem
                        );
                        return Promise.resolve(
                            buildSimpleResponse(
                                buildInventoryInfo(result, inventoryItem)
                            )
                        );
                    } else {
                        throw new BadRequest(
                            messages.common_messages_item_already_exist_in_user_inventory
                        );
                    }
                } else {
                    throw new BadRequest(
                        messages.common_messages_transfer_qry_error
                    );
                }
            } else {
                throw new NotFound(
                    messages.common_messages_target_item_notfound
                );
            }
        } else {
            throw new BadRequest(messages.common_messages_badly_formed_data);
        }
    }

    /**
     * Patch the User Inventory item
     *
     * @remarks
     * This method is part of patch user inventory item
     * - Request Type - PATCH
     * - Access - Internal Only
     * - End Point - API_URL/user-inventory/{userInventoryId}
     *
     * @param body - {qty:10}
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async patch(id: NullableId, data: Partial<any>): Promise<any> {
        const { qty } = data;
        if (IsNotNullOrEmpty(id) && id) {
            const inventory = await this.patchData(
                config.dbCollections.inventory,
                id,
                { qty: qty }
            );
            const inventoryItem = await this.getData(
                config.dbCollections.inventoryItem,
                inventory.itemId
            );
            return Promise.resolve(
                buildSimpleResponse(
                    buildInventoryInfo(inventory, inventoryItem)
                )
            );
        } else {
            throw new NotFound(messages.common_messages_target_item_notfound);
        }
    }

    /**
     * Remove the User Inventory item
     *
     * @remarks
     * This method is part of remove user inventory item
     * - Request Type - Delete
     * - End Point - API_URL/user-inventory/{userInventoryId}
     *
     * @param body -
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async remove(id: NullableId, params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);

        if (IsNotNullOrEmpty(id) && id) {
            try {
                let condition: any = {};
                if (!isAdmin(loginUser)) {
                    condition = { query: { userId: loginUser.id } };
                }
                const inventory = await this.deleteData(
                    config.dbCollections.inventory,
                    id,
                    condition
                );
                return Promise.resolve(
                    buildSimpleResponse(buildInventoryInfo(inventory))
                );
            } catch (e) {}
        }
        throw new NotFound(messages.common_messages_target_item_notfound);
    }
}

