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

import bcrypt from 'bcryptjs';
import { createPublicKey } from 'crypto';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import config from '../appconfig';
import { AccountInterface } from '../common/interfaces/AccountInterface';
import { Roles } from '../common/sets/Roles';
import { SArray } from './vTypes';
import { blackListedMail } from './blacklistArray';
import { hashPasswordSalt } from './Misc';

// The legacy interface returns public keys as a stripped PEM key.
// "stripped" in that the bounding "BEGIN" and "END" lines have been removed.
// This routine returns a stripped key string from a properly PEM formatted public key string.
export function createSimplifiedPublicKey(pPubKey: string): string {
    let keyLines: string[] = [];
    if (pPubKey) {
        keyLines = pPubKey.split('\n');
        keyLines.shift(); // Remove the "BEGIN" first line
        while (
            keyLines.length > 1 &&
            (keyLines[keyLines.length - 1].length < 1 ||
                keyLines[keyLines.length - 1].includes('END PUBLIC KEY'))
        ) {
            keyLines.pop(); // Remove the "END" last line
        }
    }
    return keyLines.join(''); // Combine all lines into one long string
}

export function convertBinKeyToPEM(pBinKey: Buffer): string {
    // Convert the passed binary into a crypto.KeyObject
    const publicKey = createPublicKey({
        key: pBinKey,
        format: 'der',
        type: 'pkcs1',
    });
    // Convert the public key to 'SubjectPublicKeyInfo' (SPKI) format as a PEM string
    const convertedKey = publicKey.export({ type: 'spki', format: 'pem' });
    return convertedKey as string;
}

// getter property that is 'true' if the user is a grid administrator
export function isAdmin(pAcct: AccountInterface): boolean {
    return SArray.has(pAcct.roles, Roles.ADMIN);
}
// Any logic to test of account is active
//   Currently checks if account email is verified or is legacy
//   account (no 'accountEmailVerified' variable)
export function isEnabled(pAcct: AccountInterface): boolean {
    return pAcct.accountEmailVerified ?? true;
}

export async function validatePassword(
    pAcct: AccountInterface,
    pPassword: string
): Promise<boolean> {
    return (
        hashPasswordSalt(pPassword, pAcct.passwordSalt) === pAcct.passwordHash
    );
}

export function isOnline(pAcct: AccountInterface): boolean {
    if (pAcct && pAcct.timeOfLastHeartbeat) {
        return (
            Date.now().valueOf() - pAcct.timeOfLastHeartbeat.valueOf() <
            config.metaverseServer.heartbeat_seconds_until_offline * 1000
        );
    }
    return false;
}

export function couldBeDomainId(pId: string): boolean {
    return pId.length === 36;
}

// Return the ISODate when an account is considered offline
export function dateWhenNotOnline(): Date {
    const whenOffline = new Date(
        Date.now() -
            (config.metaverseServer.heartbeat_seconds_until_offline * 1000)
    );
    return whenOffline;
}

export function dateWhenNotActive(): Date {
    const whenNotActive = new Date(
        Date.now() -
            (config.metaverseServer.domain_seconds_until_offline * 1000)
    );
    return whenNotActive;
}

export function isValidateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@/;
    const emailBeforeAt = email.match(regex);

    try {
        const emailDomain = email.split('@')[1].toLowerCase();
        if (!blackListedMail.includes(emailDomain) && emailBeforeAt) {
            return true;
        }
    } catch (e) {}
    return false;
}

export function isValidateUsername(username: string): boolean {
    const usernameRegexp = /^[a-zA-Z0-9.\-_$@*!]{2,30}$/;
    return usernameRegexp.test(username);
}

export function getUtcDate(): Date {
    return convertLocalToUtc(new Date());
}

export function convertLocalToUtc(date: Date): Date {
    return moment.utc(date).toDate();
}

export function generateRandomNumber(length: number): number {
    return (
        Math.floor(Math.random() * (9 * Math.pow(10, length - 1))) +
        Math.pow(10, length - 1)
    );
}

export function getSha256(value: string): string {
    return CryptoJS.SHA256(value).toString();
}

export function getGameUserLevel(xp: number): number {
    if (xp >= 90000) {
        return 22;
    } else if (xp >= 85000) {
        return 21;
    } else if (xp >= 80000) {
        return 20;
    } else if (xp >= 75000) {
        return 19;
    } else if (xp >= 70000) {
        return 18;
    } else if (xp >= 65000) {
        return 17;
    } else if (xp >= 60000) {
        return 16;
    } else if (xp >= 55000) {
        return 15;
    } else if (xp >= 50000) {
        return 14;
    } else if (xp >= 45000) {
        return 13;
    } else if (xp >= 40000) {
        return 12;
    } else if (xp >= 35000) {
        return 11;
    } else if (xp >= 30000) {
        return 10;
    } else if (xp >= 25000) {
        return 9;
    } else if (xp >= 20000) {
        return 8;
    } else if (xp >= 15000) {
        return 7;
    } else if (xp >= 10000) {
        return 6;
    } else if (xp >= 7000) {
        return 5;
    } else if (xp >= 4000) {
        return 4;
    } else if (xp >= 2000) {
        return 3;
    } else if (xp >= 500) {
        return 2;
    } else {
        return 1;
    }
}

export const isValidArray = (arr: any[]): boolean => {
    return Array.isArray(arr) && arr.length > 0;
};

export const isValidObject = (obj: any): boolean => {
    return obj && Object.keys(obj).length > 0;
};
