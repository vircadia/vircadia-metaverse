[goobie-verse](../README.md) / [Modules](../modules.md) / [domains/domains.class](../modules/domains_domains_class.md) / Domains

# Class: Domains

[domains/domains.class](../modules/domains_domains_class.md).Domains

Domains.

## Hierarchy

- `DatabaseService`

  ↳ **`Domains`**

## Table of contents

### Constructors

- [constructor](domains_domains_class.Domains.md#constructor)

### Methods

- [find](domains_domains_class.Domains.md#find)
- [get](domains_domains_class.Domains.md#get)
- [patch](domains_domains_class.Domains.md#patch)
- [remove](domains_domains_class.Domains.md#remove)

## Constructors

### constructor

• **new Domains**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/domains/domains.class.ts:40](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/domains/domains.class.ts#L40)

## Methods

### find

▸ **find**(`params?`): `Promise`<`any`\>

GET Domains

**`remarks`**
Return a list of domain.
- Request Type - GET
- End Point - API_URL/domains

**`requires`** -authentication

**`optional`** @param per_page - page size

**`optional`** @param page - page number

**`optional`** @param account - Account id

**`optional`** @param asAdmin - true | false if logged in account is administrator, list all accounts. Value is optional.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

-  {"status": "success", "data": {"domains": [{...},{...},...]} or  { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/domains/domains.class.ts:61](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/domains/domains.class.ts#L61)

___

### get

▸ **get**(`id`): `Promise`<`any`\>

Returns the domain

**`remarks`**
This method is part of the get domain
- Request Type - GET
- End Point - API_URL/domains/{domainId}

**`required`** @param domainsId - Domain id (Url param)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |

#### Returns

`Promise`<`any`\>

- domain { data:{domain{...}}}

#### Overrides

DatabaseService.get

#### Defined in

[src/services/domains/domains.class.ts:126](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/domains/domains.class.ts#L126)

___

### patch

▸ **patch**(`id`, `data`): `Promise`<`any`\>

Patch domain

**`remarks`**
This method is part of the edit domain
- Request Type - PATCH
- End Point - API_URL/domains/{domainId}

**`requires`** -authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

- {status: 'success', data:{...}} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/domains/domains.class.ts:167](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/domains/domains.class.ts#L167)

___

### remove

▸ **remove**(`id`): `Promise`<`any`\>

Delete domain

**`remarks`**
This method is part of the delete domain
- Request Type - DELETE
- End Point - API_URL/domains/{domainId}

**`requires`** -authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |

#### Returns

`Promise`<`any`\>

- {status: 'success', data:{...}} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.remove

#### Defined in

[src/services/domains/domains.class.ts:250](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/domains/domains.class.ts#L250)
