[goobie-verse](../README.md) / [Modules](../modules.md) / [quest\_apis/quest/quest.class](../modules/quest_apis_quest_quest_class.md) / Quest

# Class: Quest

[quest_apis/quest/quest.class](../modules/quest_apis_quest_quest_class.md).Quest

Quest.

## Hierarchy

- `DatabaseService`

  ↳ **`Quest`**

## Table of contents

### Constructors

- [constructor](quest_apis_quest_quest_class.Quest.md#constructor)

### Methods

- [abandonQuest](quest_apis_quest_quest_class.Quest.md#abandonquest)
- [acceptQuest](quest_apis_quest_quest_class.Quest.md#acceptquest)
- [completeQuest](quest_apis_quest_quest_class.Quest.md#completequest)
- [create](quest_apis_quest_quest_class.Quest.md#create)
- [find](quest_apis_quest_quest_class.Quest.md#find)
- [get](quest_apis_quest_quest_class.Quest.md#get)
- [isGooRewardInterface](quest_apis_quest_quest_class.Quest.md#isgoorewardinterface)
- [isRewardItemInterface](quest_apis_quest_quest_class.Quest.md#isrewarditeminterface)
- [isXpRewardInterface](quest_apis_quest_quest_class.Quest.md#isxprewardinterface)
- [patch](quest_apis_quest_quest_class.Quest.md#patch)
- [removeExpiredQuest](quest_apis_quest_quest_class.Quest.md#removeexpiredquest)

## Constructors

### constructor

• **new Quest**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/quest_apis/quest/quest.class.ts:44](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest/quest.class.ts#L44)

## Methods

### abandonQuest

▸ **abandonQuest**(`id`): `Promise`<`any`\>

Abandon

**`remarks`**
This method is part of abandon Quest
- Request Type - GET
- Access - Owner only
- End Point - API_URL/quest/{:questId}?status=abandon

**`required`** @param questId: url param

**`required`** @param status: url param

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |

#### Returns

`Promise`<`any`\>

- { "status":"success", "data":{...}}

#### Defined in

[src/services/quest_apis/quest/quest.class.ts:261](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest/quest.class.ts#L261)

___

### acceptQuest

▸ **acceptQuest**(`id`): `Promise`<`any`\>

Accept the Quest

**`remarks`**
This method is part of accept Quest
- Request Type - GET
- Access - Owner only
- End Point - API_URL/quest/{:questId}?status=accept

**`required`** @param questId: url param

**`required`** @param status: url param

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |

#### Returns

`Promise`<`any`\>

- { "status":"success", "data":{...}}

#### Defined in

[src/services/quest_apis/quest/quest.class.ts:241](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest/quest.class.ts#L241)

___

### completeQuest

▸ **completeQuest**(`id`, `questData`): `Promise`<`any`\>

Complete the Quest

**`remarks`**
This method is part of complere Quest
- Request Type - GET
- Access - Owner only
- End Point - API_URL/quest/{:questId}?status=complete

**`required`** @param questId: url param

**`required`** @param status: url param

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |
| `questData` | `QuestInterface` |

#### Returns

`Promise`<`any`\>

- { "status":"success", "data":{...}}

#### Defined in

[src/services/quest_apis/quest/quest.class.ts:281](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest/quest.class.ts#L281)

___

### create

▸ **create**(`data`): `Promise`<`any`\>

Create the Quest

**`remarks`**
This method is part of creat Quest
- Request Type - POST
- Access - Internal only
- End Point - API_URL/quest

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

[src/services/quest_apis/quest/quest.class.ts:61](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest/quest.class.ts#L61)

___

### find

▸ **find**(`params?`): `Promise`<`any`\>

Get the Quest

**`remarks`**
This method is part of get Quests
- Request Type - GET
- Access - Owner only
- End Point - API_URL/item-handler?ownerId=351b9b2a-1b87-4475-8b60-15945b46e443&questIds[]=1&questIds[]=2

**`required`** @param ownerId: url param

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

[src/services/quest_apis/quest/quest.class.ts:159](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest/quest.class.ts#L159)

___

### get

▸ **get**(`id`, `params?`): `Promise`<`any`\>

Get the Quest

**`remarks`**
This method is part of get Quest
- Request Type - GET
- Access - Owner only
- End Point - API_URL/quest/{:questId}

**`required`** @param questId: url param

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

[src/services/quest_apis/quest/quest.class.ts:122](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest/quest.class.ts#L122)

___

### isGooRewardInterface

▸ **isGooRewardInterface**(`item`): item is GooRewardInterface

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

item is GooRewardInterface

#### Defined in

[src/services/quest_apis/quest/quest.class.ts:404](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest/quest.class.ts#L404)

___

### isRewardItemInterface

▸ **isRewardItemInterface**(`item`): item is RewardItemInterface

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

item is RewardItemInterface

#### Defined in

[src/services/quest_apis/quest/quest.class.ts:400](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest/quest.class.ts#L400)

___

### isXpRewardInterface

▸ **isXpRewardInterface**(`item`): item is XpRewardInterface

#### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `any` |

#### Returns

item is XpRewardInterface

#### Defined in

[src/services/quest_apis/quest/quest.class.ts:408](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest/quest.class.ts#L408)

___

### patch

▸ **patch**(`id`, `data`): `Promise`<`any`\>

Patch the Quest

**`remarks`**
This method is part of patch Quest
- Request Type - PATCH
- Access - Internal only
- End Point - API_URL/quest/{:questId}

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

[src/services/quest_apis/quest/quest.class.ts:97](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest/quest.class.ts#L97)

___

### removeExpiredQuest

▸ **removeExpiredQuest**(): `Promise`<`void`\>

Remove Expired Quest

#### Returns

`Promise`<`void`\>

#### Defined in

[src/services/quest_apis/quest/quest.class.ts:220](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest/quest.class.ts#L220)
