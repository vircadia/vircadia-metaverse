[goobie-verse](../README.md) / [Modules](../modules.md) / [media/avatar/avatar.class](../modules/media_avatar_avatar_class.md) / Avatar

# Class: Avatar

[media/avatar/avatar.class](../modules/media_avatar_avatar_class.md).Avatar

Avatar.

## Hierarchy

- `DatabaseService`

  ↳ **`Avatar`**

## Table of contents

### Constructors

- [constructor](media_avatar_avatar_class.Avatar.md#constructor)

### Properties

- [application](media_avatar_avatar_class.Avatar.md#application)

### Methods

- [create](media_avatar_avatar_class.Avatar.md#create)
- [find](media_avatar_avatar_class.Avatar.md#find)
- [get](media_avatar_avatar_class.Avatar.md#get)

## Constructors

### constructor

• **new Avatar**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/media/avatar/avatar.class.ts:38](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/avatar/avatar.class.ts#L38)

## Properties

### application

• **application**: `Application`

#### Defined in

[src/services/media/avatar/avatar.class.ts:36](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/avatar/avatar.class.ts#L36)

## Methods

### create

▸ **create**(`data`, `params?`): `Promise`<{ `thumbnailURL`: `string`  }\>

Create Avatar

**`remarks`**
This method is part of the get Avatar list
- Request Type - POST
- End Point - API_URL/avatar

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `AvatarUploadArguments` |
| `params?` | `Params` |

#### Returns

`Promise`<{ `thumbnailURL`: `string`  }\>

- { "avatarURL": "https://digisomni-frankfurt-1.eu-central-1.linodeobjects.com/digisomni-frankfurt-1/avatars/21da78db-6ed6-495a-ae95-b0f67619e1f1/newAvatar1234.glb","thumbnailURL": "https://digisomni-frankfurt-1.eu-central-1.linodeobjects.com/digisomni-frankfurt-1/avatars/21da78db-6ed6-495a-ae95-b0f67619e1f1/newAvatar1234.png"}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/media/avatar/avatar.class.ts:97](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/avatar/avatar.class.ts#L97)

___

### find

▸ **find**(`params`): `Promise`<`any`\>

Returns the Avatar list

**`remarks`**
This method is part of the get Avatar list
- Request Type - GET
- End Point - API_URL/avatar

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Params` |

#### Returns

`Promise`<`any`\>

- {"status": "success", "data":[{ "avatarId":"","avatarURL":"","thumbnailURL":""}]}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/media/avatar/avatar.class.ts:77](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/avatar/avatar.class.ts#L77)

___

### get

▸ **get**(`name`, `params`): `Promise`<`any`\>

Returns the Avatar

**`remarks`**
This method is part of the get Avatar
- Request Type - GET
- End Point - API_URL/avatar/{avatarName}

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `params` | `Params` |

#### Returns

`Promise`<`any`\>

- {"status": "success", "data":{ "avatarId":"","avatarURL":"","thumbnailURL":""}}

#### Overrides

DatabaseService.get

#### Defined in

[src/services/media/avatar/avatar.class.ts:55](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/avatar/avatar.class.ts#L55)
