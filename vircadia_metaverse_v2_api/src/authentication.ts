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

import { ServiceAddons } from '@feathersjs/feathers';
import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth } from '@feathersjs/authentication-oauth';
import { Application } from './declarations';
import { GoogleStrategy } from './services/strategies/google';
import { FacebookStrategy } from './services/strategies/facebook';

declare module './declarations' {
    interface ServiceTypes {
        authentication: AuthenticationService & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const authentication = new AuthenticationService(app);

    authentication.register('jwt', new JWTStrategy());
    authentication.register('local', new LocalStrategy());
    authentication.register('google', new GoogleStrategy(app));
    authentication.register('facebook', new FacebookStrategy(app));

    app.use('/authentication', authentication);
    app.configure(expressOauth());
}