[goobie-verse](../README.md) / [Modules](../modules.md) / [media/file-browser/file-browser.class](../modules/media_file_browser_file_browser_class.md) / FileBrowserService

# Class: FileBrowserService

[media/file-browser/file-browser.class](../modules/media_file_browser_file_browser_class.md).FileBrowserService

FileBrowserService.

## Hierarchy

- `DatabaseService`

  ↳ **`FileBrowserService`**

## Table of contents

### Constructors

- [constructor](media_file_browser_file_browser_class.FileBrowserService.md#constructor)

### Properties

- [store](media_file_browser_file_browser_class.FileBrowserService.md#store)

### Methods

- [create](media_file_browser_file_browser_class.FileBrowserService.md#create)
- [find](media_file_browser_file_browser_class.FileBrowserService.md#find)
- [get](media_file_browser_file_browser_class.FileBrowserService.md#get)
- [patch](media_file_browser_file_browser_class.FileBrowserService.md#patch)
- [remove](media_file_browser_file_browser_class.FileBrowserService.md#remove)
- [update](media_file_browser_file_browser_class.FileBrowserService.md#update)

## Constructors

### constructor

• **new FileBrowserService**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/media/file-browser/file-browser.class.ts:39](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/file-browser/file-browser.class.ts#L39)

## Properties

### store

• **store**: `StorageProviderInterface`

#### Defined in

[src/services/media/file-browser/file-browser.class.ts:37](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/file-browser/file-browser.class.ts#L37)

## Methods

### create

▸ **create**(`directory`): `Promise`<`any`\>

Create a directory

#### Parameters

| Name | Type |
| :------ | :------ |
| `directory` | `any` |

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.create

#### Defined in

[src/services/media/file-browser/file-browser.class.ts:66](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/file-browser/file-browser.class.ts#L66)

___

### find

▸ **find**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.find

#### Defined in

[src/services/media/file-browser/file-browser.class.ts:44](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/file-browser/file-browser.class.ts#L44)

___

### get

▸ **get**(`directory`): `Promise`<`FileContentType`[]\>

Return the metadata for each file in a directory

#### Parameters

| Name | Type |
| :------ | :------ |
| `directory` | `string` |

#### Returns

`Promise`<`FileContentType`[]\>

#### Overrides

DatabaseService.get

#### Defined in

[src/services/media/file-browser/file-browser.class.ts:54](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/file-browser/file-browser.class.ts#L54)

___

### patch

▸ **patch**(`path`, `data`): `Promise`<`string`\>

Upload file

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |
| `data` | `PatchParams` |

#### Returns

`Promise`<`string`\>

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/media/file-browser/file-browser.class.ts:101](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/file-browser/file-browser.class.ts#L101)

___

### remove

▸ **remove**(`path`): `Promise`<`any`\>

Remove a directory

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.remove

#### Defined in

[src/services/media/file-browser/file-browser.class.ts:116](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/file-browser/file-browser.class.ts#L116)

___

### update

▸ **update**(`from`, `data`): `Promise`<`any`\>

Move content from one path to another

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `string` |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

#### Overrides

DatabaseService.update

#### Defined in

[src/services/media/file-browser/file-browser.class.ts:82](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/media/file-browser/file-browser.class.ts#L82)
