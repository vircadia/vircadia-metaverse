[goobie-verse](../README.md) / [Modules](../modules.md) / [achievement-items/achievement-items.class](../modules/achievement_items_achievement_items_class.md) / AchievementItems

# Class: AchievementItems

[achievement-items/achievement-items.class](../modules/achievement_items_achievement_items_class.md).AchievementItems

AchievementItems.

## Hierarchy

- `DatabaseService`

  ↳ **`AchievementItems`**

## Table of contents

### Constructors

- [constructor](achievement_items_achievement_items_class.AchievementItems.md#constructor)

### Methods

- [create](achievement_items_achievement_items_class.AchievementItems.md#create)
- [find](achievement_items_achievement_items_class.AchievementItems.md#find)
- [get](achievement_items_achievement_items_class.AchievementItems.md#get)
- [patch](achievement_items_achievement_items_class.AchievementItems.md#patch)
- [remove](achievement_items_achievement_items_class.AchievementItems.md#remove)

## Constructors

### constructor

• **new AchievementItems**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/achievement-items/achievement-items.class.ts:37](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/achievement-items/achievement-items.class.ts#L37)

## Methods

### create

▸ **create**(`data`): `Promise`<`any`\>

Returns the Achievement Item

**`remarks`**
This method is part of the create Achievement Item
- Request Type - POST
- End Point - API_URL/achievement-items

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Partial`<`any`\> | Json request body { "icon":"url","name":"name","description":"description"} |

#### Returns

`Promise`<`any`\>

-  Achievement Item{ "status": "success", "data":{...}}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/achievement-items/achievement-items.class.ts:124](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/achievement-items/achievement-items.class.ts#L124)

___

### find

▸ **find**(`params?`): `Promise`<`any`\>

Returns the Achievement Items

**`remarks`**
This method is part of the get list of Achievement Items
- Request Type - GET
- End Point - API_URL/achievement-items?per_page=10&page=1 ....

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

- Paginated Achievement Items { "status": "success", "data":[{...},{...}],current_page:1,per_page:10,total_pages:1,total_entries:5}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/achievement-items/achievement-items.class.ts:55](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/achievement-items/achievement-items.class.ts#L55)

___

### get

▸ **get**(`id`): `Promise`<`any`\>

Returns the Achievement Item

**`remarks`**
This method is part of the get Achievement Item
- Request Type - GET
- End Point - API_URL/achievement-items/{itemId}

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |

#### Returns

`Promise`<`any`\>

-  Achievement Item{ "status": "success", "data":{...}}

#### Overrides

DatabaseService.get

#### Defined in

[src/services/achievement-items/achievement-items.class.ts:96](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/achievement-items/achievement-items.class.ts#L96)

___

### patch

▸ **patch**(`id`, `data`): `Promise`<`any`\>

Returns the Achievement Item

**`remarks`**
This method is part of the create Achievement Item
- Request Type - PATCH
- End Point - API_URL/achievement-items/{id}

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `NullableId` | Achievement Item (url param) |
| `data` | `Partial`<`any`\> | Json request body { "icon":"url","name":"name","description":"description"} |

#### Returns

`Promise`<`any`\>

-  Achievement Item{ "status": "success", "data":{...}}

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/achievement-items/achievement-items.class.ts:155](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/achievement-items/achievement-items.class.ts#L155)

___

### remove

▸ **remove**(`id`): `Promise`<`any`\>

Delete the Achievement Item

**`remarks`**
This method is part of the delete Achievement Item
- Request Type - DELETE
- End Point - API_URL/achievement-items/{id}

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `NullableId` | Achievement Item (url param) |

#### Returns

`Promise`<`any`\>

-  Achievement Item{ "status": "success", "data":{}}

#### Overrides

DatabaseService.remove

#### Defined in

[src/services/achievement-items/achievement-items.class.ts:206](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/achievement-items/achievement-items.class.ts#L206)
