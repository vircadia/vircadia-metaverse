//   Copyright 2020 Vircadia Contributors
//   Copyright 2022 DigiSomni LLC.
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

const prerequisitesData = {
    minLevel: Joi.number().integer().min(0).required().label('Min Level'),
    maxLevel: Joi.number().integer().min(0).required().label('Max Level'),
    expireAfter: Joi.number().integer().min(0).required().label('Expire After'),
    maxActive: Joi.number().integer().min(0).required().label('Max Active'),
    maxSimultaneous: Joi.number()
        .integer()
        .min(0)
        .required()
        .label('Max Simultaneous'),
};

const attributesData = {
    enemyId: Joi.string().trim().required().label('Enemy ID'),
    enemyHitpoints: Joi.number()
        .integer()  
        .min(0)
        .required()
        .label('Enemy Hitpoints'),
    enemyPhysicalDamageLevel: Joi.number()
        .integer()
        .min(0)
        .required()
        .label('Enemy Physical Damage Level'),
    enemyPhysicalDefenceLevel: Joi.number()
        .integer()
        .min(0)
        .required()
        .label('Enemy Physical Defence Level'),
};

const itemSchema = {
    itemId: Joi.string().trim().required().label('Item ID'),
    qty: Joi.number().integer().min(0).required().label('Quantity'),
};

const rewardSchema = {
    items: Joi.array().items(itemSchema).label('Items'),
    xp: Joi.number().integer().min(0).label('XP'),
    //goo: Joi.number().integer().min(0).label('Goo'),
};

const id = Joi.string().trim().label('ID');
const name = Joi.string().trim().label('Name');
const giver = Joi.string().trim().label('Giver');
const description = Joi.string().trim().label('Description');
const prerequisites = Joi.object().keys(prerequisitesData).label('Prequisites');
const attributes = Joi.object().keys(attributesData).label('Attributes');
const rewards = Joi.object().keys(rewardSchema).label('Rewards');

export const createMiniGameSchema = Joi.object().keys({
    id: id.required(),
    name: name.required(),
    giver: giver.required(),
    description: description.required(),
    prerequisites: prerequisites.required(),
    attributes: attributes.required(),
    rewards: rewards,
});

export const patchMiniGameSchema = Joi.object().keys({
    name,
    giver,
    description,
    prerequisites,
    attributes,
    rewards,
});

const per_page = Joi.number().integer().positive().label('Per Page');
const page = Joi.number().integer().positive().label('Page');

export const findMiniGameSchema = Joi.object().keys({
    per_page,
    page,
});

export const joiOptions = {
    convert: true,
    abortEarly: false,
    errors: {
        wrap: {
            label: '',
        },
    },
};

export const joiReadOptions = {
    getContext(context: HookContext) {
        return context.params?.query ?? {};
    },
    setContext(context: HookContext, newValues: any) {
        Object.assign(context.params?.query ?? {}, newValues);
    },
    convert: true,
    abortEarly: false,
    errors: {
        wrap: {
            label: '',
        },
    },
};
