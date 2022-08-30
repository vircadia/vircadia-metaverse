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

const name = Joi.string().trim().required();
const description = Joi.string().trim().required();
const address = Joi.string().trim().required();
const domainId = Joi.string().trim().required();
const place = Joi.object()
    .keys({
        pointee_query: Joi.string().required(),
        path: Joi.string().required(),
        description: Joi.string().required(),
        thumbnail: Joi.string().required(),
    })
    .required();

export const createPlaceSchema = Joi.object().keys({
    name,
    description,
    address,
    domainId,
});

export const updatePlaceSchema = Joi.object().keys({ place }).required();

const per_page = Joi.number().integer().positive();
const page = Joi.number().integer().positive();
const order = Joi.string().trim();
const maturity = Joi.string().trim();
const tag = Joi.string().trim();
const search = Joi.string().trim();
const asAdmin = Joi.boolean().allow('').default(false);
const account = Joi.string().trim();

export const findPlaceSchema = Joi.object({
    per_page,
    page,
    order,
    maturity,
    tag,
    search,
    account,
    asAdmin
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

