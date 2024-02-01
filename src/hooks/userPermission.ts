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

import { HookContext } from '@feathersjs/feathers';
import { Perm } from '../utils/Perm';
import { HTTPStatusCode } from '../utils/response';
import { messages } from '../utils/messages';
import { extractLoggedInUserFromParams } from '../services/auth/auth.utils';
import { NotAuthenticated } from '@feathersjs/errors';

export default (userPermissions: Perm[]) => {
    return async (context: HookContext): Promise<HookContext> => {
        let canAccess = false;
        const loginUser = extractLoggedInUserFromParams(context.params);
        if (loginUser?.roles) {
            const roles = loginUser.roles as Array<any>;
            userPermissions.map((item) => {
                if (roles.includes(item)) {
                    canAccess = true;
                }
            });
        }

        if (!canAccess) {
            context.statusCode = HTTPStatusCode.Unauthorized;
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }

        return context;
    };
};
