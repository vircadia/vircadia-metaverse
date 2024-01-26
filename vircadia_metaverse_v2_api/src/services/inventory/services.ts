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

import UserInventory from './userInventory/userInventory.service';
import InventoryItem from './inventory-item/inventory-item.service';
import InventoryTransfer from './inventory-transfer/inventory-transfer.service';
import userInventoryOrdering from './userInventory-ordering/userInventory_ordering.service';
export default [
    UserInventory,
    InventoryItem,
    InventoryTransfer,
    userInventoryOrdering,
];

