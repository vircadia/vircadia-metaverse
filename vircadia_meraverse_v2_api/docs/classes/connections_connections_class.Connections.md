[goobie-verse](../README.md) / [Modules](../modules.md) / [connections/connections.class](../modules/connections_connections_class.md) / Connections

# Class: Connections

[connections/connections.class](../modules/connections_connections_class.md).Connections

Connections.

## Hierarchy

- `DatabaseService`

  ↳ **`Connections`**

## Table of contents

### Constructors

- [constructor](connections_connections_class.Connections.md#constructor)

### Methods

- [create](connections_connections_class.Connections.md#create)
- [find](connections_connections_class.Connections.md#find)
- [remove](connections_connections_class.Connections.md#remove)

## Constructors

### constructor

• **new Connections**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/connections/connections.class.ts:39](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/connections/connections.class.ts#L39)

## Methods

### create

▸ **create**(`data`, `params?`): `Promise`<`any`\>

POST Connection

**`remarks`**
This method is part of the POST connection
- Request Type - POST
- End Point - API_URL/connections

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

[src/services/connections/connections.class.ts:57](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/connections/connections.class.ts#L57)

___

### find

▸ **find**(`params?`): `Promise`<`any`\>

GET Connection

**`remarks`**
This method is part of the get list of users and their connection
- Request Type - GET
- End Point - API_URL/connections

**`requires`** -authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `any` |

#### Returns

`Promise`<`any`\>

- { data:{user:[{...},{...}]},current_page:1,per_page:10,total_pages:1,total_entries:5}}, or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/connections/connections.class.ts:146](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/connections/connections.class.ts#L146)

___

### remove

▸ **remove**(`userName`, `params?`): `Promise`<`any`\>

Delete Connection

**`remarks`**
This method is part of the delete connection
- Request Type - DELETE
- End Point - API_URL/connections/{username}

**`requires`** @param acct -username (URL param)

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

[src/services/connections/connections.class.ts:104](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/connections/connections.class.ts#L104)
