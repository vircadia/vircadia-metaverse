[goobie-verse](../README.md) / [Modules](../modules.md) / [media/static-resource/static-resource.class](../modules/media_static_resource_static_resource_class.md) / StaticResource

# Class: StaticResource

[media/static-resource/static-resource.class](../modules/media_static_resource_static_resource_class.md).StaticResource

StaticResource.

## Hierarchy

- `DatabaseService`

  ↳ **`StaticResource`**

## Table of contents

### Constructors

- [constructor](media_static_resource_static_resource_class.StaticResource.md#constructor)

### Properties

- [docs](media_static_resource_static_resource_class.StaticResource.md#docs)

### Methods

- [create](media_static_resource_static_resource_class.StaticResource.md#create)
- [find](media_static_resource_static_resource_class.StaticResource.md#find)
- [get](media_static_resource_static_resource_class.StaticResource.md#get)
- [patch](media_static_resource_static_resource_class.StaticResource.md#patch)
- [remove](media_static_resource_static_resource_class.StaticResource.md#remove)

## Constructors

### constructor

• **new StaticResource**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/media/static-resource/static-resource.class.ts:34](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/static-resource/static-resource.class.ts#L34)

## Properties

### docs

• **docs**: `any`

#### Defined in

[src/services/media/static-resource/static-resource.class.ts:32](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/static-resource/static-resource.class.ts#L32)

## Methods

### create

▸ **create**(`data`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.create

#### Defined in

[src/services/media/static-resource/static-resource.class.ts:38](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/static-resource/static-resource.class.ts#L38)

___

### find

▸ **find**(`params`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Params` |

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.find

#### Defined in

[src/services/media/static-resource/static-resource.class.ts:61](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/static-resource/static-resource.class.ts#L61)

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

#### Overrides

DatabaseService.get

#### Defined in

[src/services/media/static-resource/static-resource.class.ts:88](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/static-resource/static-resource.class.ts#L88)

___

### patch

▸ **patch**(`id`, `data`, `params?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `any` |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/media/static-resource/static-resource.class.ts:92](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/static-resource/static-resource.class.ts#L92)

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

#### Overrides

DatabaseService.remove

#### Defined in

[src/services/media/static-resource/static-resource.class.ts:100](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/static-resource/static-resource.class.ts#L100)
