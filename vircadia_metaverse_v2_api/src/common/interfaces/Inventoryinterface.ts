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
 * Represet an UserInventory
 * @interface UserInventoryInterface
 */
export interface UserInventoryInterface {
    /** A string representing inventory id */
    id: string;
    /** A string representing inventory item id */
    itemId: string;
    /** A number representing quantity */
    qty: number;
    /** A string representing inventory item source */
    itemSource: string;
    /** A string representing inventory user id */
    userId: string;
    /** A Order representing inventory item */
    orderNo: number;
    /** A Date representing inventory item created date */
    createdAt: Date;
    /** A Date representing inventory item updatedAt date */
    updatedAt: Date;
}

/**
 * Represet a Inventory Item
 * @interface InventoryItemInterface
 */
export interface InventoryItemInterface {
    /** A string representing inventory item id */
    id: string;
    /** A string representing inventory item name */
    name: string;
    /** A string representing inventory item description */
    description: string;
    /** A any representing inventory item metadata */
    metaData: any;
    /** A string representing inventory item thumbnail */
    thumbnail: string;
    /** A string representing inventory item URL */
    url: string;
    /** A boolean representing inventory item is NFT or not */
    isNFT: boolean;
    /** A boolean representing inventory item is Transferable or not */
    isTransferable: boolean;
    /** A boolean representing inventory item is Transferable or not */
    itemType: string;
    /** A string representing inventory item quality */
    itemQuality: string;
    /** A Date representing inventory item created date */
    createdAt: Date;
    /** A Date representing inventory item updatedAt date */
    updatedAt: Date;
    /** A any representing prerequisites */
    prerequisites: PrerequisitesInterface;
    /** A any representing inventory item status */
    itemStatus: any;
    /** A ItemTagsInterface representing inventory item is quest item and quest item id  */
    itemTags: ItemTagsInterface;
}

export interface ItemTagsInterface {
    isQuestItem: boolean;
    questId: string;
}

export interface PrerequisitesInterface {
    minLevel: number;
    maxLevel: number;
    maxAvailable: number;
    expireAfter: number;
}

