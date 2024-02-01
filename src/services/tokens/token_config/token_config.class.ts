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

import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../../declarations';
import config from '../../../appconfig';
import { AccountInterface } from '../../../common/interfaces/AccountInterface';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../../../utils/Misc';
import { messages } from '../../../utils/messages';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
import { BadRequest, NotAuthenticated, NotFound } from '@feathersjs/errors';
import { VKeyedCollection } from '../../../utils/vTypes';
import { Tokens, TokenScope } from '../../../utils/Tokens';
import { isEnabled, validatePassword } from '../../../utils/Utils';
import { AuthToken } from '../../../common/interfaces/AuthToken';
import { Params } from '@feathersjs/feathers';
/**
 * oauth token.
 * @noInheritDoc
 */
export class TokenJConfig extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Returns the Config
     *
     * @remarks
     * This method is part of the get list of users
     * - Request Type - GET
     * - End Point - API_URL/user/tokens/config.json
     *
     * @returns -
     *
     */
    async find(params?: Params): Promise<any> {
        return {
            metaverse: config.metaverse,
            server: config.server,
            debug: config.debug
        };
    }
}
