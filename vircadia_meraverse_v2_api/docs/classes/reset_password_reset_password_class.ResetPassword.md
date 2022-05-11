[goobie-verse](../README.md) / [Modules](../modules.md) / [reset-password/reset-password.class](../modules/reset_password_reset_password_class.md) / ResetPassword

# Class: ResetPassword

[reset-password/reset-password.class](../modules/reset_password_reset_password_class.md).ResetPassword

ResetPassword.

## Hierarchy

- `DatabaseService`

  ↳ **`ResetPassword`**

## Table of contents

### Constructors

- [constructor](reset_password_reset_password_class.ResetPassword.md#constructor)

### Properties

- [application](reset_password_reset_password_class.ResetPassword.md#application)

### Methods

- [create](reset_password_reset_password_class.ResetPassword.md#create)
- [patch](reset_password_reset_password_class.ResetPassword.md#patch)

## Constructors

### constructor

• **new ResetPassword**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/reset-password/reset-password.class.ts:37](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/reset-password/reset-password.class.ts#L37)

## Properties

### application

• **application**: `Application`

#### Defined in

[src/services/reset-password/reset-password.class.ts:36](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/reset-password/reset-password.class.ts#L36)

## Methods

### create

▸ **create**(`data`): `Promise`<`any`\>

Returns the reset password secret key

**`remarks`**
This method is part of the reset password
- Request Type - POST
- End Point - API_URL/reset-password

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

- {"status": "success","data": {"secretKey": ""}}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/reset-password/reset-password.class.ts:55](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/reset-password/reset-password.class.ts#L55)

___

### patch

▸ **patch**(`id`, `data?`): `Promise`<`any`\>

Reset user password

**`remarks`**
This method is part of the reset password
- Request Type - PATCH
- End Point - API_URL/reset-password

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data?` | `any` |

#### Returns

`Promise`<`any`\>

- {"status": "success","message": ""}

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/reset-password/reset-password.class.ts:136](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/reset-password/reset-password.class.ts#L136)
