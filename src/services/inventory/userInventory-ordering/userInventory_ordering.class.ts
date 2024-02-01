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

import { BadRequest, NotFound } from '@feathersjs/errors';
import { NullableId, Params } from '@feathersjs/feathers';
import config from '../../../appconfig';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { buildInventoryInfo } from '../../../common/responsebuilder/inventoryBuilder';
import { buildSimpleResponse } from '../../../common/responsebuilder/responseBuilder';
import { Application } from '../../../declarations';
import { messages } from '../../../utils/messages';
import { IsNotNullOrEmpty } from '../../../utils/Misc';

/**
 * UserInventoryOrdering.
 * @noInheritDoc
 */
export class UserInventoryOrdering extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Patch the User Inventory item
     *
     * @remarks
     * This method is part of patch user inventory item
     * - Request Type - PATCH
     * - Access - Internal Only
     * - End Point - API_URL/userinventory_ordering
     * @param body - [ { "id":"id","orderNo":2 },{ "id":"id" , "orderNo":1 } ]
     *
     * @returns - { "status":"success", "data":{...}}
     *
     */

    async patch(id: NullableId, data: Partial<any>): Promise<any> {
        data.forEach(async (item: any) => {
            try {
                await this.patchData(config.dbCollections.inventory, item.id, {
                    orderNo: item.orderNo,
                });
            } catch (error: any) {
                throw new BadRequest(error.message);
            }
        });
    }
}

