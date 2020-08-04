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
import { createObject, getObject, getObjects, updateObjectFields, deleteMany } from '@Tools/Db';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';

import { VKeyedCollection } from '@Tools/vTypes';
import { GenUUID, IsNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';
import { AccountScopeFilter } from './EntityFilters/AccountScopeFilter';

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
    const expirationHours = pExpireHours > 0 ? pExpireHours
        : (pScope === 'domain' ? Config.auth["domain-token-expire-hours"] : Config.auth["owner-token-expire-hours"]);
    const aToken = new AuthToken();
    aToken.tokenId = GenUUID();
    aToken.token = GenUUID();
    aToken.refreshToken = GenUUID();
    aToken.scope = 'owner';
    aToken.tokenCreationTime = new Date();
    aToken.tokenExpirationTime = new Date(aToken.tokenCreationTime.valueOf() + expirationHours * 1000*60*60);
    aToken.accountId = pAccountId;
    return aToken;
  },
  async getTokenWithTokenId(pTokenId: string): Promise<AuthToken> {
    return IsNullOrEmpty(pTokenId) ? null : getObject(tokenCollection, { 'tokenId': pTokenId });
  },
  async getTokenWithToken(pToken: string): Promise<AuthToken> {
    return IsNullOrEmpty(pToken) ? null : getObject(tokenCollection, { 'token': pToken });
  },
  async *getTokensForOwner(pOwnerId: string, pPager?: PaginationInfo): AsyncGenerator<AuthToken> {
    return IsNullOrEmpty(pOwnerId) ? null : getObjects(tokenCollection, { 'tokenOwnerId': pOwnerId }, pPager);
  },
  async addToken(pAuthToken: AuthToken) : Promise<AuthToken> {
    return createObject(tokenCollection, pAuthToken);
  },
  async updateTokenFields(pEntity: AuthToken, pFields: VKeyedCollection): Promise<AuthToken> {
    return updateObjectFields(tokenCollection, { tokenId: pEntity.tokenId }, pFields);
  },
  async *enumerateAsync(pCriteria: any, pPager?: PaginationInfo, pScoper?: AccountScopeFilter): AsyncGenerator<AuthToken> {
    for await (const tok of getObjects(tokenCollection, pCriteria, pPager)) {
      yield tok;
    };
    // return getObjects(tokenCollection, pCriteria, pPager);
  }

};
