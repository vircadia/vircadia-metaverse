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

import { IsNotNullOrEmpty } from '../../../utils/Misc';
import { DatabaseServiceOptions } from './../../../common/dbservice/DatabaseServiceOptions';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { Application } from '../../../declarations';
import { Params, NullableId } from '@feathersjs/feathers';
import config from '../../../appconfig';
import {
    buildPaginationResponse,
    buildSimpleResponse,
} from '../../../common/responsebuilder/responseBuilder';
import { messages } from '../../../utils/messages';
import { buildInventoryItemInfo } from '../../../common/responsebuilder/inventoryBuilder';
import { getUtcDate } from '../../../utils/Utils';
import { NotFound, BadRequest } from '@feathersjs/errors';

/**
 * Inventory Item.
 * @noInheritDoc
 */
export class InventoryItem extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Returns the Inventory Items
     *
     * @remarks
     * This method is part of the get list of inventory items
     * - Request Type - GET
     * - Access - Admin
     * - End Point - API_URL/inventory-item?per_page=10&page=1
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

        const inventoryItemData = await this.findData(
            config.dbCollections.inventoryItem,
            { query: { $skip: skip, $limit: perPage } }
        );
        const inventoryItemList: any[] = [];

        inventoryItemData.data.forEach((inventoryItem) => {
            inventoryItemList.push(buildInventoryItemInfo(inventoryItem));
        });
        return Promise.resolve(
            buildPaginationResponse(
                inventoryItemList,
                page,
                perPage,
                Math.ceil(inventoryItemData.total / perPage),
                inventoryItemData.total
            )
        );
    }

    /**
     * Returns the Inventory Item
     *
     * @remarks
     * This method is part of the get inventory item
     * - Request Type - GET
     * - Access - Admin
     * - End Point - API_URL/inventory-item/{inventoryItemId}
     *
     * @returns - Paginated inventory item list { data:{...}}
     *
     */

    async get(id: NullableId): Promise<any> {
        if (id !== null) {
            const inventoryItem = await this.getData(
                config.dbCollections.inventoryItem,
                id
            );
            if (IsNotNullOrEmpty(inventoryItem)) {
                return Promise.resolve(
                    buildSimpleResponse(buildInventoryItemInfo(inventoryItem))
                );
            }
        }
        throw new NotFound(messages.common_messages_record_not_available);
    }

    /**
     * Create Inventory Item
     *
     * @remarks
     * This method is part of the Create Inventory Item
     * - Request Type - POST
     * - Access - Admin
     * - End Point - API_URL/inventory-item
     *
     * @requires - authentication
     * @param requestBody - {
     *               "id": "regular-stick",
     *               "name": "Stick",
     *               "description": "It's a simple stick.",
     *               "metaData": {},
     *               "thumbnail": "https://staging-2.digisomni.com/img/logo-1.c0f688c0.png",
     *               "url": "https://staging-2.digisomni.com/img/logo-1.c0f688c0.png",
     *               "isNFT": false,
     *               "isTransferable": false,
     *               "itemType": "craftingItem",
     *               "itemQuality": "common",
     *               "itemStatus": {},
     *               "itemTags": {
     *                   "isQuestItem": false,
     *                   "questId": ""
     *               }
     *           }
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async create(data: any): Promise<any> {
        const inventoryItemList = await this.findDataToArray(
            config.dbCollections.inventoryItem,
            { query: { $limit: 1, id: data.id } }
        );

        if (inventoryItemList.length > 0) {
            throw new BadRequest(
                messages.common_messages_inventory_item_id_already_exist
            );
        }

        data.createdAt = getUtcDate();
        data.updatedAt = getUtcDate();
        const inventoryItem = await this.createData(
            config.dbCollections.inventoryItem,
            data
        );
        if (inventoryItem != null) {
            return Promise.resolve(
                buildSimpleResponse(buildInventoryItemInfo(inventoryItem))
            );
        }
    }

    /**
     * Edit Inventory Item
     *
     * @remarks
     * This method is part of the edit Inventory Item
     * - Request Type - PATCH
     * - Access - Admin
     * - End Point - API_URL/inventory-item
     *
     * @requires - authentication
     * @param requestBody - {
     *               "name": "Stick",
     *               "description": "It's a simple stick.",
     *               "metaData": {},
     *               "thumbnail": "https://staging-2.digisomni.com/img/logo-1.c0f688c0.png",
     *               "url": "https://staging-2.digisomni.com/img/logo-1.c0f688c0.png",
     *               "isNFT": false,
     *               "isTransferable": false,
     *               "itemType": "craftingItem",
     *               "itemQuality": "common",
     *               "itemStatus": {},
     *               "itemTags": {
     *                   "isQuestItem": false,
     *                   "questId": ""
     *               }
     *           }
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async patch(id: NullableId, data: any): Promise<any> {
        if (IsNotNullOrEmpty(id) && id) {
            data.updatedAt = getUtcDate();
            const inventoryItem = await this.patchData(
                config.dbCollections.inventoryItem,
                id,
                data
            );
            if (inventoryItem != null) {
                return Promise.resolve(
                    buildSimpleResponse(buildInventoryItemInfo(inventoryItem))
                );
            }
        }
        throw new BadRequest(messages.common_messages_badly_formed_data);
    }

    /**
     * Delete Inventory Item
     *
     * @remarks
     * This method is part of the Delete Inventory Item
     * - Request Type - DELETE
     * - Access - Admin
     * - End Point - API_URL/inventory-item/{itemId}
     *
     * @requires - authentication
     * @param itemId - Url param
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */
    async remove(id: NullableId): Promise<any> {
        throw new BadRequest(messages.common_messages_action_not_allowed);
        /*  if (IsNotNullOrEmpty(id) && id) {
            const inventoryItem = await this.getData(
                config.dbCollections.inventoryItem,
                id
            );
            if (IsNotNullOrEmpty(inventoryItem)) {
                await this.deleteData(
                    config.dbCollections.inventoryItem,
                    inventoryItem.id
                );
                await this.deleteMultipleData(config.dbCollections.inventory, {
                    query: { itemId: inventoryItem.id },
                });
                return Promise.resolve(
                    buildSimpleResponse(buildInventoryItemInfo(inventoryItem))
                );
            }
        }
        throw new NotFound(messages.common_messages_target_item_notfound);
        */
    }
}
