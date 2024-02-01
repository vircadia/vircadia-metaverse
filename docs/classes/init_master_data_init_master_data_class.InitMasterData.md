[goobie-verse](../README.md) / [Modules](../modules.md) / [init-master-data/init-master-data.class](../modules/init_master_data_init_master_data_class.md) / InitMasterData

# Class: InitMasterData

[init-master-data/init-master-data.class](../modules/init_master_data_init_master_data_class.md).InitMasterData

## Hierarchy

- `DatabaseService`

  ↳ **`InitMasterData`**

## Table of contents

### Constructors

- [constructor](init_master_data_init_master_data_class.InitMasterData.md#constructor)

### Properties

- [Model](init_master_data_init_master_data_class.InitMasterData.md#model)
- [app](init_master_data_init_master_data_class.InitMasterData.md#app)
- [options](init_master_data_init_master_data_class.InitMasterData.md#options)

### Accessors

- [events](init_master_data_init_master_data_class.InitMasterData.md#events)
- [id](init_master_data_init_master_data_class.InitMasterData.md#id)

### Methods

- [\_create](init_master_data_init_master_data_class.InitMasterData.md#_create)
- [\_find](init_master_data_init_master_data_class.InitMasterData.md#_find)
- [\_get](init_master_data_init_master_data_class.InitMasterData.md#_get)
- [\_patch](init_master_data_init_master_data_class.InitMasterData.md#_patch)
- [\_remove](init_master_data_init_master_data_class.InitMasterData.md#_remove)
- [\_update](init_master_data_init_master_data_class.InitMasterData.md#_update)
- [allowsMulti](init_master_data_init_master_data_class.InitMasterData.md#allowsmulti)
- [create](init_master_data_init_master_data_class.InitMasterData.md#create)
- [createData](init_master_data_init_master_data_class.InitMasterData.md#createdata)
- [createMultipleData](init_master_data_init_master_data_class.InitMasterData.md#createmultipledata)
- [deleteData](init_master_data_init_master_data_class.InitMasterData.md#deletedata)
- [deleteMultipleData](init_master_data_init_master_data_class.InitMasterData.md#deletemultipledata)
- [filterQuery](init_master_data_init_master_data_class.InitMasterData.md#filterquery)
- [find](init_master_data_init_master_data_class.InitMasterData.md#find)
- [findData](init_master_data_init_master_data_class.InitMasterData.md#finddata)
- [findDataToArray](init_master_data_init_master_data_class.InitMasterData.md#finddatatoarray)
- [get](init_master_data_init_master_data_class.InitMasterData.md#get)
- [getData](init_master_data_init_master_data_class.InitMasterData.md#getdata)
- [getDatabase](init_master_data_init_master_data_class.InitMasterData.md#getdatabase)
- [getService](init_master_data_init_master_data_class.InitMasterData.md#getservice)
- [loadDatabase](init_master_data_init_master_data_class.InitMasterData.md#loaddatabase)
- [patch](init_master_data_init_master_data_class.InitMasterData.md#patch)
- [patchData](init_master_data_init_master_data_class.InitMasterData.md#patchdata)
- [patchMultipleData](init_master_data_init_master_data_class.InitMasterData.md#patchmultipledata)
- [remove](init_master_data_init_master_data_class.InitMasterData.md#remove)
- [update](init_master_data_init_master_data_class.InitMasterData.md#update)

## Constructors

### constructor

• **new InitMasterData**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/init-master-data/init-master-data.class.ts:9](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/init-master-data/init-master-data.class.ts#L9)

## Properties

### Model

• **Model**: `Collection`<`Document`\>

#### Inherited from

DatabaseService.Model

#### Defined in

node_modules/feathers-mongodb/types/index.d.ts:11

___

### app

• `Optional` `Private` **app**: `Application`

The Express application

#### Inherited from

DatabaseService.app

#### Defined in

[src/common/dbservice/DatabaseService.ts:35](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L35)

___

### options

• **options**: `MongoDBServiceOptions`

#### Inherited from

DatabaseService.options

#### Defined in

node_modules/feathers-mongodb/types/index.d.ts:12

## Accessors

### events

• `get` **events**(): `string`[]

#### Returns

`string`[]

#### Inherited from

DatabaseService.events

#### Defined in

node_modules/@feathersjs/adapter-commons/lib/service.d.ts:86

___

### id

• `get` **id**(): `string`

#### Returns

`string`

#### Inherited from

DatabaseService.id

#### Defined in

node_modules/@feathersjs/adapter-commons/lib/service.d.ts:85

## Methods

### \_create

▸ **_create**(`data`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Partial`<`any`\> \| `Partial`<`any`\>[] |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.\_create

#### Defined in

node_modules/feathers-mongodb/types/index.d.ts:18

___

### \_find

▸ **_find**(`params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.\_find

#### Defined in

node_modules/feathers-mongodb/types/index.d.ts:16

___

### \_get

▸ **_get**(`id`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.\_get

#### Defined in

node_modules/feathers-mongodb/types/index.d.ts:17

___

### \_patch

▸ **_patch**(`id`, `data`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `Partial`<`any`\> |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.\_patch

#### Defined in

node_modules/feathers-mongodb/types/index.d.ts:20

___

### \_remove

▸ **_remove**(`id`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.\_remove

#### Defined in

node_modules/feathers-mongodb/types/index.d.ts:21

___

### \_update

▸ **_update**(`id`, `data`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `any` |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.\_update

#### Defined in

node_modules/feathers-mongodb/types/index.d.ts:19

___

### allowsMulti

▸ **allowsMulti**(`method`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |

#### Returns

`boolean`

#### Inherited from

DatabaseService.allowsMulti

#### Defined in

node_modules/@feathersjs/adapter-commons/lib/service.d.ts:95

___

### create

▸ **create**(`data`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Partial`<`any`\> \| `Partial`<`any`\>[] |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.create

#### Defined in

node_modules/@feathersjs/adapter-commons/lib/service.d.ts:98

___

### createData

▸ **createData**(`tableName`, `data`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.createData

#### Defined in

[src/common/dbservice/DatabaseService.ts:147](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L147)

___

### createMultipleData

▸ **createMultipleData**(`tableName`, `data`): `Promise`<[`any`]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |
| `data` | `any`[] |

#### Returns

`Promise`<[`any`]\>

#### Inherited from

DatabaseService.createMultipleData

#### Defined in

[src/common/dbservice/DatabaseService.ts:152](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L152)

___

### deleteData

▸ **deleteData**(`tableName`, `id`, `filter?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |
| `id` | `Id` |
| `filter?` | `Filter`<`any`\> |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.deleteData

#### Defined in

[src/common/dbservice/DatabaseService.ts:130](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L130)

___

### deleteMultipleData

▸ **deleteMultipleData**(`tableName`, `filter`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |
| `filter` | `Filter`<`any`\> |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.deleteMultipleData

#### Defined in

[src/common/dbservice/DatabaseService.ts:139](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L139)

___

### filterQuery

▸ **filterQuery**(`params?`, `opts?`): { `[key: string]`: `any`;  } & { `paginate`: ``false`` \| `Pick`<`PaginationOptions`, ``"max"``\> \| { `default?`: `number` ; `max?`: `number`  }  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |
| `opts?` | `any` |

#### Returns

{ `[key: string]`: `any`;  } & { `paginate`: ``false`` \| `Pick`<`PaginationOptions`, ``"max"``\> \| { `default?`: `number` ; `max?`: `number`  }  }

#### Inherited from

DatabaseService.filterQuery

#### Defined in

node_modules/@feathersjs/adapter-commons/lib/service.d.ts:87

___

### find

▸ **find**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.find

#### Defined in

[src/services/init-master-data/init-master-data.class.ts:13](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/init-master-data/init-master-data.class.ts#L13)

___

### findData

▸ **findData**(`tableName`, `filter?`): `Promise`<`Paginated`<`any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |
| `filter?` | `Filter`<`any`\> |

#### Returns

`Promise`<`Paginated`<`any`\>\>

#### Inherited from

DatabaseService.findData

#### Defined in

[src/common/dbservice/DatabaseService.ts:86](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L86)

___

### findDataToArray

▸ **findDataToArray**(`tableName`, `filter?`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |
| `filter?` | `Filter`<`any`\> |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

DatabaseService.findDataToArray

#### Defined in

[src/common/dbservice/DatabaseService.ts:98](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L98)

___

### get

▸ **get**(`id`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.get

#### Defined in

node_modules/@feathersjs/adapter-commons/lib/service.d.ts:97

___

### getData

▸ **getData**(`tableName`, `id`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |
| `id` | `Id` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.getData

#### Defined in

[src/common/dbservice/DatabaseService.ts:81](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L81)

___

### getDatabase

▸ **getDatabase**(): `Promise`<`Db`\>

#### Returns

`Promise`<`Db`\>

#### Inherited from

DatabaseService.getDatabase

#### Defined in

[src/common/dbservice/DatabaseService.ts:66](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L66)

___

### getService

▸ **getService**(`tableName`): `Promise`<`Collection`<`Document`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |

#### Returns

`Promise`<`Collection`<`Document`\>\>

#### Inherited from

DatabaseService.getService

#### Defined in

[src/common/dbservice/DatabaseService.ts:76](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L76)

___

### loadDatabase

▸ **loadDatabase**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

DatabaseService.loadDatabase

#### Defined in

[src/common/dbservice/DatabaseService.ts:58](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L58)

___

### patch

▸ **patch**(`id`, `data`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `Partial`<`any`\> |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.patch

#### Defined in

node_modules/@feathersjs/adapter-commons/lib/service.d.ts:100

___

### patchData

▸ **patchData**(`tableName`, `id`, `data`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |
| `id` | `Id` |
| `data` | `VKeyedCollection` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.patchData

#### Defined in

[src/common/dbservice/DatabaseService.ts:111](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L111)

___

### patchMultipleData

▸ **patchMultipleData**(`tableName`, `id`, `data`, `filter`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tableName` | `string` |
| `id` | `NullableId` |
| `data` | `VKeyedCollection` |
| `filter` | `Filter`<`any`\> |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.patchMultipleData

#### Defined in

[src/common/dbservice/DatabaseService.ts:120](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/common/dbservice/DatabaseService.ts#L120)

___

### remove

▸ **remove**(`id`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.remove

#### Defined in

node_modules/@feathersjs/adapter-commons/lib/service.d.ts:101

___

### update

▸ **update**(`id`, `data`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |
| `data` | `any` |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Inherited from

DatabaseService.update

#### Defined in

node_modules/@feathersjs/adapter-commons/lib/service.d.ts:99
