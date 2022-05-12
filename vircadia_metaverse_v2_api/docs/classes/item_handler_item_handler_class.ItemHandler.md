[goobie-verse](../README.md) / [Modules](../modules.md) / [item-handler/item-handler.class](../modules/item_handler_item_handler_class.md) / ItemHandler

# Class: ItemHandler

[item-handler/item-handler.class](../modules/item_handler_item_handler_class.md).ItemHandler

ItemHandler.

## Hierarchy

- `DatabaseService`

  ↳ **`ItemHandler`**

## Table of contents

### Constructors

- [constructor](item_handler_item_handler_class.ItemHandler.md#constructor)

### Methods

- [create](item_handler_item_handler_class.ItemHandler.md#create)
- [find](item_handler_item_handler_class.ItemHandler.md#find)
- [get](item_handler_item_handler_class.ItemHandler.md#get)
- [patch](item_handler_item_handler_class.ItemHandler.md#patch)
- [remove](item_handler_item_handler_class.ItemHandler.md#remove)

## Constructors

### constructor

• **new ItemHandler**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/item-handler/item-handler.class.ts:35](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/item-handler/item-handler.class.ts#L35)

## Methods

### create

▸ **create**(`data`): `Promise`<`any`\>

Create the Item Handler item

**`remarks`**
This method is part of creat item handler item
- Request Type - POST
- Access - Internal only
- End Point - API_URL/item-handler

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

[src/services/item-handler/item-handler.class.ts:52](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/item-handler/item-handler.class.ts#L52)

___

### find

▸ **find**(`params?`): `Promise`<`any`\>

Get the owner ItemHandler items

**`remarks`**
This method is part of get owner item handler items
- Request Type - GET
- Access - Owner only
- End Point - API_URL/item-handler

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

- { "status":"success", "data":[{...},{...}]}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/item-handler/item-handler.class.ts:153](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/item-handler/item-handler.class.ts#L153)

___

### get

▸ **get**(`id`, `params?`): `Promise`<`any`\>

Get the Item Handler item

**`remarks`**
This method is part of get item handler item
- Request Type - GET
- Access - Owner only
- End Point - API_URL/item-handler/${itemId}

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

- { "status":"success", "data":{...}}

#### Overrides

DatabaseService.get

#### Defined in

[src/services/item-handler/item-handler.class.ts:249](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/item-handler/item-handler.class.ts#L249)

___

### patch

▸ **patch**(`id`, `data`): `Promise`<`any`\>

Patch the Item Handler item

**`remarks`**
This method is part of patch item handler item
- Request Type - PATCH
- Access - Internal only
- End Point - API_URL/item-handler/{:itemId}

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

[src/services/item-handler/item-handler.class.ts:102](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/item-handler/item-handler.class.ts#L102)

___

### remove

▸ **remove**(`id`, `params?`): `Promise`<`any`\>

Remove the Item Handler item

**`remarks`**
This method is part of remove item handler item
- Request Type - Delete
- Access - Owner only
- End Point - API_URL/item-handler/${itemId}

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

[src/services/item-handler/item-handler.class.ts:286](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/item-handler/item-handler.class.ts#L286)
