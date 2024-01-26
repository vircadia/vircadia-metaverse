import { extractLoggedInUserFromParams } from './../services/auth/auth.utils';
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

('use strict');

import { HookContext } from '@feathersjs/feathers';
import { DatabaseService } from '../common/dbservice/DatabaseService';
import config from '../appconfig';
import { getUtcDate } from '../utils/Utils';
import { IsNotNullOrEmpty } from '../utils/Misc';

export default () => {
    return async (context: HookContext): Promise<HookContext> => {
        const dbService = new DatabaseService({ id: 'id' }, undefined, context);
        const loginUser = extractLoggedInUserFromParams(context.params);

        if (IsNotNullOrEmpty(loginUser)) {
            const result = await dbService.patchData(
                config.dbCollections.accounts,
                loginUser.id,
                {
                    lastOnline: getUtcDate(),
                }
            );
            context.result.lastOnline = result.lastOnline;
        }

        return context;
    };
};
