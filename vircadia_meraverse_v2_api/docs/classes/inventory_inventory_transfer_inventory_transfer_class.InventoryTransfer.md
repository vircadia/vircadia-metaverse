[goobie-verse](../README.md) / [Modules](../modules.md) / [inventory/inventory-transfer/inventory-transfer.class](../modules/inventory_inventory_transfer_inventory_transfer_class.md) / InventoryTransfer

# Class: InventoryTransfer

[inventory/inventory-transfer/inventory-transfer.class](../modules/inventory_inventory_transfer_inventory_transfer_class.md).InventoryTransfer

Inventory Transfer.

## Hierarchy

- `DatabaseService`

  ↳ **`InventoryTransfer`**

## Table of contents

### Constructors

- [constructor](inventory_inventory_transfer_inventory_transfer_class.InventoryTransfer.md#constructor)

### Methods

- [create](inventory_inventory_transfer_inventory_transfer_class.InventoryTransfer.md#create)

## Constructors

### constructor

• **new InventoryTransfer**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/inventory/inventory-transfer/inventory-transfer.class.ts:32](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/inventory-transfer/inventory-transfer.class.ts#L32)

## Methods

### create

▸ **create**(`data`, `params`): `Promise`<`any`\>

 Transfer user inventory item

**`remarks`**
This method is part of the Transfer user inventory item
- Request Type - POST
- End Point - API_URL/inventory-transfer

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `params` | `Params` |

#### Returns

`Promise`<`any`\>

- {status: 'success'} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/inventory/inventory-transfer/inventory-transfer.class.ts:52](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/inventory/inventory-transfer/inventory-transfer.class.ts#L52)
