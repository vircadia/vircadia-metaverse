[goobie-verse](../README.md) / [Modules](../modules.md) / [place/place.class](../modules/place_place_class.md) / Place

# Class: Place

[place/place.class](../modules/place_place_class.md).Place

Place.

## Hierarchy

- `DatabaseService`

  ↳ **`Place`**

## Table of contents

### Constructors

- [constructor](place_place_class.Place.md#constructor)

### Methods

- [create](place_place_class.Place.md#create)
- [find](place_place_class.Place.md#find)
- [get](place_place_class.Place.md#get)
- [patch](place_place_class.Place.md#patch)
- [remove](place_place_class.Place.md#remove)

## Constructors

### constructor

• **new Place**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/place/place.class.ts:49](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/place/place.class.ts#L49)

## Methods

### create

▸ **create**(`data`, `params`): `Promise`<`any`\>

POST place

**`remarks`**
This method is part of the POST place
- Create a place entry. A place points to a domain so creation information contains a domainId of the domain the place points to.
- The address is formatted as "/x,y,z/x,y,z,w".
- Request Type - POST
- End Point - API_URL/place
- Access - DomainAccess , Admin
- The requestor must be either an admin account or the account associated with the domain.

**`requires`** -authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `params` | `any` |

#### Returns

`Promise`<`any`\>

- {"status": "success","data": {"places": [{"placeId": string,"name": string,"displayName": string,"visibility": string,"path": string,"address": string,"description": string,"maturity": string,"tags": string[],"managers": string[],"domain": {"id": domainId,"name": domainName,"sponsorAccountId": string,"network_address": string,"ice_server_address": string,'version': string,'protocol_version': string,'active': boolean,"time_of_last_heartbeat": ISOStringDate,"time_of_last_heartbeat_s": integerUnixTimeSeconds,"num_users": integer},"thumbnail": URL,"images": [ URL, URL, ... ],"current_attendance": number,"current_images": string[],"current_info": string,"current_last_update_time": ISOStringDate,"current_last_update_time_s": integerUnixTimeSeconds},...],"maturity-categories": string[]}} or  { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/place/place.class.ts:71](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/place/place.class.ts#L71)

___

### find

▸ **find**(`params`): `Promise`<`any`\>

GET all place

**`remarks`**
Get the list of places. Returns all the places.
- Request Type - GET
- End Point - API_URL/place

**`params`** order - ascending or decending

**`params`** maturity - adult or unrated or everyone or teen or mature

**`params`** tag - get places that have specified tags - (it can , separated).

**`params`** search - placeName

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Params` |

#### Returns

`Promise`<`any`\>

- {"status": "success","data": {"places": [{"placeId": string,"name": string,"displayName": string,"visibility": string,"path": string,"address": string,"description": string,"maturity": string,"tags": string[],"managers": string[],"domain": {"id": domainId,"name": domainName,"sponsorAccountId": string,"network_address": string,"ice_server_address": string,'version': string,'protocol_version': string,'active': boolean,"time_of_last_heartbeat": ISOStringDate,"time_of_last_heartbeat_s": integerUnixTimeSeconds,"num_users": integer},"thumbnail": URL,"images": [ URL, URL, ... ],"current_attendance": number,"current_images": string[],"current_info": string,"current_last_update_time": ISOStringDate,"current_last_update_time_s": integerUnixTimeSeconds},...],"maturity-categories": string[]}} or  { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/place/place.class.ts:296](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/place/place.class.ts#L296)

___

### get

▸ **get**(`id`): `Promise`<`any`\>

GET place

**`remarks`**
Get the place information for one place.
- Request Type - GET
- End Point - API_URL/place/{placeId}
- Access - DomainAccess , Admin
- The requestor must be either an admin account or the account associated with the domain.

**`requires`** @param placeId - Place id (Url param)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |

#### Returns

`Promise`<`any`\>

- {"status": "success","data": {"places": [{"placeId": string,"name": string,"displayName": string,"visibility": string,"path": string,"address": string,"description": string,"maturity": string,"tags": string[],"managers": string[],"domain": {"id": domainId,"name": domainName,"sponsorAccountId": string,"network_address": string,"ice_server_address": string,'version': string,'protocol_version': string,'active': boolean,"time_of_last_heartbeat": ISOStringDate,"time_of_last_heartbeat_s": integerUnixTimeSeconds,"num_users": integer},"thumbnail": URL,"images": [ URL, URL, ... ],"current_attendance": number,"current_images": string[],"current_info": string,"current_last_update_time": ISOStringDate,"current_last_update_time_s": integerUnixTimeSeconds},...],"maturity-categories": string[]}} or  { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.get

#### Defined in

[src/services/place/place.class.ts:161](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/place/place.class.ts#L161)

___

### patch

▸ **patch**(`id`, `data`, `params`): `Promise`<`any`\>

Update place

**`remarks`**
Update the place information.
- If the field "place.pointee_query" is passed, that is presumed to be the ID of the domain that should be associated with the Place.
- Request Type - Update
- End Point - API_URL/place/{placeId}
- Access - DomainAccess , Admin
- The requestor must be either an admin account or the account associated with the domain.

**`requires`** @param placeId - Place id (Url param)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |
| `data` | `any` |
| `params` | `Params` |

#### Returns

`Promise`<`any`\>

- {"status": "success"} or  { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/place/place.class.ts:235](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/place/place.class.ts#L235)

___

### remove

▸ **remove**(`id`, `params`): `Promise`<`any`\>

Delete Place

**`remarks`**
This method is part of the delete place
- Delete the place entry.
- The requestor must be either an admin account or the account associated with the domain.
- Request Type - DELETE
- End Point - API_URL/place/{placeId}
- Access - DomainAccess , Admin

**`requires`** @param acct  Place id (Url param)

**`requires`** -authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `params` | `any` |

#### Returns

`Promise`<`any`\>

- {status: 'success'} or { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.remove

#### Defined in

[src/services/place/place.class.ts:204](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/place/place.class.ts#L204)
