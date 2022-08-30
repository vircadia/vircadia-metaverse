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

const name = Joi.string().trim();
const version = Joi.string().trim();
const protocol = Joi.string().trim();
const network_address = Joi.string().trim();
const restricted = Joi.string().trim();
const capacity = Joi.number();
const description = Joi.string().trim();
const maturity = Joi.string().trim();
const restriction = Joi.string().trim();
const managers = Joi.array();
const tags = Joi.array();

const num_users = Joi.number();
const anon_users = Joi.number();
const heartbeat = Joi.object({
    num_users,
    anon_users,
});
const domain = Joi.object()
    .keys({
        name,
        version,
        protocol,
        network_address,
        restricted,
        capacity,
        description,
        maturity,
        restriction,
        managers,
        tags,
        heartbeat,
    })
    .required();
export const editDomainSchema = Joi.object().keys({
    domain,
});

const per_page = Joi.number().integer().positive();
const page = Joi.number().integer().positive();
const account = Joi.string().trim();
const asAdmin = Joi.boolean().allow('').default(false);

export const findDomainSchema = Joi.object().keys({
    per_page,
    page,
    account,
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

