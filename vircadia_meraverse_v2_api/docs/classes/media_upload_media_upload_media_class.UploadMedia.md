[goobie-verse](../README.md) / [Modules](../modules.md) / [media/upload-media/upload-media.class](../modules/media_upload_media_upload_media_class.md) / UploadMedia

# Class: UploadMedia

[media/upload-media/upload-media.class](../modules/media_upload_media_upload_media_class.md).UploadMedia

UploadMedia.

## Implements

- `ServiceMethods`<`Data`\>

## Table of contents

### Constructors

- [constructor](media_upload_media_upload_media_class.UploadMedia.md#constructor)

### Properties

- [app](media_upload_media_upload_media_class.UploadMedia.md#app)
- [options](media_upload_media_upload_media_class.UploadMedia.md#options)

### Methods

- [create](media_upload_media_upload_media_class.UploadMedia.md#create)
- [find](media_upload_media_upload_media_class.UploadMedia.md#find)
- [get](media_upload_media_upload_media_class.UploadMedia.md#get)
- [patch](media_upload_media_upload_media_class.UploadMedia.md#patch)
- [remove](media_upload_media_upload_media_class.UploadMedia.md#remove)
- [update](media_upload_media_upload_media_class.UploadMedia.md#update)

## Constructors

### constructor

• **new UploadMedia**(`options?`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `ServiceOptions` |
| `app` | `Application` |

#### Defined in

[src/services/media/upload-media/upload-media.class.ts:32](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/upload-media/upload-media.class.ts#L32)

## Properties

### app

• **app**: `Application`

#### Defined in

[src/services/media/upload-media/upload-media.class.ts:29](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/upload-media/upload-media.class.ts#L29)

___

### options

• **options**: `ServiceOptions`

#### Defined in

[src/services/media/upload-media/upload-media.class.ts:30](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/upload-media/upload-media.class.ts#L30)

## Methods

### create

▸ **create**(`data`, `params`): `Promise`<`Data`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Data` |
| `params` | `Params` |

#### Returns

`Promise`<`Data`\>

#### Implementation of

ServiceMethods.create

#### Defined in

[src/services/media/upload-media/upload-media.class.ts:45](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/upload-media/upload-media.class.ts#L45)

___

### find

▸ **find**(`params`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Params` |

#### Returns

`Promise`<`any`\>

#### Implementation of

ServiceMethods.find

#### Defined in

[src/services/media/upload-media/upload-media.class.ts:37](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/upload-media/upload-media.class.ts#L37)

___

### get

▸ **get**(`id`, `params`): `Promise`<`Data`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |
| `params` | `Params` |

#### Returns

`Promise`<`Data`\>

#### Implementation of

ServiceMethods.get

#### Defined in

[src/services/media/upload-media/upload-media.class.ts:41](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/upload-media/upload-media.class.ts#L41)

___

### patch

▸ **patch**(`id`, `data`, `params`): `Promise`<`Data`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `Data` |
| `params` | `Params` |

#### Returns

`Promise`<`Data`\>

#### Implementation of

ServiceMethods.patch

#### Defined in

[src/services/media/upload-media/upload-media.class.ts:59](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/upload-media/upload-media.class.ts#L59)

___

### remove

▸ **remove**(`id`, `params`): `Promise`<`Data`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `params` | `Params` |

#### Returns

`Promise`<`Data`\>

#### Implementation of

ServiceMethods.remove

#### Defined in

[src/services/media/upload-media/upload-media.class.ts:63](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/upload-media/upload-media.class.ts#L63)

___

### update

▸ **update**(`id`, `data`, `params`): `Promise`<`Data`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `Data` |
| `params` | `Params` |

#### Returns

`Promise`<`Data`\>

#### Implementation of

ServiceMethods.update

#### Defined in

[src/services/media/upload-media/upload-media.class.ts:55](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/upload-media/upload-media.class.ts#L55)
