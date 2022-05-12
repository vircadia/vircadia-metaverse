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

import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { DatabaseService } from '../../common/dbservice/DatabaseService';

import { Application } from '../../declarations';
import config from '../../appconfig';
import { Id, Params } from '@feathersjs/feathers';

/**
 * Auth.
 * @noInheritDoc
 */
export class Auth extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
        this.getService(config.dbCollections.accounts);
    }
}

