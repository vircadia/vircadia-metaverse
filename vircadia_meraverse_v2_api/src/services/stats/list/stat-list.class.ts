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

import { IsNotNullOrEmpty } from '../../../utils/Misc';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { Application } from '../../../declarations';
import { Params, NullableId } from '@feathersjs/feathers';
import { buildSimpleResponse } from '../../../common/responsebuilder/responseBuilder';
import { messages } from '../../../utils/messages';
import { NotFound, BadRequest, NotAuthenticated } from '@feathersjs/errors';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
import { Monitoring } from '../../../common/Monitoring/Monitoring';

/**
 * monitored values.
 * @noInheritDoc
 */
export class StatList extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Returns the monitored values
     *
     * @remarks
     * This method is part of the get list of monitored values
     * - Request Type - GET
     * - End Point - API_URL/stats/list
     * @requires -authentication

     * @returns - Paginated monitored values list { data:[{...},{...}]}
     *
     */

    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (IsNotNullOrEmpty(loginUser)) {
            const statInfo: any[] = [];
            for (const stat of Monitoring.getStats()) {
                statInfo.push({
                    name: stat.name,
                    category: stat.category,
                    unit: stat.unit,
                });
            }

            return Promise.resolve(
                buildSimpleResponse({
                    stats: statInfo,
                })
            );
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }
}

