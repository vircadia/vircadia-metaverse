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

const id = Joi.string().trim();
const name = Joi.string().trim();
const type = Joi.string().trim();
const description = Joi.string().trim();
const idleText = Joi.array().items(Joi.string().trim());
const interactiveText = Joi.array().items(Joi.string().trim());
const tags = Joi.object().keys({
    questId: Joi.string().trim(),
    interactiveItem: Joi.string().trim(),
});
const idleAnimations = Joi.array().items(Joi.string().trim());
const interactiveAnimations = Joi.array().items(Joi.string().trim());
const combatText = Joi.array().items(Joi.string().trim());
const combatAnimations = Joi.array().items(Joi.string().trim());

export const createNpcSchema = Joi.object().keys({
    id: id.required(),
    name: name.required(),
    type: type.required(),
    description: description.required(),
    idleText: idleText.required(),
    interactiveText: interactiveText.required(),
    idleAnimations,
    interactiveAnimations,
    combatText,
    combatAnimations,
    tags: tags.required(),
});

export const patchNpcSchema = Joi.object().keys({
    name,
    type,
    description,
    idleText,
    interactiveText,
    idleAnimations,
    interactiveAnimations,
    combatText,
    combatAnimations,
    tags,
});

const per_page = Joi.number().integer().positive();
const page = Joi.number().integer().positive();

export const findNpcSchema = Joi.object().keys({
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
