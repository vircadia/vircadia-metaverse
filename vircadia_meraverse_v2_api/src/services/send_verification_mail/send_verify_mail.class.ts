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
import fsPromises from 'fs/promises';
import path from 'path';
import config from '../../appconfig';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { RequestInterface } from '../../common/interfaces/RequestInterface';
import { RequestType } from '../../common/sets/RequestType';
import { Application } from '../../declarations';
import { sendEmail } from '../../utils/mail';
import { messages } from '../../utils/messages';
import { GenUUID, IsNotNullOrEmpty } from '../../utils/Misc';
import { getUtcDate, isValidateEmail } from '../../utils/Utils';

/**
 * SendVerifyMail.
 * @noInheritDoc
 */
export class SendVerifyMail extends DatabaseService {
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
     * - End Point - API_URL/send_verification_mail
     *
     * @param body - {
     *                email:'xyzz@gmail.com',
     *                }
     * @returns - {"status": "success","data": { }}
     *
     */
    async create(data: any): Promise<any> {
        const email: string = data.email;

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
                    const verifyCode = GenUUID();
                    const expirationMinutes =
                        config.metaverseServer
                            .email_verification_timeout_minutes;

                    const requestData = await this.findDataToArray(
                        config.dbCollections.requests,
                        {
                            query: {
                                requestingAccountId: userInfo[0].id,
                            },
                        }
                    );

                    if (IsNotNullOrEmpty(requestData)) {
                        const request = requestData[0];
                        // check difference between current time and request time in minutes
                        const timeDifference: any =
                            +getUtcDate() - +request.whenCreated;
                        if (timeDifference <= 2 * 60 * 1000) {
                            throw new BadRequest(
                                messages.common_messages_mail_already_sent
                            );
                        } else {
                            await this.verifyEmail(
                                userInfo,
                                verifyCode,
                                expirationMinutes
                            );
                        }
                    } else {
                        await this.verifyEmail(
                            userInfo,
                            verifyCode,
                            expirationMinutes
                        );
                    }
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

    async verifyEmail(
        userInfo: any,
        verifyCode: string,
        expirationMinutes: number
    ) {
        const requestList: RequestInterface[] = await this.findDataToArray(
            config.dbCollections.requests,
            {
                query: {
                    requestingAccountId: userInfo[0].id,
                    requestType: RequestType.VERIFYEMAIL,
                },
            }
        );

        if (IsNotNullOrEmpty(requestList)) {
            const RequestInterface = requestList[0];

            await this.deleteData(
                config.dbCollections.requests,
                RequestInterface.id ?? ''
            );
        }

        const request: RequestInterface = {
            requestType: RequestType.VERIFYEMAIL,
            requestingAccountId: userInfo[0].id,
            verificationCode: verifyCode,
            expirationTime: new Date(
                Date.now() + 1000 * 60 * expirationMinutes
            ),
            whenCreated: getUtcDate(),
        };

        this.createData(config.dbCollections.requests, request);

        const verificationURL =
            config.metaverse.metaverseServerUrl +
            `/api/account/verify/email?a=${userInfo[0].id}&v=${verifyCode}`;
        const metaverseName = config.metaverse.metaverseName;
        const shortMetaverseName = config.metaverse.metaverseNickName;
        const verificationFile = path.join(
            __dirname,
            '../..',
            config.metaverseServer.email_verification_email_body
        );

        let emailBody = await fsPromises.readFile(verificationFile, 'utf-8');
        emailBody = emailBody
            .replace('VERIFICATION_URL', verificationURL)
            .replace('METAVERSE_NAME', metaverseName)
            .replace('SHORT_METAVERSE_NAME', shortMetaverseName);

        const email = {
            from: config.email.auth.user,
            to: userInfo[0].email,
            subject: `${shortMetaverseName} account verification`,
            html: emailBody,
        };

        try {
            await sendEmail(this.application, email);
        } catch (e) {}
    }
}

