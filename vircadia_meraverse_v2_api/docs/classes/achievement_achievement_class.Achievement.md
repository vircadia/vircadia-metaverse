[goobie-verse](../README.md) / [Modules](../modules.md) / [achievement/achievement.class](../modules/achievement_achievement_class.md) / Achievement

# Class: Achievement

[achievement/achievement.class](../modules/achievement_achievement_class.md).Achievement

Achievement.

## Hierarchy

- `DatabaseService`

  ↳ **`Achievement`**

## Table of contents

### Constructors

- [constructor](achievement_achievement_class.Achievement.md#constructor)

### Methods

- [create](achievement_achievement_class.Achievement.md#create)
- [find](achievement_achievement_class.Achievement.md#find)
- [get](achievement_achievement_class.Achievement.md#get)
- [remove](achievement_achievement_class.Achievement.md#remove)

## Constructors

### constructor

• **new Achievement**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/achievement/achievement.class.ts:34](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/achievement/achievement.class.ts#L34)

## Methods

### create

▸ **create**(`data`): `Promise`<`any`\>

Returns the Achievement

**`remarks`**
This method is part of the create Achievement
- Request Type - POST
- End Point - API_URL/achievement

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Partial`<`any`\> | Json request body { "achievementItemId":"","userId":""} |

#### Returns

`Promise`<`any`\>

-  Achievement Item{ "status": "success", "data":{...}}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/achievement/achievement.class.ts:123](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/achievement/achievement.class.ts#L123)

___

### find

▸ **find**(`params?`): `Promise`<`any`\>

Returns the User Achievements

**`remarks`**
This method is part of the get user Achievements
- Request Type - GET
- End Point - API_URL/achievement?userId=

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

-  Achievement { "status": "success", "data":[{"id": "","userId": "","item": {"id": "","icon": "","name": "","description": ""}}]}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/achievement/achievement.class.ts:50](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/achievement/achievement.class.ts#L50)

___

### get

▸ **get**(`id`): `Promise`<`any`\>

Returns the Achievement

**`remarks`**
This method is part of the get Achievement
- Request Type - GET
- End Point - API_URL/achievement/{achievementId}

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |

#### Returns

`Promise`<`any`\>

-  Achievement { "status": "success", "data":{"id": "","userId": "","item": {"id": "","icon": "","name": "","description": ""}}}

#### Overrides

DatabaseService.get

#### Defined in

[src/services/achievement/achievement.class.ts:97](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/achievement/achievement.class.ts#L97)

___

### remove

▸ **remove**(`id`, `params?`): `Promise`<`any`\>

Delete the Achievement

**`remarks`**
This method is part of the delete Achievement
- Request Type - DELETE
- End Point - API_URL/achievement/{id}

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `NullableId` | Achievement Item (url param) |
| `params?` | `Params` | - |

#### Returns

`Promise`<`any`\>

-  Achievement Item{ "status": "success", "data":{}}

- End Point - API_URL/achievement?achievementItemId=5ef1951f-bd96-441f-8873-172422b325dd&userId=764ef37c-c1da-475c-8d19-5c0590faaf61

#### Overrides

DatabaseService.remove

#### Defined in

[src/services/achievement/achievement.class.ts:180](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/achievement/achievement.class.ts#L180)
