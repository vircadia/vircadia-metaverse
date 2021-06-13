//   Copyright 2021 Vircadia Contributors
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

import Config from '@Base/config';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';
import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { PlaceFilterInfo } from '@Entities/EntityFilters/PlaceFilterInfo';
import { buildPlaceInfo } from '@Route-Tools/Util';

import { Domains } from '@Entities/Domains';
import { Places } from '@Entities/Places';
import { PlaceEntity } from '@Entities/PlaceEntity';
import { Accounts } from '@Entities/Accounts';
import { Maturity } from '@Entities/Sets/Maturity';

import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

// Return places that don't have an associated domain
const procPlacesUnhooked: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    const pager = new PaginationInfo();
    const placer = new PlaceFilterInfo();

    pager.parametersFromRequest(req);
    placer.parametersFromRequest(req);

    if (req.vRestResp && req.vAuthAccount) {
        if (Accounts.isAdmin(req.vAuthAccount)) {
            // Loop through all the filtered accounts and create array of info
            const places: any[] = [];
            for await (const aPlace of unhookedPlaces(placer, pager)) {
                places.push(await buildPlaceInfo(aPlace));
            };

            req.vRestResp.Data = {
                'places': places,
                // Maturity catagories added so client knows what is defined in the metaverse-server
                'maturity-categories': Maturity.MaturityCategories
            };
        }
        else {
            req.vRestResp.respondFailure('not admin');
        };
    }
    else {
        req.vRestResp.respondFailure('must have account for access');
    };

    placer.addResponseFields(req);
    pager.addResponseFields(req);

    next();
};
// Delete places that don't have an associated domain
const procPlacesDeleteUnhooked: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    const pager = new PaginationInfo();
    const placer = new PlaceFilterInfo();

    pager.parametersFromRequest(req);
    placer.parametersFromRequest(req);

    if (req.vRestResp && req.vAuthAccount) {
        if (Accounts.isAdmin(req.vAuthAccount)) {
            for await (const aPlace of unhookedPlaces(placer, pager)) {
                Logger.info(`DeleteUnhooked: deleting place ${aPlace.name} for having no domain`);
                Places.removePlace(aPlace);
            };
        }
        else {
            req.vRestResp.respondFailure('not admin');
        };
    }
    else {
        req.vRestResp.respondFailure('must have account for access');
    };

    placer.addResponseFields(req);
    pager.addResponseFields(req);

    next();
};
// Return a stream of PlaceEntity's that do not have a domain or a domain that isn't addressable
async function *unhookedPlaces(pPager: CriteriaFilter, pInfoer?: CriteriaFilter): AsyncGenerator<PlaceEntity> {
    for await (const aPlace of Places.enumerateAsync(pPager, pInfoer)) {
        const aDomain = await Domains.getDomainWithId(aPlace.domainId);
        if (IsNullOrEmpty(aDomain) || IsNullOrEmpty(aDomain.networkAddr)) {
            yield aPlace;
        };
    };
};

// Return places that haven't pinged in a while
const procPlacesInactive: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    const pager = new PaginationInfo();
    const placer = new PlaceFilterInfo();

    pager.parametersFromRequest(req);
    placer.parametersFromRequest(req);

    if (req.vRestResp && req.vAuthAccount) {
        if (Accounts.isAdmin(req.vAuthAccount)) {
            const places: any[] = [];
            for await (const aPlace of inactivePlaces(placer, pager)) {
                places.push(await buildPlaceInfo(aPlace));
            };

            req.vRestResp.Data = {
                'places': places,
                // Maturity catagories added so client knows what is defined in the metaverse-server
                'maturity-categories': Maturity.MaturityCategories
            };
        }
        else {
            req.vRestResp.respondFailure('not admin');
        };
    }
    else {
        req.vRestResp.respondFailure('must have account for access');
    };

    placer.addResponseFields(req);
    pager.addResponseFields(req);

    next();
};
// Delete places that haven't pinged in a while
const procPlacesDeleteInactive: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    const pager = new PaginationInfo();
    const placer = new PlaceFilterInfo();

    pager.parametersFromRequest(req);
    placer.parametersFromRequest(req);

    if (req.vRestResp && req.vAuthAccount) {
        if (Accounts.isAdmin(req.vAuthAccount)) {
            for await (const aPlace of inactivePlaces(placer, pager)) {
                Logger.info(`DeleteInactive: deleting place ${aPlace.name} for being inactive`);
                Places.removePlace(aPlace);
            };
        }
        else {
            req.vRestResp.respondFailure('not admin');
        };
    }
    else {
        req.vRestResp.respondFailure('must have account for access');
    };

    placer.addResponseFields(req);
    pager.addResponseFields(req);

    next();
};
// Return a stream of PlaceEntity's that do not have a domain or a domain that isn't addressable
async function *inactivePlaces(pPager: CriteriaFilter, pInfoer?: CriteriaFilter): AsyncGenerator<PlaceEntity> {
    const inactivePlaceTime = new Date(Date.now()
                    - (Config['metaverse-server']['place-inactive-timeout-minutes'] * 60 * 1000));
    for await (const aPlace of Places.enumerateAsync(pPager, pInfoer)) {
        if (IsNotNullOrEmpty(aPlace.lastActivity) || aPlace.lastActivity < inactivePlaceTime) {
            yield aPlace;
        };
    };
};

export const name = '/api/maint/places/';

export const router = Router();

// Return places that don't have an associated domain
router.get('/api/maint/places/unhooked', [ setupMetaverseAPI,
                                          accountFromAuthToken,
                                          procPlacesUnhooked,
                                          finishMetaverseAPI ] );
// Delete the places that are unhooked
router.delete('/api/maint/places/unhooked', [ setupMetaverseAPI,
                                          accountFromAuthToken,
                                          procPlacesDeleteUnhooked,
                                          finishMetaverseAPI ] );
// Return places that haven't pinged in a while
router.get('/api/maint/places/inactive', [ setupMetaverseAPI,
                                          accountFromAuthToken,
                                          procPlacesInactive,
                                          finishMetaverseAPI ] );
// Delete the places that are inactive
router.delete('/api/maint/places/inactive', [ setupMetaverseAPI,
                                          accountFromAuthToken,
                                          procPlacesDeleteInactive,
                                          finishMetaverseAPI ] );
