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

import { ItemSource } from './../../utils/InventoryUtils';
import { Params } from '@feathersjs/feathers';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import config from '../../appconfig';
import { BadRequest, NotFound } from '@feathersjs/errors';
import { messages } from '../../utils/messages';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';

/**
 * PickupItem.
 * @noInheritDoc
 */
export class PickupItem extends DatabaseService {
    application: Application;
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
        this.application = app;
    }

    /**
     * Pickup the ItemHandler item
     *
     * @remarks
     * This method is part of Pickup ItemHandler item
     * - Request Type - POST
     * - Access - Item Handler owner
     * - End Point - API_URL/pickup-item
     *
     * @param body - { "id":""} // ItemHandler item id
     * @returns - { "status":"success", "data":{...}}
     *
     */
    async create(data: any, params?: Params): Promise<any> {
        const { id } = data;
        const loginUser = extractLoggedInUserFromParams(params);
        const itemHandler = await this.getData(
            config.dbCollections.itemHandler,
            id
        );
        if (itemHandler.ownerId === loginUser.id) {
            if (itemHandler.qty > 0) {
                const userInventoryList = await this.findDataToArray(
                    config.dbCollections.inventory,
                    {
                        query: {
                            userId: loginUser.id,
                            itemId: itemHandler.itemId,
                        },
                    }
                );
                let result: any;
                if (userInventoryList.length > 0) {
                    const userInventoryItem = userInventoryList[0];
                    const qty = userInventoryItem.qty + 1;
                    result = await this.application
                        .service('user-inventory')
                        .patch(userInventoryItem.id, { qty });
                } else {
                    result = await this.application
                        .service('user-inventory')
                        .create({
                            itemId: itemHandler.itemId,
                            toUserId: loginUser.id,
                            qty: 1,
                            itemSource: ItemSource.PICKUP,
                        });
                }
                //temporary stop qty deduction
                /*if(IsNotNullOrEmpty(result)){
                    const qty = itemHandler.qty>0 ? itemHandler.qty - 1:0;
                    await this.patchData(config.dbCollections.itemHandler,itemHandler.id,{qty});
                }*/
                return Promise.resolve(buildSimpleResponse(result));
            } else {
                throw new BadRequest(
                    messages.common_messages_not_enough_qry_error
                );
            }
        } else {
            throw new NotFound(messages.common_messages_target_item_notfound);
        }
    }

    async patch(): Promise<any> {
        throw new NotFound(messages.common_messages_endpoint_not_exist);
    }

    async find(): Promise<any> {
        throw new NotFound(messages.common_messages_endpoint_not_exist);
    }

    async get(): Promise<any> {
        throw new NotFound(messages.common_messages_endpoint_not_exist);
    }

    async remove(): Promise<any> {
        throw new NotFound(messages.common_messages_endpoint_not_exist);
    }
}
