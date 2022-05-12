[goobie-verse](../README.md) / [Modules](../modules.md) / [friends/friends.class](../modules/friends_friends_class.md) / Friends

# Class: Friends

[friends/friends.class](../modules/friends_friends_class.md).Friends

Friends.

## Hierarchy

- `DatabaseService`

  ↳ **`Friends`**

## Table of contents

### Constructors

- [constructor](friends_friends_class.Friends.md#constructor)

### Methods

- [create](friends_friends_class.Friends.md#create)
- [find](friends_friends_class.Friends.md#find)
- [remove](friends_friends_class.Friends.md#remove)

## Constructors

### constructor

• **new Friends**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/friends/friends.class.ts:34](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/friends/friends.class.ts#L34)

## Methods

### create

▸ **create**(`data`, `params?`): `Promise`<`any`\>

POST Friend

**`remarks`**
This method is part of the POST friend
- Set a user as a friend. The other user must already have a "connection" with this user.
- Request Type - POST
- End Point - API_URL/friends

**`requires`** -authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `params?` | `any` |

#### Returns

`Promise`<`any`\>

- {status: 'success', data:{...}} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/friends/friends.class.ts:53](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/friends/friends.class.ts#L53)

___

### find

▸ **find**(`params?`): `Promise`<`any`\>

GET Friend

**`remarks`**
Return a list of friends of the requesting account.
- Request Type - GET
- End Point - API_URL/friends

**`requires`** -authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `any` |

#### Returns

`Promise`<`any`\>

-  {"status": "success", "data": {"friends": [username,username,...]} or  { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/friends/friends.class.ts:90](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/friends/friends.class.ts#L90)

___

### remove

▸ **remove**(`userName`, `params?`): `Promise`<`any`\>

Delete Friend

**`remarks`**
This method is part of the delete friend
- Request Type - DELETE
- End Point - API_URL/friends/{username}

**`requires`** @param friend -username (URL param)

**`requires`** -authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `userName` | `NullableId` |
| `params?` | `any` |

#### Returns

`Promise`<`any`\>

- {status: 'success', data:{...}} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.remove

#### Defined in

[src/services/friends/friends.class.ts:114](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/friends/friends.class.ts#L114)
