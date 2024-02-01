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
import { Params } from '@feathersjs/feathers';
import { messages } from '../../../utils/messages';
import { GenUUID, IsNotNullOrEmpty, IsNullOrEmpty } from '../../../utils/Misc';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
import config from '../../../appconfig';
import { UserInventoryInterface } from '../../../common/interfaces/Inventoryinterface';
import { getUtcDate } from '../../../utils/Utils';
import { BadRequest, NotAcceptable, NotFound } from '@feathersjs/errors';

/**
 * Inventory Transfer.
 * @noInheritDoc
 */
export class InventoryTransfer extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     *  Transfer user inventory item
     *
     * @remarks
     * This method is part of the Transfer user inventory item
     * - Request Type - POST
     * - End Point - API_URL/inventory-transfer
     *
     * @param requestBody - {id:uuId,qty:1,toId:uuId}
     * - id: User inventory id
     * - qty: transfer number of items
     * - toId: to user Id
     * @returns - {status: 'success'} or { status: 'failure', message: 'message'}
     *
     */

    async create(data: any, params: Params): Promise<any> {
        if (IsNotNullOrEmpty(data)) {
            const { id, qty, toId } = data;
            const loginUser = extractLoggedInUserFromParams(params);

            const userInventoryItem = await this.getData(
                config.dbCollections.inventory,
                id
            );

            const totalQty = parseInt(`${qty}`);

            if (
                IsNotNullOrEmpty(userInventoryItem) &&
                userInventoryItem.userId === loginUser.id
            ) {
                const inventoryItem = await this.getData(
                    config.dbCollections.inventoryItem,
                    userInventoryItem.itemId
                );

                if (IsNullOrEmpty(inventoryItem)) {
                    throw new NotFound(messages.common_messages_data_notfound);
                } else if (inventoryItem.isTransferable !== true) {
                    throw new NotAcceptable(
                        messages.common_messages_item_not_transferable
                    );
                }
                if (userInventoryItem.qty >= totalQty) {
                    userInventoryItem.qty = userInventoryItem.qty - totalQty;

                    if (userInventoryItem.qty > 0) {
                        userInventoryItem.updatedAt = getUtcDate();
                        await this.patchData(
                            config.dbCollections.inventory,
                            userInventoryItem.id,
                            userInventoryItem
                        );
                    } else {
                        await this.deleteData(
                            config.dbCollections.inventory,
                            userInventoryItem.id
                        );
                    }
                    const toUserInventoryItemList: UserInventoryInterface[] =
                        await this.findDataToArray(
                            config.dbCollections.inventory,
                            {
                                query: {
                                    itemId: userInventoryItem.itemId,
                                    userId: toId,
                                },
                            }
                        );

                    if (toUserInventoryItemList.length > 0) {
                        const toUserInventoryItem = toUserInventoryItemList[0];
                        toUserInventoryItem.qty =
                            toUserInventoryItem.qty + totalQty;
                        toUserInventoryItem.updatedAt = getUtcDate();
                        await this.patchData(
                            config.dbCollections.inventory,
                            toUserInventoryItem.id,
                            toUserInventoryItem
                        );
                    } else {
                        const lastInserted = await this.findDataToArray(
                            config.dbCollections.inventory,
                            {
                                query: {
                                    $sort: {
                                        _id: -1,
                                    },
                                    $limit: 1,
                                    userId: toId,
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
                        const toUserInventoryItem: UserInventoryInterface = {
                            id: GenUUID(),
                            itemId: userInventoryItem.itemId,
                            qty: qty,
                            userId: toId,
                            itemSource: userInventoryItem.itemSource,
                            createdAt: getUtcDate(),
                            updatedAt: getUtcDate(),
                            orderNo: order,
                        };
                        await this.createData(
                            config.dbCollections.inventory,
                            toUserInventoryItem
                        );
                    }
                    return Promise.resolve({});
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
}

