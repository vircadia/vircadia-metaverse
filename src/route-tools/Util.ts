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

import { Request } from 'express';

import { Accounts } from '@Entities/Accounts';
import { AccountEntity } from '@Entities/AccountEntity';

import { Domains } from '@Entities/Domains';
import { DomainEntity } from '@Entities/DomainEntity';

import { Places } from '@Entities/Places';
import { PlaceEntity } from '@Entities/PlaceEntity';

import { GenericFilter } from '@Entities/EntityFilters/GenericFilter';

import { createPublicKey } from 'crypto';
import { VKeyedCollection, VKeyValue } from '@Tools/vTypes';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

import { Maturity } from '@Entities/Sets/Maturity';
import { Visibility } from '@Entities/Sets/Visibility';

// The public_key is sent as a binary (DER) form of a PKCS1 key.
// To keep backward compatibility, we convert the PKCS1 key into a SPKI key in PEM format
//      ("PEM" format is "Privacy Enhanced Mail" format and has the "BEGIN" and "END" text included).
export function convertBinKeyToPEM(pBinKey: Buffer): string {
    // Convert the passed binary into a crypto.KeyObject
    const publicKey = createPublicKey( {
        key: pBinKey,
        format: 'der',
        type: 'pkcs1'
    });
    // Convert the public key to 'SubjectPublicKeyInfo' (SPKI) format as a PEM string
    const convertedKey = publicKey.export({ type: 'spki', format: 'pem' });
    return convertedKey as string;
};

// The legacy interface returns public keys as a stripped PEM key.
// "stripped" in that the bounding "BEGIN" and "END" lines have been removed.
// This routine returns a stripped key string from a properly PEM formatted public key string.
export function createSimplifiedPublicKey(pPubKey: string): string {
    let keyLines: string[] = [];
    if (pPubKey) {
        keyLines = pPubKey.split('\n');
        keyLines.shift(); // Remove the "BEGIN" first line
        while (keyLines.length > 1
                && ( keyLines[keyLines.length-1].length < 1 || keyLines[keyLines.length-1].includes('END PUBLIC KEY') ) ) {
            keyLines.pop();   // Remove the "END" last line
        };
    }
    return keyLines.join('');    // Combine all lines into one long string
};

// Process the user request data and update fields fields in the account.
// This is infomation from the user from heartbeats or location updates.
// Return a VKeyedCollection of the updates made so it can be used to update the database.
export async function updateLocationInfo(pReq: Request): Promise<VKeyedCollection> {
    let newLoc: VKeyedCollection = {};
    if (pReq.vAuthAccount && pReq.body.location) {
        try {
            // build location from what is in the account already
            const loc = pReq.body.location;
            for (const field of ['connected', 'path', 'place_id', 'domain_id',
                            'network_address', 'node_id', 'availability']) {
                if (loc.hasOwnProperty(field)) {
                    await Accounts.setField(pReq.vAuthToken, pReq.vAuthAccount, field, loc[field], pReq.vAuthAccount, newLoc);
                };
            };
        }
        catch ( err ) {
            Logger.error(`procPutUserLocation: exception parsing put from ${pReq.vAuthAccount.username}: ${err}`);
            pReq.vRestResp.respondFailure(`exception parsing request: ${err}`);
            newLoc = undefined;
        };
    };
    return newLoc;
};

// The returned location info has many options depending on whether
//    the account has set location and/or has an associated domain.
// Return a structure that represents the target account's domain
export async function buildLocationInfo(pAcct: AccountEntity): Promise<any> {
    let ret: any = {};
    if (pAcct.locationDomainId) {
        const aDomain = await Domains.getDomainWithId(pAcct.locationDomainId);
        if (IsNotNullOrEmpty(aDomain)) {
            ret = {
                'root': {
                    'domain': await buildDomainInfo(aDomain),
                },
                'path': pAcct.locationPath,
            };
        }
        else {
            // The domain doesn't have an ID
            ret = {
                'root': {
                    'domain': {
                        'network_address': pAcct.locationNetworkAddress,
                        'network_port': pAcct.locationNetworkPort
                    }
                }
            };
        };
    };
    ret.node_id = pAcct.locationNodeId;
    ret.online = Accounts.isOnline(pAcct)
    return ret;
};

