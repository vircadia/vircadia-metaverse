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

import { OAuthStrategy } from '@feathersjs/authentication-oauth';
import { Params } from '@feathersjs/feathers';

export class CustomOAuthStrategy extends OAuthStrategy {
    async getEntityQuery(profile: any): Promise<any> {
        const query: any = {};
        if (profile.email) {
            query.email = profile.email;
        } else {
            query[this.name ?? 'authType'] = profile.sub
                ? `${this.name}:::${profile.sub as string}`
                : `${this.name}:::${profile.id as string}`;
        }
        return query;
    }

    async getEntityData(
        profile: any,
        _existingEntity: any,
        _params: Params
    ): Promise<any> {
        const query: any = {};
        if (profile.email) {
            query.email = profile.email;
        } else {
            query[this.name ?? 'authType'] = profile.sub
                ? `${this.name}:::${profile.sub as string}`
                : `${this.name}:::${profile.id as string}`;
        }
        return query;
    }
}
export default CustomOAuthStrategy;
