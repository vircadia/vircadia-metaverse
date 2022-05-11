[goobie-verse](../README.md) / [Modules](../modules.md) / [inventory/userInventory/userInventory.class](../modules/inventory_userInventory_userInventory_class.md) / UserInventory

# Class: UserInventory

[inventory/userInventory/userInventory.class](../modules/inventory_userInventory_userInventory_class.md).UserInventory

UserInventory.

## Hierarchy

- `DatabaseService`

  ↳ **`UserInventory`**

## Table of contents

### Constructors

- [constructor](inventory_userInventory_userInventory_class.UserInventory.md#constructor)

### Methods

- [create](inventory_userInventory_userInventory_class.UserInventory.md#create)
- [find](inventory_userInventory_userInventory_class.UserInventory.md#find)
- [get](inventory_userInventory_userInventory_class.UserInventory.md#get)
- [patch](inventory_userInventory_userInventory_class.UserInventory.md#patch)
- [remove](inventory_userInventory_userInventory_class.UserInventory.md#remove)

## Constructors

### constructor

• **new UserInventory**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/inventory/userInventory/userInventory.class.ts:42](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/userInventory/userInventory.class.ts#L42)

## Methods

### create

▸ **create**(`data`): `Promise`<`any`\>

Create the User Inventory item

**`remarks`**
This method is part of creat user inventory item
- Request Type - POST
- Access - Admin
- End Point - API_URL/user-inventory

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

- { "status":"success", "data":{...}}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/inventory/userInventory/userInventory.class.ts:165](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/userInventory/userInventory.class.ts#L165)

___

### find

▸ **find**(`params?`): `Promise`<`any`\>

Returns the User Inventory

**`remarks`**
This method is part of the get list of user inventory
- Request Type - GET
- End Point - API_URL/user-inventory?per_page=10&page=1

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

[src/services/inventory/userInventory/userInventory.class.ts:101](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/userInventory/userInventory.class.ts#L101)

___

### get

▸ **get**(`id`, `params?`): `Promise`<`any`\>

Returns the User Inventory

**`remarks`**
This method is part of the get list of user inventory
- Request Type - GET
- End Point - API_URL/user-inventory/${userInventoryItemId}

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

-  { "result":"success", "data":{...}}

#### Overrides

DatabaseService.get

#### Defined in

[src/services/inventory/userInventory/userInventory.class.ts:58](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/userInventory/userInventory.class.ts#L58)

___

### patch

▸ **patch**(`id`, `data`): `Promise`<`any`\>

Patch the User Inventory item

**`remarks`**
This method is part of patch user inventory item
- Request Type - PATCH
- Access - Internal Only
- End Point - API_URL/user-inventory/{userInventoryId}

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `Partial`<`any`\> |

#### Returns

`Promise`<`any`\>

- { "status":"success", "data":{...}}

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/inventory/userInventory/userInventory.class.ts:235](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/userInventory/userInventory.class.ts#L235)

___

### remove

▸ **remove**(`id`, `params?`): `Promise`<`any`\>

Remove the User Inventory item

**`remarks`**
This method is part of remove user inventory item
- Request Type - Delete
- End Point - API_URL/user-inventory/{userInventoryId}

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

- { "status":"success", "data":{...}}

#### Overrides

DatabaseService.remove

#### Defined in

[src/services/inventory/userInventory/userInventory.class.ts:269](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/userInventory/userInventory.class.ts#L269)
