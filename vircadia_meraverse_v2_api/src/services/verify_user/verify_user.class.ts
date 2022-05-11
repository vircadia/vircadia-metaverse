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

import { BadRequest } from '@feathersjs/errors';
import { NullableId } from '@feathersjs/feathers';
import config from '../../appconfig';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import { messages } from '../../utils/messages';
import { IsNotNullOrEmpty } from '../../utils/Misc';
import { isValidateEmail } from '../../utils/Utils';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';

/**
 * VerifyUser.
 * @noInheritDoc
 */
export class VerifyUser extends DatabaseService {
    application: Application;
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
        this.application = app;
    }

    /**
     * Create User
     *
     * @remarks
     * This method is part of the create user
     * - Request Type - POST
     * - End Point - API_URL/verify_user
     *
     * @param body - {
     *                email:''xyzz@gmail.com',
     *                }
     * @returns - {"status": "success","data": { }}
     *
     */

    async patch(Id: NullableId, data: any, params?: any): Promise<any> {
        const email: string = data.email;
        const loginUser = extractLoggedInUserFromParams(params);

        if (isValidateEmail(email)) {
            const userInfo = await this.findDataToArray(
                config.dbCollections.accounts,
                {
                    query: {
                        email: email,
                    },
                }
            );

            if (IsNotNullOrEmpty(userInfo)) {
                if (userInfo[0].accountWaitingVerification) {
                    await this.patchData(
                        config.dbCollections.accounts,
                        userInfo[0].id,
                        { accountWaitingVerification: false }
                    );

                    return Promise.resolve({});
                } else {
                    throw new BadRequest(
                        messages.common_message_already_verified
                    );
                }
            } else {
                throw new BadRequest(
                    messages.common_messages_user_does_not_exist
                );
            }
        } else {
            throw new BadRequest(
                messages.common_messages_email_validation_error
            );
        }
    }
}

