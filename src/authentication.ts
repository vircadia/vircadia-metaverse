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

import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth } from '@feathersjs/authentication-oauth';
import { NotAuthenticated } from '@feathersjs/errors';
import { ServiceAddons, Params } from '@feathersjs/feathers';
import { Application } from './declarations';
import config from './appconfig';
import { FacebookStrategy } from './services/strategies/facebook';
import { GoogleStrategy } from './services/strategies/google';
import { DomainAccessToken } from './services/strategies/domain-access-token';
import { AzureStrategy } from './services/strategies/azure';
import { validatePassword } from './utils/Utils';
import { noCaseCollation } from './common/dbservice/DatabaseService';

declare module './declarations' {
    interface ServiceTypes {
        authentication: AuthenticationService & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const authentication = new AuthenticationService(app);
    class MyLocalStrategy extends LocalStrategy {

        async findEntity(username: string, params: Params) {
            return super.findEntity(username,
                Object.assign({}, params, {collation: noCaseCollation}));
        }

        async comparePassword(entity: any, password: string): Promise<any> {
            const { errorMessage } = this.configuration;
            if (await validatePassword(entity, password)) {
                return entity;
            } else {
                throw new NotAuthenticated(errorMessage);
            }
        }

    }

    authentication.register('jwt', new JWTStrategy());
    // Always register domain-access-token for domain auth flows
    authentication.register('domain-access-token', new DomainAccessToken(app));
    if (config.authentication.enableLocal) {
        authentication.register('local', new MyLocalStrategy());
    }
    if (config.authentication.enableGoogle) {
        authentication.register('google', new GoogleStrategy(app));
    }
    if (config.authentication.enableFacebook) {
        authentication.register('facebook', new FacebookStrategy(app));
    }
    if (config.authentication.enableAzure) {
        authentication.register('azure', new AzureStrategy(app));
    }

  //  app.use('/oauth/token',authentication);
    app.use('/authentication', authentication);
    app.configure(expressOauth());
}
