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

const itemId = Joi.string().trim().required();
const toUserId = Joi.string().trim().required();
const itemSource = Joi.string().trim().required();
const qty = Joi.number().required().min(0);
const paginate = Joi.boolean().default(false);

export const userInventorySchema = Joi.object().keys({
    itemId,
    toUserId,
    itemSource,
    qty,
});

export const editUserInventorySchema = Joi.object().keys({
    qty,
});

const per_page = Joi.number().integer().positive();
const page = Joi.number().integer().positive();

export const findUserInventorySchema = Joi.object({
    per_page,
    paginate,
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

