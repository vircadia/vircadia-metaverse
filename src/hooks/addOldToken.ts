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
import { DatabaseService } from '../common/dbservice/DatabaseService';
import { Tokens, TokenScope } from '../utils/Tokens';
import config from '../appconfig';
import { getUtcDate } from '../utils/Utils';

export default () => {
    return async (context: HookContext): Promise<HookContext> => {
        if (context.path === 'authentication') {
            const dbService = new DatabaseService(
                { id: 'id', multi: ['remove'] },
                undefined,
                context
            );

            dbService.deleteMultipleData(config.dbCollections.tokens, {
                query: { expirationTime: { $lt: getUtcDate() } },
            });

            const token = await Tokens.createToken(context.result.user?.id, [
                TokenScope.OWNER,
            ]);

            token.token_type = 'Bearer';
            await dbService.createData(config.dbCollections.tokens, token);

            context.result = {
                ...context.result,
                access_token: context.result.accessToken,
                token_type: 'Bearer',
                expires_in:
                    token.expirationTime.valueOf() / 1000 -
                    token.whenCreated.valueOf() / 1000,
                refresh_token: token.refreshToken,
                scope: token.scope[0],
                created_at: token.whenCreated.valueOf(),
                account_id: context.result.user?.id,
                account_name: context.result.user?.username,
                account_roles: context.result.user?.roles,
            };
        }

        return context;
    };
};
