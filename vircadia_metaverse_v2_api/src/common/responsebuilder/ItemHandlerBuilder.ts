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

import { ItemHandlerInterface } from './../interfaces/ItemHandler';
import { InventoryItemInterface } from '../interfaces/Inventoryinterface';
import { buildInventoryItemInfo } from './inventoryBuilder';

export function buildItemHandlerInfo(
    itemHandlerInterface: ItemHandlerInterface,
    inventoryItem?: InventoryItemInterface
): any {
    return {
        id: itemHandlerInterface?.id,
        itemId: itemHandlerInterface?.itemId,
        ownerId: itemHandlerInterface?.ownerId,
        addedDate: itemHandlerInterface?.addedDate,
        expiresOn: itemHandlerInterface?.expiresOn,
        area: itemHandlerInterface?.area,
        qty: itemHandlerInterface?.qty,
        item: buildInventoryItemInfo(inventoryItem),
    };
}
