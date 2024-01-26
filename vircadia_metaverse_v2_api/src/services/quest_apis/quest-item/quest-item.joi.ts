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

const itemSchema = {
    itemId: Joi.string().trim().required(),
    qty: Joi.number().integer().min(0).required(),
};

const ItemRequirementsSchema = {
    items: Joi.array().items(itemSchema),
};

const rewardSchema = {
    itemId: Joi.string().trim(),
    qty: Joi.number().integer().min(0),
    xp: Joi.number().integer().min(0),
    // goo: Joi.number().integer().min(0),
};

const prerequisitesData = {
    minLevel: Joi.number().integer().min(0).required(),
    maxLevel: Joi.number().integer().min(0).required(),
    expireAfter: Joi.number().integer().min(0).required(),
    maxActive: Joi.number().integer().min(0).required(),
    maxSimultaneous: Joi.number().integer().min(0).required(),
};

const id = Joi.string().trim();
const name = Joi.string().trim();
const description = Joi.string().trim();
const giver = Joi.string().trim();
const dialogue = Joi.object();
const prerequisites = Joi.object().keys(prerequisitesData);
const itemRequirements = Joi.object().keys(ItemRequirementsSchema).required();
const npcRequirements = Joi.object();
const miniGameRequirements = Joi.object();
const rewards = Joi.array().items(rewardSchema);

export const createQuestItemSchema = Joi.object().keys({
    id: id.required(),
    name: name.required(),
    description: description.required(),
    giver: giver.required(),
    dialogue: dialogue.required(),
    prerequisites: prerequisites.required(),
    itemRequirements: itemRequirements.required(),
    npcRequirements: npcRequirements.required(),
    miniGameRequirements: miniGameRequirements.required(),
    rewards: rewards.required(),
});

export const patchQuestItemSchema = Joi.object().keys({
    name,
    description,
    giver,
    dialogue,
    prerequisites,
    itemRequirements,
    npcRequirements,
    miniGameRequirements,
    rewards,
});

const per_page = Joi.number().integer().positive();
const page = Joi.number().integer().positive();

export const findQuestItemSchema = Joi.object().keys({
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

