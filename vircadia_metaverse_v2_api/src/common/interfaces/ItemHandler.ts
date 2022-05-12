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

/**
 * Represet an ItemHandler
 * @interface ItemHandlerInterface
 */
export interface ItemHandlerInterface {
    /** UniqueKeyID  */
    id: string;
    /** ItemID - ID of the item, this is Inventory item id  */
    itemId: string;
    /** OwnerID - ID of the user it was spawned for */
    ownerId: string;
    /** DateAdded - date and time it was spawned on - date */
    addedDate: Date;
    /** ExpiresOn - date and time the items expire - date */
    expiresOn: Date;
    /** Area - area the items should be spawned in - string */
    area: string;
    /** Quantity - the amount of this item that should be spawned - int */
    qty: number;
}
