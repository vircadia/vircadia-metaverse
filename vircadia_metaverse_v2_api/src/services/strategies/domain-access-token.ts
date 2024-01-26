//   Copyright 2022 Vircadia Contributors
//   Copyright 2022 DigiSomni LLC.
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

import express from 'express';
import { Params } from '@feathersjs/feathers';
import { AuthenticationBaseStrategy, AuthenticationResult } from '@feathersjs/authentication';
import { NotAuthenticated } from '@feathersjs/errors';
import config from '../../appconfig';
import { Application } from '../../declarations';
import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { TokenScope } from '../../utils/Tokens';
import { isValidUUID } from '../../utils/Misc';

export class DomainAccessToken extends AuthenticationBaseStrategy {
    app: Application;
    constructor(app: Application) {
        super();
        this.app = app;
    }

    async authenticate(authentication: AuthenticationResult, params: Params) {
        const dbService = new DatabaseService({ id: 'id' }, this.app);
        const token = await dbService.findDataToArray(
            config.dbCollections.tokens,
            { query: {
                token: params.domainAccessToken,
                scope: [ TokenScope.DOMAIN ]
            } }
        );
        if (token[0]) {
            // TODO: check token expiry
            return {
                domainAccessAccount: await dbService.getData(
                    config.dbCollections.accounts,
                    token[0].accountId
                )
            }
        } else {
            throw new NotAuthenticated(
                this.configuration.errorMessage);
        }
    }
}

export function domainAccessTokenMiddleware (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const authHeader = req?.feathers?.headers?.authorization;
        if (authHeader) {
            const authPrefix = 'Bearer';
            if (authHeader.startsWith(authPrefix))
            {
                const domainToken = authHeader.slice(authPrefix.length).trim();
                if (isValidUUID(domainToken) && req?.feathers)
                {
                    req.feathers.domainAccessToken = domainToken;
                }
            }
        }
        next();
    };

