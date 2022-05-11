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

import { messages } from '../../utils/messages';
import { NullableId } from '@feathersjs/feathers';
import config from '../../appconfig';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import { generateRandomNumber, getUtcDate } from '../../utils/Utils';
import { GenUUID } from '../../utils/Misc';
import { sendEmail } from '../../utils/mail';
import path from 'path';
import fsPromises from 'fs/promises';
import { AccountInterface } from '../../common/interfaces/AccountInterface';
import { ResetPasswordInterface } from '../../common/interfaces/ResetPasswordInterface';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';
import { NotFound, Timeout } from '@feathersjs/errors';

/**
 * ResetPassword.
 * @noInheritDoc
 */
export class ResetPassword extends DatabaseService {
    application: Application;
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
        this.application = app;
    }

    /**
     * Returns the reset password secret key
     *
     * @remarks
     * This method is part of the reset password
     * - Request Type - POST
     * - End Point - API_URL/reset-password
     *
     * @param body - {"email":""}
     * @returns - {"status": "success","data": {"secretKey": ""}}
     *
     */

    async create(data: any): Promise<any> {
        const userList = await this.findDataToArray(
            config.dbCollections.accounts,
            { query: { email: data.email } }
        );
        if (userList.length > 0) {
            const userDetail = userList[0] as AccountInterface;
            const OTP = generateRandomNumber(
                config.metaverseServer.reset_password_otp_length
            ).toString();
            const secretKey = GenUUID();

            await this.deleteMultipleData(config.dbCollections.resetPassword, {
                query: { userId: userDetail.id },
            });
            const resetPassword: ResetPasswordInterface = {
                id: GenUUID(),
                userId: userDetail.id,
                email: userDetail.email,
                otp: OTP,
                secretKey: secretKey,
                createdAt: getUtcDate(),
                expirationTime: new Date(
                    getUtcDate().getTime() +
                        1000 *
                            60 *
                            config.metaverseServer.reset_password_expire_minutes
                ),
            };

            await this.createData(
                config.dbCollections.resetPassword,
                resetPassword
            );

            const verificationFile = path.join(
                __dirname,
                '../..',
                config.metaverseServer.email_reset_password_otp_body
            );

            let emailBody = await fsPromises.readFile(
                verificationFile,
                'utf-8'
            );

            emailBody = emailBody
                .replace('METAVERSE_NAME', config.metaverse.metaverseName)
                .replace('USER_OTP', OTP);

            const email = {
                from: config.email.auth.user,
                to: userDetail.email,
                subject: `Reset password - ${config.metaverse.metaverseName} account`,
                html: emailBody,
            };

            await sendEmail(this.application, email);
            return Promise.resolve(buildSimpleResponse({ secretKey }));
        } else {
            throw new NotFound(messages.common_messages_user_does_not_exist);
        }
    }

    /**
     * Reset user password
     *
     * @remarks
     * This method is part of the reset password
     * - Request Type - PATCH
     * - End Point - API_URL/reset-password
     *
     * @param body - {
     *                email:"",
     *                secretKey:"",
     *                otp:"",
     *                password:""
     *            }
     * @returns - {"status": "success","message": ""}
     *
     */
    async patch(id: NullableId, data?: any): Promise<any> {
        const resetPasswordList = await this.findDataToArray(
            config.dbCollections.resetPassword,
            {
                query: {
                    email: data.email,
                    secretKey: data.secretKey,
                    otp: data.otp,
                },
            }
        );
        if (resetPasswordList.length > 0) {
            const resetPassword =
                resetPasswordList[0] as ResetPasswordInterface;
            if (resetPassword.expirationTime >= getUtcDate()) {
                await this.patchData(
                    config.dbCollections.accounts,
                    resetPassword.userId,
                    { password: data.password }
                );
                await this.deleteData(
                    config.dbCollections.resetPassword,
                    resetPassword.id
                );
                return Promise.resolve({
                    message:
                        messages.common_messages_password_changed_successfully,
                });
            } else {
                throw new Timeout(messages.common_messages_otp_expired);
            }
        } else {
            throw new NotFound(messages.common_messages_invalid_otp_secret);
        }
    }
}