// A smaller, top-level domain info block
export async function buildDomainInfo(pDomain: DomainEntity): Promise<any> {
    return {
        'id': pDomain.id,
        'domainId': pDomain.id,
        'name': pDomain.name,
        'visibility': pDomain.visibility ?? Visibility.OPEN,
        'capacity': pDomain.capacity,
        'sponsorAccountId': pDomain.sponsorAccountId,
        'label': pDomain.name,
        'network_address': pDomain.networkAddr,
        'network_port': pDomain.networkPort,
        'ice_server_address': pDomain.iceServerAddr,
        'version': pDomain.version,
        'protocol_version': pDomain.protocol,
        'active': pDomain.active ?? false,
        'time_of_last_heartbeat': pDomain.timeOfLastHeartbeat?.toISOString(),
        'time_of_last_heartbeat_s': pDomain.timeOfLastHeartbeat?.getTime().toString(),
        'num_users': pDomain.numUsers + pDomain.anonUsers
    };
};

// Return a structure with the usual domain information.
export async function buildDomainInfoV1(pDomain: DomainEntity): Promise<any> {
    return {
        'domainId': pDomain.id,
        'id': pDomain.id,       // legacy
        'name': pDomain.name,
        'visibility': pDomain.visibility ?? Visibility.OPEN,
        'world_name': pDomain.name,   // legacy
        'label': pDomain.name,        // legacy
        'public_key': pDomain.publicKey ? createSimplifiedPublicKey(pDomain.publicKey) : undefined,
        'owner_places': await buildPlacesForDomain(pDomain),
        'sponsor_account_id': pDomain.sponsorAccountId,
        'ice_server_address': pDomain.iceServerAddr,
        'version': pDomain.version,
        'protocol_version': pDomain.protocol,
        'network_address': pDomain.networkAddr,
        'network_port': pDomain.networkPort,
        'automatic_networking': pDomain.networkingMode,
        'restricted': pDomain.restricted,
        'num_users': pDomain.numUsers,
        'anon_users': pDomain.anonUsers,
        'total_users': pDomain.numUsers + pDomain.anonUsers,
        'capacity': pDomain.capacity,
        'description': pDomain.description,
        'maturity': pDomain.maturity ?? Maturity.UNRATED,
        'restriction': pDomain.restriction,
        'managers': pDomain.managers,
        'tags': pDomain.tags,
        'meta': {
            'capacity': pDomain.capacity,
            'contact_info': pDomain.contactInfo,
            'description': pDomain.description,
            'images': pDomain.images,
            'managers': pDomain.managers,
            'restriction': pDomain.restriction,
            'tags': pDomain.tags,
            'thumbnail': pDomain.thumbnail,
            'world_name': pDomain.name
        },
        'users': {
            'num_anon_users': pDomain.anonUsers,
            'num_users': pDomain.numUsers,
            'user_hostnames': pDomain.hostnames
        },
        'time_of_last_heartbeat': pDomain.timeOfLastHeartbeat?.toISOString(),
        'time_of_last_heartbeat_s': pDomain.timeOfLastHeartbeat?.getTime().toString(),
        'last_sender_key': pDomain.lastSenderKey,
        'addr_of_first_contact': pDomain.iPAddrOfFirstContact,
        'when_domain_entry_created': pDomain.whenCreated?.toISOString(),
        'when_domain_entry_created_s': pDomain.whenCreated?.getTime().toString()
    };
};

// Return the limited "user" info.. used by /api/v1/users
export async function buildUserInfo(pAccount: AccountEntity): Promise<any> {
    return {
        'accountId': pAccount.id,
        'id': pAccount.id,
        'username': pAccount.username,
        'images': await buildImageInfo(pAccount),
        'location': await buildLocationInfo(pAccount),
    };
};

export async function buildImageInfo(pAccount: AccountEntity): Promise<any> {
    const ret: VKeyedCollection = {};
    if (pAccount.imagesTiny) ret.tiny = pAccount.imagesTiny;
    if (pAccount.imagesHero) ret.hero = pAccount.imagesHero;
    if (pAccount.imagesThumbnail) ret.thumbnail = pAccount.imagesThumbnail;
    return ret;
};

