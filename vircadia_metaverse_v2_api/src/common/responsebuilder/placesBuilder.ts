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

import { DatabaseService } from '../dbservice/DatabaseService';
import { AccountInterface } from '../interfaces/AccountInterface';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../../utils/Misc';
import { buildDomainInfo } from './domainsBuilder';
import { DomainInterface } from '../interfaces/DomainInterface';
import { isOnline } from '../../utils/Utils';
import { PlaceInterface } from '../interfaces/PlaceInterface';
import { Visibility } from '../sets/Visibility';
import { Maturity } from '../sets/Maturity';
import config from '../../appconfig';
// The returned location info has many options depending on whether
//    the account has set location and/or has an associated domain.
// Return a structure that represents the target account's domain

export async function buildLocationInfo(
    pAcct: AccountInterface,
    aDomain?: DomainInterface
): Promise<any> {
    let ret: any = {};
    if (pAcct.locationDomainId) {
        if (IsNotNullOrEmpty(aDomain) && aDomain) {
            ret = {
                root: {
                    domain: await buildDomainInfo(aDomain),
                },
                path: pAcct.locationPath,
            };
        } else {
            // The domain doesn't have an ID
            ret = {
                root: {
                    domain: {
                        network_address: pAcct.locationNetworkAddress,
                        network_port: pAcct.locationNetworkPort,
                    },
                },
            };
        }
    }
    ret.node_id = pAcct.locationNodeId;
    ret.path = pAcct.locationPath;
    ret.online = isOnline(pAcct);
    return ret;
}

// Return an object with the formatted place information
// Pass the PlaceInterface and the place's domain if known.
export async function buildPlaceInfo(
    db: DatabaseService,
    pPlace: PlaceInterface,
    pDomain?: DomainInterface
): Promise<any> {
    const ret = await buildPlaceInfoSmall(db, pPlace, pDomain);

    // if the place points to a domain, add that information also
    if (IsNotNullOrEmpty(pDomain) && pDomain) {
        ret.domain = await buildDomainInfo(pDomain);
    }
    return ret;
}

export async function getAddressString(
    pPlace: PlaceInterface,
    aDomain?: DomainInterface
): Promise<string> {
    // Compute and return the string for the Places's address.
    // The address is of the form "optional-domain/x,y,z/x,y,z,w".
    // If the domain is missing, the domain-server's network address is added
    let addr = pPlace.path ?? '/0,0,0/0,0,0,1';

    // If no domain/address specified in path, build addr using reported domain IP/port
    const pieces = addr.split('/');
    if (pieces[0].length === 0) {
        if (IsNotNullOrEmpty(aDomain) && aDomain) {
            if (IsNotNullOrEmpty(aDomain.networkAddr)) {
                let domainAddr = aDomain.networkAddr;
                if (IsNotNullOrEmpty(aDomain.networkPort)) {
                    domainAddr =
                        aDomain.networkAddr + ':' + aDomain.networkPort;
                }
                addr = domainAddr + addr;
            }
        }
    }
    return addr;
}

// Return the basic information block for a Place
export async function buildPlaceInfoSmall(
    db: DatabaseService,
    pPlace: PlaceInterface,
    pDomain?: DomainInterface
): Promise<any> {
    const ret = {
        placeId: pPlace.id,
        id: pPlace.id,
        name: pPlace.name,
        displayName: pPlace.displayName,
        visibility: pPlace.visibility ?? Visibility.OPEN,
        address: getAddressString(pPlace, pDomain),
        path: pPlace.path,
        description: pPlace.description,
        maturity: pPlace.maturity ?? Maturity.UNRATED,
        tags: pPlace.tags,
        managers: await getManagers(db, pPlace, pDomain),
        thumbnail: pPlace.thumbnail,
        images: pPlace.images,
        current_attendance: pPlace.currentAttendance ?? 0,
        current_images: pPlace.currentImages,
        current_info: pPlace.currentInfo,
        current_last_update_time: pPlace.currentLastUpdateTime?.toISOString(),
        current_last_update_time_s: pPlace.currentLastUpdateTime
            ?.getTime()
            .toString(),
        last_activity_update: pPlace.lastActivity?.toISOString(),
        last_activity_update_s: pPlace.lastActivity?.getTime().toString(),
    };
    return ret;
}

async function getManagers(
    db: DatabaseService,
    pPlace: PlaceInterface,
    aDomain?: DomainInterface
): Promise<string[]> {
    if (IsNullOrEmpty(pPlace.managers)) {
        pPlace.managers = [];
        if (aDomain) {
            const aAccount = await db.getData(
                config.dbCollections.accounts,
                aDomain.sponsorAccountId
            );
            if (aAccount) {
                pPlace.managers = [aAccount.username];
                await db.patchData(config.dbCollections.places, pPlace.id, {
                    managers: pPlace.managers,
                });
            }
        }
    }
    return pPlace.managers;
}

// Return an array of Places names that are associated with the passed domain
export async function buildPlacesForDomain(
    db: DatabaseService,
    pDomain: DomainInterface
): Promise<any[]> {
    const ret: any[] = [];
    const placeList: PlaceInterface[] = await db.findDataToArray(
        config.dbCollections.places,
        { query: { domainId: pDomain.id } }
    );
    for (const aPlace of placeList) {
        ret.push(await buildPlaceInfoSmall(db, aPlace, pDomain));
    }
    return ret;
}
