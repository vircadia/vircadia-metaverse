[goobie-verse](../README.md) / [Modules](../modules.md) / [current/current.class](../modules/current_current_class.md) / Current

# Class: Current

[current/current.class](../modules/current_current_class.md).Current

Current.

## Hierarchy

- `DatabaseService`

  ↳ **`Current`**

## Table of contents

### Constructors

- [constructor](current_current_class.Current.md#constructor)

### Methods

- [create](current_current_class.Current.md#create)

## Constructors

### constructor

• **new Current**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/current/current.class.ts:35](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/current/current.class.ts#L35)

## Methods

### create

▸ **create**(`data`): `Promise`<`any`\>

POST Current Place

**`remarks`**
This method is part of the POST current place
- Request Type - POST
- End Point - API_URL/current

**`requires`** current -placeId and current_api_key

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

- {status: 'success'} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/current/current.class.ts:53](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/current/current.class.ts#L53)
