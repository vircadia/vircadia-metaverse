//   Copyright 2020 Vircadia Contributors
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

import Joi from '@hapi/joi';
import { HookContext } from '@feathersjs/feathers';

const tags = {
    isQuestItem: Joi.boolean().required(),
    questId: Joi.string().trim().allow('').default(''),
};
const preRequirement = {
    minLevel: Joi.number().required(),
    maxLevel: Joi.number().required(),
    maxAvailable: Joi.number().required(),
    expireAfter: Joi.number().required(),
};
const id = Joi.string().trim();
const name = Joi.string().trim().min(2).max(50);
const description = Joi.string().trim();
const thumbnail = Joi.string().trim();
const url = Joi.string().trim();
const isNFT = Joi.boolean();
const isTransferable = Joi.boolean();
const itemType = Joi.string().trim();
const itemQuality = Joi.string();
const itemTags = Joi.object().keys(tags);
const itemStatus = Joi.object().default({});
const metaData = Joi.object().default({});
const prerequisites = Joi.object().keys(preRequirement);
export const createInventoryItemSchema = Joi.object().keys({
    id: id.required(),
    name: name.required(),
    description: description.required(),
    metaData: metaData,
    thumbnail: thumbnail.required(),
    url: url.required(),
    isNFT: isNFT.required(),
    isTransferable: isTransferable.required(),
    itemType: itemType.required(),
    itemQuality: itemQuality.required(),
    prerequisites: prerequisites.required(),
    itemStatus: itemStatus,
    itemTags: itemTags,
});

export const patchInventoryItemSchema = Joi.object().keys({
    name,
    description,
    metaData,
    thumbnail,
    url,
    isNFT,
    isTransferable,
    itemType,
    itemQuality,
    prerequisites,
    itemStatus,
    itemTags,
});

const per_page = Joi.number().integer().positive();
const page = Joi.number().integer().positive();

export const findInventoryItemSchema = Joi.object({
    per_page,
    page,
});

export const joiOptions = { convert: true, abortEarly: false };

export const joiReadOptions = {
    getContext(context: HookContext) {
        return context.params?.query ?? {};
    },
    setContext(context: HookContext, newValues: any) {
        Object.assign(context.params?.query ?? {}, newValues);
    },
    convert: true,
    abortEarly: false,
};
