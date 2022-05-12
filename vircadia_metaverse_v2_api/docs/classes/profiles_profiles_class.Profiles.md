[goobie-verse](../README.md) / [Modules](../modules.md) / [profiles/profiles.class](../modules/profiles_profiles_class.md) / Profiles

# Class: Profiles

[profiles/profiles.class](../modules/profiles_profiles_class.md).Profiles

Profiles.

## Hierarchy

- `DatabaseService`

  ↳ **`Profiles`**

## Table of contents

### Constructors

- [constructor](profiles_profiles_class.Profiles.md#constructor)

### Methods

- [find](profiles_profiles_class.Profiles.md#find)
- [get](profiles_profiles_class.Profiles.md#get)

## Constructors

### constructor

• **new Profiles**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/profiles/profiles.class.ts:39](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/profiles/profiles.class.ts#L39)

## Methods

### find

▸ **find**(`params?`): `Promise`<`any`\>

Returns the Profile

**`remarks`**
This method is part of the get list of profile
- Request Type - GET
- End Point - API_URL/profiles?per_page=10&page=1

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

- Paginated profiles { data:[{...},{...}],current_page:1,per_page:10,total_pages:1,total_entries:5}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/profiles/profiles.class.ts:57](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/profiles/profiles.class.ts#L57)

___

### get

▸ **get**(`id`): `Promise`<`any`\>

Returns the Profile

**`remarks`**
This method is part of the get profile
- Request Type - GET
- End Point - API_URL/profiles/{profileId}
- Access - Public, Owner, Admin

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |

#### Returns

`Promise`<`any`\>

- Profile { data:{...}}

#### Overrides

DatabaseService.get

#### Defined in

[src/services/profiles/profiles.class.ts:124](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/profiles/profiles.class.ts#L124)
