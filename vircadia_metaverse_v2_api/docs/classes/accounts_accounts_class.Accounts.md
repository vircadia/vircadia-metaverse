[goobie-verse](../README.md) / [Modules](../modules.md) / [accounts/accounts.class](../modules/accounts_accounts_class.md) / Accounts

# Class: Accounts

[accounts/accounts.class](../modules/accounts_accounts_class.md).Accounts

Accounts.

## Hierarchy

- `DatabaseService`

  ↳ **`Accounts`**

## Table of contents

### Constructors

- [constructor](accounts_accounts_class.Accounts.md#constructor)

### Methods

- [find](accounts_accounts_class.Accounts.md#find)
- [get](accounts_accounts_class.Accounts.md#get)
- [patch](accounts_accounts_class.Accounts.md#patch)
- [remove](accounts_accounts_class.Accounts.md#remove)

## Constructors

### constructor

• **new Accounts**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/accounts/accounts.class.ts:48](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/accounts/accounts.class.ts#L48)

## Methods

### find

▸ **find**(`params?`): `Promise`<`any`\>

Returns the Accounts

**`remarks`**
This method is part of the get list of accounts
- Request Type - GET
- End Point - API_URL/accounts?per_page=10&page=1 ....

**`optional`** @param per_page - page size

**`optional`** @param page - page number

**`optional`** @param filter - Connections|friends|all

**`optional`** @param status - Online|domainId

**`optional`** @param search - WildcardSearchString

**`optional`** @param acct - Account id

**`optional`** @param asAdmin - true | false if logged in account is administrator, list all accounts. Value is optional.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

- Paginated accounts { data:[{...},{...}],current_page:1,per_page:10,total_pages:1,total_entries:5}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/accounts/accounts.class.ts:85](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/accounts/accounts.class.ts#L85)

___

### get

▸ **get**(`id`): `Promise`<`any`\>

Returns the Account

**`remarks`**
This method is part of the get account
- Request Type - GET
- End Point - API_URL/accounts/{accountId}
- Access - Public, Owner, Admin

**`required`** @param accountId - Account id (Url param)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |

#### Returns

`Promise`<`any`\>

- Account { data:{account{...}}}

#### Overrides

DatabaseService.get

#### Defined in

[src/services/accounts/accounts.class.ts:232](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/accounts/accounts.class.ts#L232)

___

### patch

▸ **patch**(`id`, `data`, `params`): `Promise`<`any`\>

Patch Account

**`remarks`**
This method is part of the patch account
- Request Type - PATCH
- End Point - API_URL/accounts/{accountId}

**`requires`** @param acct - Account id (URL param)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `any` |
| `params` | `Params` |

#### Returns

`Promise`<`any`\>

- {status: 'success' data:{...}} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/accounts/accounts.class.ts:261](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/accounts/accounts.class.ts#L261)

___

### remove

▸ **remove**(`id`): `Promise`<`any`\>

Delete Account

**`remarks`**
This method is part of the delete account
- Request Type - DELETE
- End Point - API_URL/accounts/{accountId}
- Access: Admin only

**`requires`** @param acct - Account id (URL param)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |

#### Returns

`Promise`<`any`\>

- {status: 'success'} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.remove

#### Defined in

[src/services/accounts/accounts.class.ts:346](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/accounts/accounts.class.ts#L346)
