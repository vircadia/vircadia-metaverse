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

import { InventoryItemInterface } from './../../common/interfaces/Inventoryinterface';
import { Id, NullableId, Params } from '@feathersjs/feathers';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import { ItemHandlerInterface } from '../../common/interfaces/ItemHandler';
import { GenUUID, IsNotNullOrEmpty } from '../../utils/Misc';
import config from '../../appconfig';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';
import { BadRequest, NotAuthenticated, NotFound } from '@feathersjs/errors';
import { messages } from '../../utils/messages';
import { buildItemHandlerInfo } from '../../common/responsebuilder/ItemHandlerBuilder';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import { getUtcDate, isAdmin } from '../../utils/Utils';

/**
 * ItemHandler.
 * @noInheritDoc
 */
export class ItemHandler extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Create the Item Handler item
     *
     * @remarks
     * This method is part of creat item handler item
     * - Request Type - POST
     * - Access - Internal only
     * - End Point - API_URL/item-handler
     *
     * @param body - {"itemId":"","ownerId":"","addedDate":date,"expiresOn":date,"area":"","qty":10}
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async create(data: any): Promise<any> {
        const { itemId, ownerId, addedDate, expiresOn, area, qty } = data;

        let createDate = getUtcDate();
        let expirationDate = getUtcDate();

        try {
            createDate = new Date(addedDate);
        } catch (e) {}

        try {
            expirationDate = new Date(expiresOn);
        } catch (e) {}

        const itemHandler: ItemHandlerInterface = {
            id: GenUUID(),
            itemId: itemId,
            ownerId: ownerId,
            addedDate: createDate,
            expiresOn: expirationDate,
            area: area,
            qty: qty,
        };
        const inventoryItem = await this.getData(
            config.dbCollections.inventoryItem,
            itemId
        );

        const itemHandlerResult = await this.createData(
            config.dbCollections.itemHandler,
            itemHandler
        );

        const result = buildItemHandlerInfo(itemHandlerResult, inventoryItem);
        return Promise.resolve(buildSimpleResponse(result));
    }

    /**
     * Patch the Item Handler item
     *
     * @remarks
     * This method is part of patch item handler item
     * - Request Type - PATCH
     * - Access - Internal only
     * - End Point - API_URL/item-handler/{:itemId}
     *
     * @param body - {"expiresOn":date,"qty":10}
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async patch(id: NullableId, data: Partial<any>): Promise<any> {
        if (IsNotNullOrEmpty(id) && id) {
            const { expiresOn, qty } = data;
            const patchData: any = {};
            if (IsNotNullOrEmpty(qty)) {
                patchData.qty = qty;
            }

            if (IsNotNullOrEmpty(expiresOn)) {
                let expirationDate = getUtcDate();
                try {
                    expirationDate = new Date(expiresOn);
                } catch (e) {}
                patchData.expiresOn = expirationDate;
            }
            const item = await this.getData(
                config.dbCollections.itemHandler,
                id
            );
            if (IsNotNullOrEmpty(item)) {
                const inventoryItem = await this.getData(
                    config.dbCollections.inventoryItem,
                    item.itemId
                );
                const updatedItemHandler = await this.patchData(
                    config.dbCollections.itemHandler,
                    id,
                    patchData
                );
                const result = buildItemHandlerInfo(
                    updatedItemHandler,
                    inventoryItem
                );
                return Promise.resolve(buildSimpleResponse(result));
            }
        }
        throw new NotFound(messages.common_messages_target_item_notfound);
    }

    /**
     * Get the owner ItemHandler items
     *
     * @remarks
     * This method is part of get owner item handler items
     * - Request Type - GET
     * - Access - Owner only
     * - End Point - API_URL/item-handler
     *
     * @returns - { "status":"success", "data":[{...},{...}]}
     *
     */
    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (IsNotNullOrEmpty(loginUser)) {
            await this.deleteMultipleData(config.dbCollections.itemHandler, {
                query: { expiresOn: { $lt: getUtcDate() } },
            });

            const itemHandlerList = await this.findDataToArray(
                config.dbCollections.itemHandler,
                { query: { ownerId: loginUser.id } }
            );

            const itemList: any[] = [];

            if (itemHandlerList.length == 0) {
                const userDetail = await this.getData(
                    config.dbCollections.accounts,
                    loginUser.id
                );

                const level = userDetail.level || 1;
                const inventoryItemList: InventoryItemInterface[] =
                    await this.findDataToArray(
                        config.dbCollections.inventoryItem,
                        {
                            query: {
                                'prerequisites.minLevel': { $lte: level },
                                'prerequisites.maxLevel': { $gte: level },
                            },
                        }
                    );

                for (const inventoryItem of inventoryItemList) {
                    try {
                        const expireOn = getUtcDate();
                        expireOn.setMilliseconds(
                            inventoryItem.prerequisites.expireAfter
                        );
                        const result = await this.create({
                            itemId: inventoryItem.id,
                            ownerId: loginUser.id,
                            addedDate: getUtcDate(),
                            expiresOn: expireOn,
                            area: '',
                            qty: inventoryItem.prerequisites.maxAvailable,
                        });

                        if (IsNotNullOrEmpty(result.data)) {
                            itemList.push(
                                buildItemHandlerInfo(result.data, inventoryItem)
                            );
                        }
                    } catch (e) {}
                }
            } else {
                const inventoryItemIds = itemHandlerList
                    .map((item) => item.itemId)
                    .filter(
                        (value, index, self) =>
                            self.indexOf(value) === index && value !== undefined
                    );
                const inventoryItems = await this.findDataToArray(
                    config.dbCollections.inventoryItem,
                    { query: { id: { $in: inventoryItemIds } } }
                );

                itemHandlerList.map((element) => {
                    let inventoryItem: InventoryItemInterface | undefined;
                    for (const item of inventoryItems) {
                        if (item && item.id === element.itemId) {
                            inventoryItem = item;
                            break;
                        }
                    }
                    itemList.push(buildItemHandlerInfo(element, inventoryItem));
                });
            }
            return Promise.resolve(buildSimpleResponse(itemList));
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }

    /**
     * Get the Item Handler item
     *
     * @remarks
     * This method is part of get item handler item
     * - Request Type - GET
     * - Access - Owner only
     * - End Point - API_URL/item-handler/${itemId}
     *
     * @param itemId: url param
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async get(id: Id, params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (IsNotNullOrEmpty(loginUser)) {
            const itemHandler = await this.getData(
                config.dbCollections.itemHandler,
                id
            );
            if (itemHandler.ownerId === loginUser.id || isAdmin(loginUser)) {
                const inventoryItem = await this.getData(
                    config.dbCollections.inventoryItem,
                    itemHandler.itemId
                );
                const result = buildItemHandlerInfo(itemHandler, inventoryItem);
                return Promise.resolve(buildSimpleResponse(result));
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
     * Remove the Item Handler item
     *
     * @remarks
     * This method is part of remove item handler item
     * - Request Type - Delete
     * - Access - Owner only
     * - End Point - API_URL/item-handler/${itemId}
     *
     * @param itemId: url param
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async remove(id: NullableId, params?: Params): Promise<any> {
        if (IsNotNullOrEmpty(id) && id) {
            const loginUser = extractLoggedInUserFromParams(params);
            const itemHandler = await this.getData(
                config.dbCollections.itemHandler,
                id
            );
            if (itemHandler.ownerId === loginUser.id || isAdmin(loginUser)) {
                await this.deleteData(config.dbCollections.itemHandler, id);
                const inventoryItem = await this.getData(
                    config.dbCollections.inventoryItem,
                    itemHandler.itemId
                );
                const result = buildItemHandlerInfo(itemHandler, inventoryItem);
                return Promise.resolve(buildSimpleResponse(result));
            } else {
                throw new NotFound(
                    messages.common_messages_target_item_notfound
                );
            }
        } else {
            throw new BadRequest(messages.common_messages_itemid_missing);
        }
    }
}
