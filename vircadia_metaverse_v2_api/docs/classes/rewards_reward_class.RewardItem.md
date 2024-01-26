[goobie-verse](../README.md) / [Modules](../modules.md) / [rewards/reward.class](../modules/rewards_reward_class.md) / RewardItem

# Class: RewardItem

[rewards/reward.class](../modules/rewards_reward_class.md).RewardItem

Reward Item.

## Hierarchy

- `DatabaseService`

  ↳ **`RewardItem`**

## Table of contents

### Constructors

- [constructor](rewards_reward_class.RewardItem.md#constructor)

### Methods

- [create](rewards_reward_class.RewardItem.md#create)
- [find](rewards_reward_class.RewardItem.md#find)
- [get](rewards_reward_class.RewardItem.md#get)
- [patch](rewards_reward_class.RewardItem.md#patch)
- [remove](rewards_reward_class.RewardItem.md#remove)
- [updateArrayValues](rewards_reward_class.RewardItem.md#updatearrayvalues)

## Constructors

### constructor

• **new RewardItem**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/rewards/reward.class.ts:39](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/rewards/reward.class.ts#L39)

## Methods

### create

▸ **create**(`data`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.create

#### Defined in

[src/services/rewards/reward.class.ts:420](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/rewards/reward.class.ts#L420)

___

### find

▸ **find**(`params?`): `Promise`<`any`\>

Returns the Reward Items

**`remarks`**
This method is part of the get list of reward items
- Request Type - GET
- End Point - API_URL/reward-item

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

- Paginated reward item list { data:[{...},{...}], success:"true" }

#### Overrides

DatabaseService.find

#### Defined in

[src/services/rewards/reward.class.ts:64](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/rewards/reward.class.ts#L64)

___

### get

▸ **get**(`id`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.get

#### Defined in

[src/services/rewards/reward.class.ts:416](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/rewards/reward.class.ts#L416)

___

### patch

▸ **patch**(`id`, `data`, `params`): `Promise`<`any`\>

Edit Reward Item

**`remarks`**
This method is part of the edit Reward Item
- Request Type - PATCH
- End Point - API_URL/reward-item/{RewardItemId}

**`requires`** - authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `any` |
| `params` | `Params` |

#### Returns

`Promise`<`any`\>

- {status: 'success', data:{...}} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/rewards/reward.class.ts:245](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/rewards/reward.class.ts#L245)

___

### remove

▸ **remove**(`id`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.remove

#### Defined in

[src/services/rewards/reward.class.ts:426](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/rewards/reward.class.ts#L426)

___

### updateArrayValues

▸ **updateArrayValues**(`arr?`, `obj`): `Promise`<`unknown`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `arr` | `any`[] | `[]` |
| `obj` | `any` | `undefined` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[src/services/rewards/reward.class.ts:43](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/rewards/reward.class.ts#L43)
