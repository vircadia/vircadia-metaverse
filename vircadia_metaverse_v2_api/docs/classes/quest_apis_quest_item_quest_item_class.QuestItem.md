[goobie-verse](../README.md) / [Modules](../modules.md) / [quest\_apis/quest-item/quest-item.class](../modules/quest_apis_quest_item_quest_item_class.md) / QuestItem

# Class: QuestItem

[quest_apis/quest-item/quest-item.class](../modules/quest_apis_quest_item_quest_item_class.md).QuestItem

Quest Item.

## Hierarchy

- `DatabaseService`

  ↳ **`QuestItem`**

## Table of contents

### Constructors

- [constructor](quest_apis_quest_item_quest_item_class.QuestItem.md#constructor)

### Methods

- [create](quest_apis_quest_item_quest_item_class.QuestItem.md#create)
- [find](quest_apis_quest_item_quest_item_class.QuestItem.md#find)
- [get](quest_apis_quest_item_quest_item_class.QuestItem.md#get)
- [patch](quest_apis_quest_item_quest_item_class.QuestItem.md#patch)

## Constructors

### constructor

• **new QuestItem**(`options`, `app`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `Partial`<`DatabaseServiceOptions`\> |
| `app` | `Application` |

#### Overrides

DatabaseService.constructor

#### Defined in

[src/services/quest_apis/quest-item/quest-item.class.ts:36](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest-item/quest-item.class.ts#L36)

## Methods

### create

▸ **create**(`data`): `Promise`<`any`\>

Create Quest Item

**`remarks`**
This method is part of the Create Quest Item
- Request Type - POST
- Access - Admin
- End Point - API_URL/quest-item

**`requires`** - authentication

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

- {
             status: 'success',
             data:{
                 "id": "gy-gyc-bob-shop-fetch-sticks",
                  "name": "A sticky situation.",
                  "giver": "gy-gyc-bob-shop",
                  "description":"A sticky situation.",
                  "dialogue": {
                      "0": [
                          [
                              "player",
                              "Hello!"
                          ],
                          [
                              "npc",
                              "Oh no... This isn't good."
                          ],
                          [
                              "player",
                              "What's the matter?"
                          ],
                          [
                              "npc",
                              "I can't find my bundle of sticks that I was going to use to make an elixir."
                          ],
                          [
                              "player",
                              "Oh, I'm sorry to hear that."
                          ],
                          [
                              "npc",
                              "Can you perhaps help me?"
                          ],
                          [
                              "prompt",
                              "Sure.",
                              "1",
                              "I'd rather not.",
                              "2"
                          ]
                      ],
                      "1": [
                          [
                              "quest",
                              "accept"
                          ],
                          [
                              "npc",
                              "Awesome, fetch me 5 branches and I will reward you handsomely."
                          ],
                          [
                              "player",
                              "Okay."
                          ]
                      ],
                      "2": [
                          [
                              "quest",
                              "deny"
                          ],
                          [
                              "npc",
                              "Oh well... *sigh*"
                          ]
                      ]
                  },
                  "itemRequirements": {
                      "items": [
                          {
                              "itemId": "regular-stick",
                              "qty": 5
                          }
                      ]
                  },
                  "npcRequirements": {},
                  "miniGameRequirements": {},
                  "rewards": [
                      {
                          "itemId": "basic-elixir-of-health",
                          "qty": 1
                      },
                      {
                          "xp": 500
                      },
                      {
                          "goo": 5
                      }
                  ],
                  "prerequisites": {
                      "minLevel": 1,
                      "maxLevel": 3,
                      "maxActive": 1,
                      "expireAfter": 500000,
                      "maxSimultaneous": 5
                  }
              }  or  { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.create

#### Defined in

[src/services/quest_apis/quest-item/quest-item.class.ts:242](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest-item/quest-item.class.ts#L242)

___

### find

▸ **find**(`params?`): `Promise`<`any`\>

Returns the Quest Items

**`remarks`**
This method is part of the get list of Quest items
- Request Type - GET
- Access - Admin
- End Point - API_URL/quest-item?per_page=10&page=1

#### Parameters

| Name | Type |
| :------ | :------ |
| `params?` | `Params` |

#### Returns

`Promise`<`any`\>

- Paginated Quest item list { data:[{...},{...}],current_page:1,per_page:10,total_pages:1,total_entries:5}

#### Overrides

DatabaseService.find

#### Defined in

[src/services/quest_apis/quest-item/quest-item.class.ts:522](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest-item/quest-item.class.ts#L522)

___

### get

▸ **get**(`id`): `Promise`<`any`\>

Get Quest Item

**`remarks`**
This method is part of the get Quest Item
- Request Type - GET
- End Point - API_URL/quest-item/{:questId}

**`requires`** - authentication

**`requires`** @param questId - pass questId as a url param

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Id` |

#### Returns

`Promise`<`any`\>

- { status: 'success', data:{...}  or  { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.get

#### Defined in

[src/services/quest_apis/quest-item/quest-item.class.ts:494](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest-item/quest-item.class.ts#L494)

___

### patch

▸ **patch**(`id`, `data`): `Promise`<`any`\>

Edit Quest Item

**`remarks`**
This method is part of the edit Quest Item
- Request Type - PATCH
- Access - Admin
- End Point - API_URL/quest-item/{:questId}

**`requires`** - authentication

**`requires`** @param questId - pass questId as a url param

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `NullableId` |
| `data` | `any` |

#### Returns

`Promise`<`any`\>

- {
             status: 'success',
             data:{
                  "id": "gy-gyc-bob-shop-fetch-sticks",
                  "name": "A sticky situation.",
                  "giver": "gy-gyc-bob-shop",
                  "description":"A sticky situation.",
                  "dialogue": {
                      "0": [
                          [
                              "player",
                              "Hello!"
                          ],
                          [
                              "npc",
                              "Oh no... This isn't good."
                          ],
                          [
                              "player",
                              "What's the matter?"
                          ],
                          [
                              "npc",
                              "I can't find my bundle of sticks that I was going to use to make an elixir."
                          ],
                          [
                              "player",
                              "Oh, I'm sorry to hear that."
                          ],
                          [
                              "npc",
                              "Can you perhaps help me?"
                          ],
                          [
                              "prompt",
                              "Sure.",
                              "1",
                              "I'd rather not.",
                              "2"
                          ]
                      ],
                      "1": [
                          [
                              "quest",
                              "accept"
                          ],
                          [
                              "npc",
                              "Awesome, fetch me 5 branches and I will reward you handsomely."
                          ],
                          [
                              "player",
                              "Okay."
                          ]
                      ],
                      "2": [
                          [
                              "quest",
                              "deny"
                          ],
                          [
                              "npc",
                              "Oh well... *sigh*"
                          ]
                      ]
                  },
                  "itemRequirements": {
                      "items": [
                          {
                              "itemId": "regular-stick",
                              "qty": 5
                          }
                      ]
                  },
                  "npcRequirements": {},
                  "miniGameRequirements": {},
                  "rewards": [
                      {
                          "itemId": "basic-elixir-of-health",
                          "qty": 1
                      },
                      {
                          "xp": 500
                      },
                      {
                          "goo": 5
                      }
                  ],
                  "prerequisites": {
                      "minLevel": 1,
                      "maxLevel": 3,
                      "maxActive": 1,
                      "expireAfter": 500000,
                      "maxSimultaneous": 5
                  }
              }  or  { status: 'failure', message: 'message'}

#### Overrides

DatabaseService.patch

#### Defined in

[src/services/quest_apis/quest-item/quest-item.class.ts:465](https://github.com/digisomni-syndicate/vircadia-metaverse-v2/blob/4467f0e/src/services/quest_apis/quest-item/quest-item.class.ts#L465)
