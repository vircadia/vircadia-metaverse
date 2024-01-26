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

import config from '../appconfig';
import { AuthToken } from '../common/interfaces/AuthToken';
import { SArray } from './vTypes';
import { Clamp, GenUUID, IsNullOrEmpty } from './Misc';
import { getUtcDate } from './Utils';

export const tokenCollection = 'tokens';

// Class to manage the manipulations on entities scope of application
export class TokenScope {
    static OWNER = 'owner'; // a 'user' or 'person'
    static DOMAIN = 'domain'; // a domain-server
    static PLACE = 'place'; // a Place (APIkey)
    // Added for ActivityPub access control
    static READ = 'read';
    static WRITE = 'write';

    static KnownScope(pScope: string): boolean {
        return [TokenScope.OWNER, TokenScope.DOMAIN, TokenScope.PLACE].includes(
            pScope
        );
    }
}

export const Tokens = {
    // Create a new AuthToken.
    async createToken(
        pAccountId: string,
        pScope: string[],
        pExpireHours = 0
    ): Promise<AuthToken> {
        const scope: string[] = [];
        pScope.forEach((aScope) => {
            if (TokenScope.KnownScope(aScope)) scope.push(aScope);
        });

        const whenCreated = getUtcDate();
        let expirationTime: Date;

        switch (pExpireHours) {
            case 0:
                // If expiration hours is not specified, compute default for this scope
                expirationTime = Tokens.computeDefaultExpiration(
                    scope,
                    whenCreated
                );
                break;
            case -1:
                // Expiration is infinite
                expirationTime = new Date(2399, 12);
                break;
            default:
                // There is a specification of some hours to expire
                const hours = Clamp(pExpireHours, 1, 1000000); // max is 114 years
                expirationTime = new Date(
                    getUtcDate().valueOf() + hours * 1000 * 60 * 60
                );
                break;
        }

        const aToken: AuthToken = {
            id: GenUUID(),
            token: GenUUID(),
            refreshToken: GenUUID(),
            scope: scope, // a array of symbols in Scope class
            accountId: pAccountId, // AccountId of associated account
            whenCreated: whenCreated,
            expirationTime: expirationTime,
        };

        return aToken;
    },

    // Return an expiration date for the token depending on its scope
    computeDefaultExpiration(pScopes: string[], pBaseDate?: Date): Date {
        return new Date(
            (pBaseDate ? pBaseDate.valueOf() : getUtcDate().valueOf()) +
                (SArray.has(pScopes, TokenScope.DOMAIN)
                    ? config.metaverseServer.domain_token_expire_hours *
                      1000 *
                      60 *
                      60
                    : config.metaverseServer.owner_token_expire_hours *
                      1000 *
                      60 *
                      60)
        );
    },
    // Return 'true' if the passed token has not expired.
    hasNotExpired(pAuthToken: AuthToken): boolean {
        return IsNullOrEmpty(pAuthToken)
            ? false
            : pAuthToken.expirationTime.valueOf() > getUtcDate().valueOf();
    },
    // Creates a special token that is used internally to do admin stuff
    // This only lasts one second and points to a non-existant account.
    createSpecialAdminToken(): AuthToken {
        const aToken: AuthToken = {
            id: GenUUID(),
            token: specialAdminTokenToken,
            refreshToken: GenUUID(),
            accountId: GenUUID(), // account that doesn't exist
            // Verify that passed scopes are known scope codes
            scope: [TokenScope.OWNER],
            whenCreated: getUtcDate(),
            expirationTime: new Date(getUtcDate().valueOf() + 1000),
        };
        return aToken;
    },
    isSpecialAdminToken(pAuthToken: AuthToken): boolean {
        return (
            pAuthToken.token === specialAdminTokenToken &&
            Tokens.hasNotExpired(pAuthToken)
        );
    },
};
const specialAdminTokenToken = GenUUID();
