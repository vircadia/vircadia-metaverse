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
'use strict'

import { Config } from '@Base/config';

import { AuthToken } from '@Entities/AuthToken';
import { Scope } from '@Entities/Scope';
import { createObject, getObject, getObjects, updateObjectFields, deleteMany, deleteOne } from '@Tools/Db';

import { GenericFilter } from '@Entities/EntityFilters/GenericFilter';
import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { AccountScopeFilter } from '@Entities/EntityFilters/AccountScopeFilter';

import { VKeyedCollection } from '@Tools/vTypes';
import { GenUUID, IsNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';
import { DeleteWriteOpResultObject } from 'mongodb';

export let tokenCollection = 'tokens';

// Initialize token management.
// Mostly starts a periodic function that deletes expired tokens.
export function initTokens(): void {
  // Expire tokens that have pased their prime
  setInterval( async () => {
    const nowtime = new Date();
    const deleteInfo = await deleteMany(tokenCollection, { tokenExpirationTime: { $lt: nowtime } } );
    Logger.debug(`Tokens.Expiration: expired ${deleteInfo.deletedCount} tokens`);
  }, 1000 * 60 * 5 );

};

export const Tokens = {
  // Create a new AuthToken.
  async createToken(pAccountId: string, pScope: string, pExpireHours: number = 0): Promise<AuthToken> {
    const aToken = new AuthToken();
    aToken.tokenId = GenUUID();
    aToken.token = GenUUID();
    aToken.refreshToken = GenUUID();
    aToken.scope = Scope.KnownScope(pScope) ? [ pScope ] : [ Scope.OWNER ];
    aToken.tokenCreationTime = new Date();
    aToken.tokenExpirationTime = Tokens.computeDefaultExpiration(aToken.scope, aToken.tokenCreationTime);
    aToken.accountId = pAccountId;
    return aToken;
  },
  async getTokenWithTokenId(pTokenId: string): Promise<AuthToken> {
    return IsNullOrEmpty(pTokenId) ? null : getObject(tokenCollection, { 'tokenId': pTokenId });
  },
  async getTokenWithToken(pToken: string): Promise<AuthToken> {
    return IsNullOrEmpty(pToken) ? null : getObject(tokenCollection, { 'token': pToken });
  },
  async *getTokensForOwner(pOwnerId: string, pPager?: CriteriaFilter): AsyncGenerator<AuthToken> {
    return IsNullOrEmpty(pOwnerId) ? null : getObjects(tokenCollection,
               new GenericFilter({ 'tokenOwnerId': pOwnerId }), pPager);
  },
  async addToken(pAuthToken: AuthToken) : Promise<AuthToken> {
    return createObject(tokenCollection, pAuthToken);
  },
  async removeToken(pAuthToken: AuthToken) : Promise<DeleteWriteOpResultObject> {
    return deleteOne(tokenCollection, pAuthToken.tokenId);
  },
  async updateTokenFields(pEntity: AuthToken, pFields: VKeyedCollection): Promise<AuthToken> {
    return updateObjectFields(tokenCollection, { tokenId: pEntity.tokenId }, pFields);
  },
  async *enumerateAsync(pPager?: CriteriaFilter, pScoper?: AccountScopeFilter): AsyncGenerator<AuthToken> {
    for await (const tok of getObjects(tokenCollection, pPager, pScoper)) {
      yield tok;
    };
    // return getObjects(tokenCollection, pCriteria, pPager);
  },
  // Return an expiration date for the token depending on its scope
  computeDefaultExpiration(pScopes: string[], pBaseDate?: Date): Date {
    return new Date((pBaseDate ? pBaseDate.valueOf() : new Date().valueOf())
          + ( Scope.HasScope(pScopes, Scope.DOMAIN) ? Config.auth["domain-token-expire-hours"] * 1000*60*60
                   : Config.auth["owner-token-expire-hours"] * 1000*60*60 )
    );
  }
};
