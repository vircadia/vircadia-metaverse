[goobie-verse](../README.md) / [Modules](../modules.md) / [pickup-item/pickup-item.class](../modules/pickup_item_pickup_item_class.md) / PickupItem

# Class: PickupItem

[pickup-item/pickup-item.class](../modules/pickup_item_pickup_item_class.md).PickupItem

PickupItem.

## Hierarchy

- `DatabaseService`

  ↳ **`PickupItem`**

## Table of contents

### Constructors

- [constructor](pickup_item_pickup_item_class.PickupItem.md#constructor)

### Properties

- [application](pickup_item_pickup_item_class.PickupItem.md#application)

### Methods

- [create](pickup_item_pickup_item_class.PickupItem.md#create)
- [find](pickup_item_pickup_item_class.PickupItem.md#find)
- [get](pickup_item_pickup_item_class.PickupItem.md#get)
- [patch](pickup_item_pickup_item_class.PickupItem.md#patch)
- [remove](pickup_item_pickup_item_class.PickupItem.md#remove)

## Constructors

### constructor

• **new PickupItem**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/pickup-item/pickup-item.class.ts:32](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/pickup-item/pickup-item.class.ts#L32)

## Properties

### application

• **application**: `Application`

#### Defined in

[src/services/pickup-item/pickup-item.class.ts:31](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/pickup-item/pickup-item.class.ts#L31)

## Methods

### create

▸ **create**(`data`, `params?`): `Promise`<`any`\>

Pickup the ItemHandler item

**`remarks`**
This method is part of Pickup ItemHandler item
- Request Type - POST
- Access - Item Handler owner
- End Point - API_URL/pickup-item

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

- { "status":"success", "data":{...}}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/pickup-item/pickup-item.class.ts:50](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/pickup-item/pickup-item.class.ts#L50)

___

### find

▸ **find**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.find

#### Defined in

[src/services/pickup-item/pickup-item.class.ts:105](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/pickup-item/pickup-item.class.ts#L105)

___

### get

▸ **get**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.get

#### Defined in

[src/services/pickup-item/pickup-item.class.ts:109](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/pickup-item/pickup-item.class.ts#L109)

___

### patch

▸ **patch**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/pickup-item/pickup-item.class.ts:101](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/pickup-item/pickup-item.class.ts#L101)

___

### remove

▸ **remove**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.remove

#### Defined in

[src/services/pickup-item/pickup-item.class.ts:113](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/pickup-item/pickup-item.class.ts#L113)
