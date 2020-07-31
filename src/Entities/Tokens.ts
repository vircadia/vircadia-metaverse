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
import { createObject, getObject, getObjects, updateObjectFields } from '@Tools/Db';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';

import { VKeyedCollection } from '@Tools/vTypes';
import { GenUUID, IsNullOrEmpty } from '@Tools/Misc';

export let tokenCollection = 'tokens';

export const Tokens = {
  // Create a new AuthToken.
  async createToken(pAccountId: string, pScope: string, pExpireDays: number = 0): Promise<AuthToken> {
    const expirationDays = pExpireDays > 0 ? pExpireDays : Config.auth["auth-token-expire-days"];
    const aToken = new AuthToken();
    aToken.tokenId = GenUUID();
    aToken.refreshToken = GenUUID();
    aToken.tokenCreationTime = new Date();
    aToken.tokenExpirationTime = new Date(aToken.tokenCreationTime.valueOf() + expirationDays * 1000*60*60*24);
    aToken.accountId = pAccountId;
    return aToken;
  },
  async getTokenWithTokenId(pTokenId: string): Promise<AuthToken> {
    return getObject(tokenCollection, { 'tokenId': pTokenId });
  },
  async getTokenWithToken(pToken: string): Promise<AuthToken> {
    return getObject(tokenCollection, { 'token': pToken });
  },
  async *getTokensForOwner(pOwnerId: string, pPager?: PaginationInfo): AsyncGenerator<AuthToken> {
    return getObjects(tokenCollection, { 'tokenOwnerId': pOwnerId }, pPager);
  },
  async addToken(pAuthToken: AuthToken) : Promise<AuthToken> {
    return createObject(tokenCollection, pAuthToken);
  },
  async updateTokenFields(pEntity: AuthToken, pFields: VKeyedCollection): Promise<AuthToken> {
    return updateObjectFields(tokenCollection, { tokenId: pEntity.tokenId }, pFields);
  },
  async *enumerateAsync(pCriteria: any, pPager?: PaginationInfo): AsyncGenerator<AuthToken> {
    return getObjects(tokenCollection, pCriteria, pPager);
  }

};
