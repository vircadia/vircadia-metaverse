[goobie-verse](../README.md) / [Modules](../modules.md) / [quest\_apis/npc/npc.class](../modules/quest_apis_npc_npc_class.md) / Npc

# Class: Npc

[quest_apis/npc/npc.class](../modules/quest_apis_npc_npc_class.md).Npc

## Hierarchy

- `DatabaseService`

  ↳ **`Npc`**

## Table of contents

### Constructors

- [constructor](quest_apis_npc_npc_class.Npc.md#constructor)

### Properties

- [Model](quest_apis_npc_npc_class.Npc.md#model)
- [app](quest_apis_npc_npc_class.Npc.md#app)
- [options](quest_apis_npc_npc_class.Npc.md#options)

### Accessors

- [events](quest_apis_npc_npc_class.Npc.md#events)
- [id](quest_apis_npc_npc_class.Npc.md#id)

### Methods

- [\_create](quest_apis_npc_npc_class.Npc.md#_create)
- [\_find](quest_apis_npc_npc_class.Npc.md#_find)
- [\_get](quest_apis_npc_npc_class.Npc.md#_get)
- [\_patch](quest_apis_npc_npc_class.Npc.md#_patch)
- [\_remove](quest_apis_npc_npc_class.Npc.md#_remove)
- [\_update](quest_apis_npc_npc_class.Npc.md#_update)
- [allowsMulti](quest_apis_npc_npc_class.Npc.md#allowsmulti)
- [create](quest_apis_npc_npc_class.Npc.md#create)
- [createData](quest_apis_npc_npc_class.Npc.md#createdata)
- [createMultipleData](quest_apis_npc_npc_class.Npc.md#createmultipledata)
- [deleteData](quest_apis_npc_npc_class.Npc.md#deletedata)
- [deleteMultipleData](quest_apis_npc_npc_class.Npc.md#deletemultipledata)
- [filterQuery](quest_apis_npc_npc_class.Npc.md#filterquery)
- [find](quest_apis_npc_npc_class.Npc.md#find)
- [findData](quest_apis_npc_npc_class.Npc.md#finddata)
- [findDataToArray](quest_apis_npc_npc_class.Npc.md#finddatatoarray)
- [get](quest_apis_npc_npc_class.Npc.md#get)
- [getData](quest_apis_npc_npc_class.Npc.md#getdata)
- [getDatabase](quest_apis_npc_npc_class.Npc.md#getdatabase)
- [getService](quest_apis_npc_npc_class.Npc.md#getservice)
- [loadDatabase](quest_apis_npc_npc_class.Npc.md#loaddatabase)
- [patch](quest_apis_npc_npc_class.Npc.md#patch)
- [patchData](quest_apis_npc_npc_class.Npc.md#patchdata)
- [patchMultipleData](quest_apis_npc_npc_class.Npc.md#patchmultipledata)
- [remove](quest_apis_npc_npc_class.Npc.md#remove)
- [update](quest_apis_npc_npc_class.Npc.md#update)

## Constructors

### constructor

• **new Npc**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/quest_apis/npc/npc.class.ts:32](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/npc/npc.class.ts#L32)

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

▸ **create**(`data`): `Promise`<`any`\>

Npc Item

**`remarks`**
This method is part of the Create Npc
- Request Type - POST
- Access - Admin
- End Point - API_URL/npc

**`requires`** - authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

- {
             status: 'success',
             data:{
              "id": "gy-gyc-bob-shop",
              "name": "Bob",
              "type": "shopkeeper",
              "description": "I give quests and sell wares.",
              "idleText": [
                  "Hmph, where did I put that fork?",
                  "I really wish it would rain.",
                  "I do love butterflies."
              ],
              "interactiveText": [],
              "tags": {
                  "questId": "gy-gyc-bob-shop-fetch-sticks"
              }
          }  or  { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/quest_apis/npc/npc.class.ts:80](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/npc/npc.class.ts#L80)

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

▸ **find**(`params?`): `Promise`<`any`\>

Returns the Npc list

**`remarks`**
This method is part of the get list of Npc
- Request Type - GET
- Access - Admin
- End Point - API_URL/npc?per_page=10&page=1

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

- Paginated Quest item list { data:[{...},{...}],current_page:1,per_page:10,total_pages:1,total_entries:5}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/quest_apis/npc/npc.class.ts:228](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/npc/npc.class.ts#L228)

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

▸ **get**(`id`): `Promise`<`any`\>

Get Npc

**`remarks`**
This method is part of the get Npc
- Request Type - GET
- Access - Admin
- End Point - API_URL/npc/{:npcId}

**`requires`** - authentication

**`requires`** @param npcId - pass npcId as a url param

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |

#### Returns

`Promise`<`any`\>

- {
             status: 'success',
             data:{
                           "id": "gy-gyc-bob-shop",
              "name": "Bob",
              "type": "shopkeeper",
              "description": "I give quests and sell wares.",
              "idleText": [
                  "Hmph, where did I put that fork?",
                  "I really wish it would rain.",
                  "I do love butterflies."
              ],
              "interactiveText": [],
              "tags": {
                  "questId": "gy-gyc-bob-shop-fetch-sticks"
              }
          }  or  { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.get

#### Defined in

[src/services/quest_apis/npc/npc.class.ts:205](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/npc/npc.class.ts#L205)

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

▸ **patch**(`id`, `data`): `Promise`<`any`\>

Edit Ncp

**`remarks`**
This method is part of the edit Ncp
- Request Type - PATCH
- Access - Admin
- End Point - API_URL/ncp/{:ncpId}

**`requires`** - authentication

**`requires`** @param ncpId - pass ncpId as a url param

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

- {
             status: 'success',
             data:{
              "id": "gy-gyc-bob-shop",
              "name": "Bob",
              "type": "shopkeeper",
              "description": "I give quests and sell wares.",
              "idleText": [
                  "Hmph, where did I put that fork?",
                  "I really wish it would rain.",
                  "I do love butterflies."
              ],
              "interactiveText": [],
              "tags": {
                  "questId": "gy-gyc-bob-shop-fetch-sticks"
              }
          }  or  { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/quest_apis/npc/npc.class.ts:157](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/npc/npc.class.ts#L157)

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
