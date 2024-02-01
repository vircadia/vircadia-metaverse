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

const username = Joi.string().trim().min(2).max(30).required();
const email = Joi.string().trim().email().required();
const password = Joi.string().trim().required();
const ethereumAddress = Joi.string().trim().min(40);
const facebookId = Joi.string().trim();
const twitterId = Joi.string().trim();
const googleId = Joi.string().trim();
const bio = Joi.string().trim();
const user = Joi.object()
    .keys({
        username,
        email,
        password,
        ethereumAddress,
        facebookId,
        twitterId,
        googleId,
        bio,
    })
    .required();

export const createUserSchema = Joi.object().keys({
    user,
});

const per_page = Joi.number().integer().positive();
const page = Joi.number().integer().positive();
const filter = Joi.string().trim();
const status = Joi.string().trim();
const asAdmin = Joi.boolean().allow('').default(false);
const account = Joi.string().trim();
export const findUserSchema = Joi.object().keys({
    per_page,
    page,
    filter,
    status,
    asAdmin,
    account,
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

