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

const networkAddress = Joi.string().trim();
const nodeId = Joi.string().trim();
const availability = Joi.array();
const path = Joi.string().trim();
const connected = Joi.boolean();
const placeId = Joi.string().trim();
const domainId = Joi.string().trim();

export const editLocationSchema = Joi.object().keys({
    networkAddress,
    nodeId,
    availability,
    path,
    connected,
    placeId,
    domainId,
});
export const joiOptions = { convert: true, abortEarly: false };