// Return the block of account information.
// Used by several of the requests to return the complete account information.
export async function buildAccountInfo(pReq: Request, pAccount: AccountEntity): Promise<any> {
    return {
        'accountId': pAccount.id,
        'id': pAccount.id,
        'username': pAccount.username,
        'email': pAccount.email,
        'administrator': Accounts.isAdmin(pAccount),
        'enabled': Accounts.isEnabled(pAccount),
        'roles': pAccount.roles,
        'availability': pAccount.availability,
        'public_key': createSimplifiedPublicKey(pAccount.sessionPublicKey),
        'images': {
            'hero': pAccount.imagesHero,
            'tiny': pAccount.imagesTiny,
            'thumbnail': pAccount.imagesThumbnail
        },
        'profile_detail': pAccount.profileDetail,
        'location': await buildLocationInfo(pAccount),
        'friends': pAccount.friends,
        'connections': pAccount.connections,
        'when_account_created': pAccount.whenCreated?.toISOString(),
        'when_account_created_s': pAccount.whenCreated?.getTime().toString(),
        'time_of_last_heartbeat': pAccount.timeOfLastHeartbeat?.toISOString(),
        'time_of_last_heartbeat_s': pAccount.timeOfLastHeartbeat?.getTime().toString(),
    };
};
// Return the block of account information used as the account 'profile'.
// Anyone can fetch a profile (if 'availability' is 'any') so not all info is returned
export async function buildAccountProfile(pReq: Request, pAccount: AccountEntity): Promise<any> {
    return {
        'accountId': pAccount.id,
        'id': pAccount.id,
        'username': pAccount.username,
        'images': {
            'hero': pAccount.imagesHero,
            'tiny': pAccount.imagesTiny,
            'thumbnail': pAccount.imagesThumbnail
        },
        'profile_detail': pAccount.profileDetail,
        'location': await buildLocationInfo(pAccount),
        'when_account_created': pAccount.whenCreated?.toISOString(),
        'when_account_created_s': pAccount.whenCreated?.getTime().toString(),
        'time_of_last_heartbeat': pAccount.timeOfLastHeartbeat?.toISOString(),
        'time_of_last_heartbeat_s': pAccount.timeOfLastHeartbeat?.getTime().toString(),
    };
};

// Return an object with the formatted place information
// Pass the PlaceEntity and the place's domain if known.
export async function buildPlaceInfo(pPlace: PlaceEntity, pDomain?: DomainEntity): Promise<any> {
    const ret = await buildPlaceInfoSmall(pPlace, pDomain);

    // if the place points to a domain, add that information also
    if (IsNotNullOrEmpty(pPlace.domainId)) {
        const aDomain = pDomain ?? await Domains.getDomainWithId(pPlace.domainId);
        if (aDomain) {
            ret.domain = await buildDomainInfo(aDomain);
        };
    };
    return ret;
};
// Return the basic information block for a Place
export async function buildPlaceInfoSmall(pPlace: PlaceEntity, pDomain?: DomainEntity): Promise<any> {
    const ret: VKeyedCollection =  {
        'placeId': pPlace.id,
        'id': pPlace.id,
        'name': pPlace.name,
        'visibility': pPlace.visibility ?? Visibility.OPEN,
        'address': await Places.getAddressString(pPlace),
        'path': pPlace.path,
        'description': pPlace.description,
        'maturity': pPlace.maturity ?? Maturity.UNRATED,
        'tags': pPlace.tags,
        'managers': await Places.getManagers(pPlace),
        'thumbnail': pPlace.thumbnail,
        'images': pPlace.images,
        'current_attendance': pPlace.currentAttendance ?? 0,
        'current_images': pPlace.currentImages,
        'current_info': pPlace.currentInfo,
        'current_last_update_time': pPlace.currentLastUpdateTime?.toISOString(),
        'current_last_update_time_s': pPlace.currentLastUpdateTime?.getTime().toString(),
        'last_activity_update': pPlace.lastActivity?.toISOString(),
        'last_activity_update_s': pPlace.lastActivity?.getTime().toString()
    };
    return ret;
};

// Return an array of Places names that are associated with the passed domain
export async function buildPlacesForDomain(pDomain: DomainEntity): Promise<any[]> {
    const ret: any[] = [];
    for await (const aPlace of Places.enumerateAsync(new GenericFilter({ 'domainId': pDomain.id }))) {
        ret.push(await buildPlaceInfoSmall(aPlace, pDomain));
    };
    return ret;
};