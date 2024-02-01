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

export const createCurrentSchema = Joi.object().keys({
    placeId: Joi.string().trim().uuid().required(),
    current_api_key: Joi.string().trim().required(),
    current_attendance: Joi.string().trim(),
    current_images: Joi.string().trim(),
    current_info: Joi.string().trim(),
});

export const joiOptions = { convert: true, abortEarly: false };
