[goobie-verse](../README.md) / [Modules](../modules.md) / [users/users.class](../modules/users_users_class.md) / Users

# Class: Users

[users/users.class](../modules/users_users_class.md).Users

Users.

## Hierarchy

- `DatabaseService`

  ↳ **`Users`**

## Table of contents

### Constructors

- [constructor](users_users_class.Users.md#constructor)

### Properties

- [application](users_users_class.Users.md#application)

### Methods

- [create](users_users_class.Users.md#create)
- [find](users_users_class.Users.md#find)

## Constructors

### constructor

• **new Users**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/users/users.class.ts:58](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/users/users.class.ts#L58)

## Properties

### application

• **application**: `Application`

#### Defined in

[src/services/users/users.class.ts:56](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/users/users.class.ts#L56)

## Methods

### create

▸ **create**(`data`): `Promise`<`any`\>

Create User

**`remarks`**
This method is part of the create user
- Request Type - POST
- End Point - API_URL/users

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

- {"status": "success","data": {
               accountId: '',
               username: '',
               accountIsActive: false,
               accountWaitingVerification: true,
           }}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/users/users.class.ts:89](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/users/users.class.ts#L89)

___

### find

▸ **find**(`params?`): `Promise`<`any`\>

Returns the Users

**`remarks`**
This method is part of the get list of users
- Request Type - GET
- End Point - API_URL/users?per_page=10&filter=friends&status=online ....

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

- Paginated users: { data:{users:[{...},{...}]},current_page:1,per_page:10,total_pages:1,total_entries:5}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/users/users.class.ts:312](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/users/users.class.ts#L312)
