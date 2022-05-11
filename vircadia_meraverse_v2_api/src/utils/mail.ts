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

'use strict';

import { Application } from '../declarations';
import { BadRequest } from '@feathersjs/errors';

export async function sendEmail(app: Application, email: any): Promise<void> {
    email.html = email.html.replace(/&amp;/g, '&');
    try {
        const result = await app
            .service('email')
            .create(email)
            .then(function (result) {
                return result;
            });
        return result;
    } catch (error: any) {
        return Promise.reject(new BadRequest(error));
    }
}

