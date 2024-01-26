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

const email = Joi.string().trim().email().required();
export const resetPasswordOtpSchema = Joi.object().keys({
    email,
});

const secretKey = Joi.string().trim().required();
const otp = Joi.string().trim().required();
const password = Joi.string().trim().required();

export const changePasswordSchema = Joi.object().keys({
    email,
    secretKey,
    otp,
    password,
});

export const joiOptions = { convert: true, abortEarly: false };
