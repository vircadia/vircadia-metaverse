[goobie-verse](../README.md) / [Modules](../modules.md) / [location/location.class](../modules/location_location_class.md) / Location

# Class: Location

[location/location.class](../modules/location_location_class.md).Location

Location.

## Hierarchy

- `DatabaseService`

  ↳ **`Location`**

## Table of contents

### Constructors

- [constructor](location_location_class.Location.md#constructor)

### Methods

- [find](location_location_class.Location.md#find)
- [update](location_location_class.Location.md#update)

## Constructors

### constructor

• **new Location**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/location/location.class.ts:34](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/location/location.class.ts#L34)

## Methods

### find

▸ **find**(`params?`): `Promise`<`any`\>

GET location

**`remarks`**
This method is part of the get location
- Request Type - GET
- End Point - API_URL/location

**`requires`** -authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `any` |

#### Returns

`Promise`<`any`\>

- {"status": "success","data": {"location": { "root": {"domain": {"id":"","network_address":"","network_port":"","ice_server_address":"","name":""},"name": placeName,},"path": "/X,Y,Z/X,Y,Z,W","online": bool}}} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/location/location.class.ts:137](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/location/location.class.ts#L137)

___

### update

▸ **update**(`id`, `data`, `params`): `Promise`<`any`\>

Update location

**`remarks`**
This method is part of the update location
- Request Type - PUT
- End Point - API_URL/location

**`requires`** -authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `any` |
| `params` | `any` |

#### Returns

`Promise`<`any`\>

-     {"status": "success","data": {"location": { "root": {"domain": {"id":"","network_address":"","network_port":"","ice_server_address":"","name":""},"name": placeName,},"path": "/X,Y,Z/X,Y,Z,W","online": bool}}} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.update

#### Defined in

[src/services/location/location.class.ts:59](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/location/location.class.ts#L59)
