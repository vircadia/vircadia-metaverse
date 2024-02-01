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
    itemId: Joi.string().trim().required().label('Item Id'),
    qty: Joi.number().integer().min(0).required().label('Quantity'),
};

const miniGame = {
    miniGameId: Joi.string().trim().label('Mini Game Id'),
    score: Joi.number().integer().min(0).label('Score'),
};

const questId = Joi.string().trim().label('Quest Id');
const ownerId = Joi.string().uuid().trim().label('Owner Id');
const expiresOn = Joi.date().label('Expires On');
const isAccepted = Joi.boolean().label('Is Accepted');
const isUnique = Joi.boolean().label('Is Unique');
const npcProgress = Joi.array().items(progressItem).label('Npc Progress');
const miniGameProgress = Joi.object()
    .keys(miniGame)
    .label('Mini game progress');
const isCompleted = Joi.boolean().label('Is Completed');
const isActive = Joi.boolean().label('Is Active');
const status = Joi.string().trim().label('Status');
const questIds = Joi.array().label('Quest Ids');

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

export const joiOptions = {
    errors: {
        wrap: {
            label: '',
        },
    },
    convert: true,
    abortEarly: false,
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
