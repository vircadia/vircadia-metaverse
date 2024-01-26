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

import { HookContext } from '@feathersjs/feathers';
import Joi from '@hapi/joi';

const email = Joi.string().trim().email();
const public_key = Joi.string().trim();
const hero = Joi.string().trim();
const tiny = Joi.string().trim();
const thumbnail = Joi.string().trim();
const bio = Joi.string().trim().default('');
const country = Joi.string().trim();
const achievementId = Joi.string().trim();
const ethereumAddress = Joi.string().trim();

const images = Joi.object({
    hero,
    tiny,
    thumbnail,
});
const accounts = Joi.object()
    .keys({
        email,
        public_key,
        bio,
        images,
        country,
        achievementId,
        ethereumAddress,
    })
    .required();

export const patchAccountsSchema = Joi.object().keys({
    accounts,
});

const a = Joi.string().trim();
const v = Joi.string().trim();
const per_page = Joi.number().integer().positive();
const page = Joi.number().integer().positive();
const filter = Joi.string().trim();
const status = Joi.string().trim();
const search = Joi.string().trim();
const acct = Joi.string().trim();
const asAdmin = Joi.boolean().allow('').default(false);

export const findAccountsSchema = Joi.object().keys({
    a,
    v,
    per_page,
    page,
    filter,
    status,
    search,
    acct,
    asAdmin,
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

