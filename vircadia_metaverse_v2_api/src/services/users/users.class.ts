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

import { RequestType } from '../../common/sets/RequestType';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import config from '../../appconfig';
import { Params } from '@feathersjs/feathers';
import { AccountInterface } from '../../common/interfaces/AccountInterface';
import { GenUUID, IsNotNullOrEmpty, IsNullOrEmpty } from '../../utils/Misc';
import { Roles } from '../../common/sets/Roles';
import { BadRequest, NotAuthenticated } from '@feathersjs/errors';
import { SArray } from '../../utils/vTypes';
import { sendEmail } from '../../utils/mail';
import path from 'path';
import fsPromises from 'fs/promises';
import {
    buildCreateUserInfo,
    buildUserInfo,
} from '../../common/responsebuilder/accountsBuilder';
import { RequestInterface } from '../../common/interfaces/RequestInterface';
import {
    buildSimpleResponse,
    buildPaginationResponse,
} from '../../common/responsebuilder/responseBuilder';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import {
    dateWhenNotOnline,
    couldBeDomainId,
    isAdmin,
    isValidateEmail,
    getGameUserLevel,
    getUtcDate,
    isValidateUsername,
} from '../../utils/Utils';
import { messages } from '../../utils/messages';

/**
 * Users.
 * @noInheritDoc
 */
export class Users extends DatabaseService {
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
     * - End Point - API_URL/users
     *
     * @param body - {
     *                username:'',
     *                email:'',
     *                password:'',
     *                ethereumAddress:'
     *                bio:,
     *                googleId:'',
     *                facebookId:'',
     *                twitterId: ''
     *                }
     * @returns - {"status": "success","data": {
     *                accountId: '',
     *                username: '',
     *                accountIsActive: false,
     *                accountWaitingVerification: true,
     *            }}
     *
     */
    async create(data: any): Promise<any> {
        data = data.user;
        const username: string = data.username.toString().trim();

        const email: string = data.email;
        const password: string = data.password;
        const passwordHash: string = data.passwordHash;
        const passwordSalt: string = data.passwordSalt;
        const ethereumAddress: string = data.ethereumAddress ?? '';
        const googleId: string = data.googleId;
        const facebookId: string = data.facebookId;
        const twitterId: string = data.twitterId;
        const bio: string = data.bio ?? '';

        if (isValidateEmail(email)) {
            if (isValidateUsername(username)) {
                const accountsName: AccountInterface[] =
                    await this.findDataToArray(config.dbCollections.accounts, {
                        query: { username: username },
                    });
                const name = (accountsName as Array<AccountInterface>)?.map(
                    (item) => item.username
                );
                if (!name.includes(username)) {
                    const accountsEmail: AccountInterface[] =
                        await this.findDataToArray(
                            config.dbCollections.accounts,
                            { query: { email: email } }
                        );
                    const emailAddress = (
                        accountsEmail as Array<AccountInterface>
                    )?.map((item) => item.email);
                    if (!emailAddress.includes(email)) {
                        let isEthereumAddressExist = false;

                        if (IsNotNullOrEmpty(ethereumAddress)) {
                            const accountList: AccountInterface[] =
                                await this.findDataToArray(
                                    config.dbCollections.accounts,
                                    {
                                        query: {
                                            ethereumAddress: ethereumAddress,
                                        },
                                    }
                                );
                            const ethereumAddressList = (
                                accountList as Array<AccountInterface>
                            )?.map((item) => item.ethereumAddress);

                            isEthereumAddressExist =
                                ethereumAddressList.includes(ethereumAddress);
                        }

                        if (!isEthereumAddressExist) {
                            const id = GenUUID();
                            const roles = [Roles.USER];
                            const friends: string[] = [];
                            const connections: string[] = [];
                            const whenCreated = new Date();
                            const accountIsActive = true;
                            const accountWaitingVerification =
                                config.metaverseServer
                                    .enable_account_email_verification ===
                                'true';
                            // const goo = 0;
                            const xp = 0;
                            const level = getGameUserLevel(xp);

                            if (
                                username ===
                                config.metaverseServer.base_admin_account
                            ) {
                                SArray.add(roles, Roles.ADMIN);
                            }
                            const createUser: any = {
                                id: id,
                                username: username,
                                ethereumAddress: ethereumAddress,
                                email: email,
                                password: password,
                                passwordSalt: passwordSalt,
                                passwordHash: passwordHash,
                                roles: roles,
                                whenCreated: whenCreated,
                                friends: friends,
                                connections: connections,
                                accountIsActive: accountIsActive,
                                accountWaitingVerification:
                                    accountWaitingVerification,
                                lastOnline: getUtcDate(),
                                level: level,
                                bio: bio,
                                // goo: goo,
                                xp: xp,
                            };
                            if (IsNotNullOrEmpty(googleId)) {
                                createUser.googleId = googleId;
                            }
                            if (IsNotNullOrEmpty(twitterId)) {
                                createUser.twitterId = twitterId;
                            }
                            if (IsNotNullOrEmpty(facebookId)) {
                                createUser.facebookId = facebookId;
                            }

                            const account = await this.createData(
                                config.dbCollections.accounts,
                                { ...createUser }
                            );
                            if (IsNotNullOrEmpty(account)) {
                                if (accountWaitingVerification) {
                                    const verifyCode = GenUUID();
                                    const expirationMinutes =
                                        config.metaverseServer
                                            .email_verification_timeout_minutes;
                                    const request: RequestInterface = {
                                        requestType: RequestType.VERIFYEMAIL,
                                        requestingAccountId: account.id,
                                        verificationCode: verifyCode,
                                        expirationTime: new Date(
                                            Date.now() +
                                                1000 * 60 * expirationMinutes
                                        ),
                                    };

                                    this.createData(
                                        config.dbCollections.requests,
                                        request
                                    );

                                  
                                    try {
                                        const verificationURL =
                                        config.metaverse.metaverseServerUrl +
                                        `/api/v1/accounts/verify/email?a=${account.id}&v=${verifyCode}`;
                                    const metaverseName =
                                        config.metaverse.metaverseName;
                                    const shortMetaverseName =
                                        config.metaverse.metaverseNickName;
                                    const verificationFile = path.join(
                                        __dirname,
                                        '../..',
                                        config.metaverseServer
                                            .email_verification_email_body
                                    );
                                    
                                    let emailBody = await fsPromises.readFile(
                                        verificationFile,
                                        'utf-8'
                                    );
                                    emailBody = emailBody
                                        .replace(
                                            'VERIFICATION_URL',
                                            verificationURL
                                        )
                                        .replace(
                                            'METAVERSE_NAME',
                                            metaverseName
                                        )
                                        .replace(
                                            'SHORT_METAVERSE_NAME',
                                            shortMetaverseName
                                        );
                                    const email = {
                                        from: config.email.auth.user,
                                        to: account.email,
                                        subject: `${shortMetaverseName} account verification`,
                                        html: emailBody,
                                    };
                                        await sendEmail(
                                            this.application,
                                            email
                                        );
                                    } catch (e) {
                                    }
                                }

                                return Promise.resolve(
                                    buildSimpleResponse(
                                        buildCreateUserInfo(account)
                                    )
                                );
                            } else {
                                throw new Error(
                                    messages.common_messages_could_not_create_account
                                );
                            }
                        } else {
                            throw new Error(
                                messages.common_messages_ethereum_address_exists
                            );
                        }
                    } else {
                        throw new BadRequest(
                            messages.common_messages_user_email_link_error
                        );
                    }
                } else {
                    throw new BadRequest(
                        messages.common_messages_account_already_exists
                    );
                }
            } else {
                throw new BadRequest(
                    messages.common_messages_badly_formed_username
                );
            }
        } else {
            throw new BadRequest(
                messages.common_messages_email_validation_error
            );
        }
    }

