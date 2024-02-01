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

import { DomainInterface } from '../interfaces/DomainInterface';
import { AccountInterface } from '../interfaces/AccountInterface';
import { AchievementItemInterface } from '../interfaces/Achievement';
import { buildLocationInfo } from './placesBuilder';
import { VKeyedCollection } from '../../utils/vTypes';
import {
    isAdmin,
    isEnabled,
    createSimplifiedPublicKey,
} from '../../utils/Utils';

/**
 *
 * @param pAccount
 * @param domain
 * @returns the limited "user" info.. used by /api/v1/users
 */
export async function buildUserInfo(
    pAccount: AccountInterface,
    domain?: DomainInterface
): Promise<any> {
    return {
        accountId: pAccount.id,
        id: pAccount.id,
        username: pAccount.username,
        images: await buildImageInfo(pAccount),
        location: await buildLocationInfo(pAccount, domain),
    };
}

export async function buildImageInfo(pAccount: AccountInterface): Promise<any> {
    const ret: VKeyedCollection = {};

    if (pAccount.imagesTiny) ret.tiny = pAccount.imagesTiny;
    if (pAccount.imagesHero) ret.hero = pAccount.imagesHero;
    if (pAccount.imagesThumbnail) ret.thumbnail = pAccount.imagesThumbnail;
    return ret;
}

// Return the block of account information.
// Used by several of the requests to return the complete account information.
export async function buildAccountInfo(
    pAccount: AccountInterface,
    domain?: DomainInterface
): Promise<any> {
    return {
        accountId: pAccount.id,
        id: pAccount.id,
        username: pAccount.username,
        email: pAccount.email,
        bio: pAccount.bio,
        country: pAccount.country,
        administrator: isAdmin(pAccount),
        enabled: isEnabled(pAccount),
        roles: pAccount.roles,
        availability: pAccount.availability,
        public_key: createSimplifiedPublicKey(pAccount.sessionPublicKey),
        images: {
            hero: pAccount.imagesHero,
            tiny: pAccount.imagesTiny,
            thumbnail: pAccount.imagesThumbnail,
        },
        profile_detail: pAccount.profileDetail,
        location: await buildLocationInfo(pAccount, domain),
        friends: pAccount.friends,
        connections: pAccount.connections,
        when_account_created: pAccount.whenCreated?.toISOString(),
        when_account_created_s: pAccount.whenCreated?.getTime().toString(),
        time_of_last_heartbeat: pAccount.timeOfLastHeartbeat?.toISOString(),
        time_of_last_heartbeat_s: pAccount.timeOfLastHeartbeat
            ?.getTime()
            .toString(),
        lastOnline: pAccount.lastOnline,
        achievementId: pAccount.achievementId,
    };
}

/**
 * Anyone can fetch a profile (if 'availability' is 'any') so not all info is returned
 * @param pAccount
 * @param aDomain
 * @returns the block of account information used as the account 'profile'.
 */
export async function buildAccountProfile(
    pAccount: AccountInterface,
    aDomain?: DomainInterface,
    achievementItemInterface?: AchievementItemInterface
): Promise<any> {
    return {
        accountId: pAccount.id,
        id: pAccount.id,
        username: pAccount.username,
        images: {
            hero: pAccount.imagesHero,
            tiny: pAccount.imagesTiny,
            thumbnail: pAccount.imagesThumbnail,
        },
        profile_detail: pAccount.profileDetail,
        location: await buildLocationInfo(pAccount, aDomain),
        when_account_created: pAccount.whenCreated?.toISOString(),
        when_account_created_s: pAccount.whenCreated?.getTime().toString(),
        time_of_last_heartbeat: pAccount.timeOfLastHeartbeat?.toISOString(),
        time_of_last_heartbeat_s: pAccount.timeOfLastHeartbeat
            ?.getTime()
            .toString(),
        level: pAccount.level,
        bio: pAccount.bio,
        country: pAccount.country,
        lastOnline: pAccount.lastOnline,
        achievement: {
            id: achievementItemInterface?.id,
            icon: achievementItemInterface?.icon,
            name: achievementItemInterface?.name,
            description: achievementItemInterface?.description,
        },
        ethereumAddress: pAccount?.ethereumAddress
    };
}

/**
 * Anyone can fetch a profile (if 'availability' is 'any') so not all info is returned
 * @param pAccount
 * @param aDomain
 * @returns the block of account information used as the account 'profile'.
 */
export function buildCreateUserInfo(account: AccountInterface): any {
    return {
        id: account.id,
        accountId: account.id,
        username: account.username,
        accountIsActive: account.accountIsActive,
        accountWaitingVerification: account.accountWaitingVerification,
    };
}

export function buildTokenInfo(pToken: any): any {
    return {
        id: pToken.id,
        tokenid: pToken.id,
        token: pToken.token,
        refresh_token: pToken.refreshToken,
        token_creation_time: pToken.whenCreated?.toISOString(),
        token_expiration_time: pToken.expirationTime?.toISOString(),
        scope: pToken.scope,
    };
}

