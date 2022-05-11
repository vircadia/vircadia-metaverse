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

const progressItem = {
    itemId: Joi.string().trim().required(),
    qty: Joi.number().integer().min(0).required(),
};

const questId = Joi.string().trim();
const ownerId = Joi.string().uuid().trim();
const expiresOn = Joi.date();
const isAccepted = Joi.boolean();
const isUnique = Joi.boolean();
const npcProgress = Joi.array().items(progressItem);
const miniGameProgress = Joi.array().items(progressItem);
const isCompleted = Joi.boolean();
const isActive = Joi.boolean();
const status = Joi.string().trim();
const questIds = Joi.array();

export const createQuestSchema = Joi.object().keys({
    questId: questId.required(),
    ownerId: ownerId.required(),
    expiresOn: expiresOn.required(),
    isAccepted: isAccepted.required(),
    isUnique: isUnique.required(),
    npcProgress: npcProgress.required(),
    miniGameProgress: miniGameProgress.required(),
    isCompleted: isCompleted.required(),
    isActive: isActive.required(),
});

export const patchQuestSchema = Joi.object().keys({
    expiresOn,
    npcProgress,
    miniGameProgress,
});

export const findQuestSchema = Joi.object().keys({
    ownerId,
    questIds,
});

export const getQuestSchema = Joi.object().keys({
    status,
});

export const joiOptions = { convert: true, abortEarly: false };

export const joiReadOptions = {
    getContext(context: HookContext) {
        return context.params.query;
    },
    setContext(context: HookContext, newValues: any) {
        Object.assign(context.params.query, newValues);
    },
    convert: true,
    abortEarly: false,
};