    /**
     * Returns the Users
     *
     * @remarks
     * This method is part of the get list of users
     * - Request Type - GET
     * - End Point - API_URL/users?per_page=10&filter=friends&status=online ....
     *
     * @param per_page - page size
     * @param page - page number
     * @param filter - Connections|friends|all
     * @param status - Online|domainId
     * @param asAdmin - true | false if logged in account is administrator, list all accounts. Value is optional.
     * @param account - user account id
     * @returns - Paginated users: { data:{users:[{...},{...}]},current_page:1,per_page:10,total_pages:1,total_entries:5}
     *
     */
    async find(params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (IsNotNullOrEmpty(loginUser)) {
            let asAdmin = params?.query?.asAdmin == true ? true : false;
            const perPage = parseInt(params?.query?.per_page) || 10;
            const page = parseInt(params?.query?.page) || 1;
            const skip = (page - 1) * perPage;
            const filter = params?.query?.filter || '';
            const status = params?.query?.filter || '';
            const filterQuery: any = {};
            const targetAccount = params?.query?.account ?? '';

            if (asAdmin && isAdmin(loginUser) 
                    // && IsNullOrEmpty(targetAccount)
                ) {
                asAdmin = true;
            } else {
                asAdmin = false;
            }

            if (filter.length > 0) {
                if (!filter.includes('all')) {
                    if (
                        filter.includes('friends') &&
                        (loginUser?.friends ?? []).length > 0
                    ) {
                        filterQuery.friends = { $in: loginUser.friends };
                    }
                    if (
                        filter.includes('connections') &&
                        (loginUser.connections ?? []).length > 0
                    ) {
                        filterQuery.connections = {
                            $in: loginUser.connections,
                        };
                    }
                }
            }

            if (IsNotNullOrEmpty(status)) {
                if (status === 'online') {
                    filterQuery.timeOfLastHeartbeat = {
                        $gte: dateWhenNotOnline(),
                    };
                } else if (couldBeDomainId(status)) {
                    filterQuery.locationDomainId = status;
                }
            }

            if (!asAdmin) {
                filterQuery.id = loginUser.id;
            } else if (IsNotNullOrEmpty(targetAccount)) {
                filterQuery.id = targetAccount;
            }

            const userData: any = await this.findData(
                config.dbCollections.accounts,
                {
                    query: {
                        ...filterQuery,
                        accountIsActive: true,
                        $skip: skip,
                        $limit: perPage,
                    },
                }
            );

            const userList: AccountInterface[] = userData.data;

            const users: Array<any> = [];
            (userList as Array<AccountInterface>)?.forEach(async (element) => {
                users.push(await buildUserInfo(element));
            });

            return Promise.resolve(
                buildPaginationResponse(
                    { users },
                    page,
                    perPage,
                    Math.ceil(userData.total / perPage),
                    userData.total
                )
            );
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }
}

