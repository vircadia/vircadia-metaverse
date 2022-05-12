[goobie-verse](../README.md) / [Modules](../modules.md) / [inventory/inventory-item/inventory-item.class](../modules/inventory_inventory_item_inventory_item_class.md) / InventoryItem

# Class: InventoryItem

[inventory/inventory-item/inventory-item.class](../modules/inventory_inventory_item_inventory_item_class.md).InventoryItem

Inventory Item.

## Hierarchy

- `DatabaseService`

  ↳ **`InventoryItem`**

## Table of contents

### Constructors

- [constructor](inventory_inventory_item_inventory_item_class.InventoryItem.md#constructor)

### Methods

- [create](inventory_inventory_item_inventory_item_class.InventoryItem.md#create)
- [find](inventory_inventory_item_inventory_item_class.InventoryItem.md#find)
- [get](inventory_inventory_item_inventory_item_class.InventoryItem.md#get)
- [patch](inventory_inventory_item_inventory_item_class.InventoryItem.md#patch)
- [remove](inventory_inventory_item_inventory_item_class.InventoryItem.md#remove)

## Constructors

### constructor

• **new InventoryItem**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/inventory/inventory-item/inventory-item.class.ts:37](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/inventory-item/inventory-item.class.ts#L37)

## Methods

### create

▸ **create**(`data`): `Promise`<`any`\>

Create Inventory Item

**`remarks`**
This method is part of the Create Inventory Item
- Request Type - POST
- Access - Admin
- End Point - API_URL/inventory-item

**`requires`** - authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

- {status: 'success', data:{...}} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/inventory/inventory-item/inventory-item.class.ts:139](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/inventory-item/inventory-item.class.ts#L139)

___

### find

▸ **find**(`params?`): `Promise`<`any`\>

Returns the Inventory Items

**`remarks`**
This method is part of the get list of inventory items
- Request Type - GET
- Access - Admin
- End Point - API_URL/inventory-item?per_page=10&page=1

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

- Paginated inventory item list { data:[{...},{...}],current_page:1,per_page:10,total_pages:1,total_entries:5}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/inventory/inventory-item/inventory-item.class.ts:55](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/inventory-item/inventory-item.class.ts#L55)

___

### get

▸ **get**(`id`): `Promise`<`any`\>

Returns the Inventory Item

**`remarks`**
This method is part of the get inventory item
- Request Type - GET
- Access - Admin
- End Point - API_URL/inventory-item/{inventoryItemId}

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |

#### Returns

`Promise`<`any`\>

- Paginated inventory item list { data:{...}}

#### Overrides

DatabaseService.get

#### Defined in

[src/services/inventory/inventory-item/inventory-item.class.ts:93](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/inventory-item/inventory-item.class.ts#L93)

___

### patch

▸ **patch**(`id`, `data`): `Promise`<`any`\>

Edit Inventory Item

**`remarks`**
This method is part of the edit Inventory Item
- Request Type - PATCH
- Access - Admin
- End Point - API_URL/inventory-item

**`requires`** - authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

- {status: 'success', data:{...}} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/inventory/inventory-item/inventory-item.class.ts:194](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/inventory-item/inventory-item.class.ts#L194)

___

### remove

▸ **remove**(`id`): `Promise`<`any`\>

Delete Inventory Item

**`remarks`**
This method is part of the Delete Inventory Item
- Request Type - DELETE
- Access - Admin
- End Point - API_URL/inventory-item/{itemId}

**`requires`** - authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |

#### Returns

`Promise`<`any`\>

- {status: 'success', data:{...}} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.remove

#### Defined in

[src/services/inventory/inventory-item/inventory-item.class.ts:225](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/inventory-item/inventory-item.class.ts#L225)
