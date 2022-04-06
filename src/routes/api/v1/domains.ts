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


import { Router, RequestHandler, Request, Response, NextFunction } from "express";
import { setupMetaverseAPI, finishMetaverseAPI } from "@Route-Tools/middleware";
import { accountFromAuthToken } from "@Route-Tools/middleware";

import { Domains } from "@Entities/Domains";
import { Places } from "@Entities/Places";
import { DomainFields } from "@Entities/DomainFields";
import { buildDomainInfoV1 } from "@Route-Tools/Util";
import { buildDomainInfo, buildPlaceInfo } from "@Route-Tools/Util";

import { PaginationInfo } from "@Entities/EntityFilters/PaginationInfo";
import { AccountScopeFilter } from "@Entities/EntityFilters/AccountScopeFilter";
import { VisibilityFilter } from "@Entities/EntityFilters/VisibilityFilter";
import { HTTPStatusCode } from "@Route-Tools/RESTResponse";

import { GenUUID, IsNotNullOrEmpty } from "@Tools/Misc";
import { Logger } from "@Tools/Logging";

// GET /api/v1/domains
const procGetDomains: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vAuthAccount) {

        const pager = new PaginationInfo();
        const scoper = new AccountScopeFilter(req.vAuthAccount, "sponsorAccountId");
        const visibilitier = new VisibilityFilter(req.vAuthAccount);

        pager.parametersFromRequest(req);
        scoper.parametersFromRequest(req);
        // NOTE: until the DB uses aggregation queries, visibilitier cannot be used as a criteriaFilter
        visibilitier.parametersFromRequest(req);

        const domainArray: any[] = [];
        for await (const aDomain of Domains.enumerateAsync(scoper, pager)) {
            if (await visibilitier.criteriaTestAsync(req.vAuthAccount, aDomain)) {
                domainArray.push(await buildDomainInfoV1(aDomain));
            }
        }
        req.vRestResp.Data = {
            "domains": domainArray
        };

        visibilitier.addResponseFields(req);
        scoper.addResponseFields(req);
        pager.addResponseFields(req);
    } else {
        req.vRestResp.respondFailure(req.vAccountError ?? "Not logged in");
        req.vRestResp.HTTPStatus = HTTPStatusCode.Unauthorized;
    }
    next();
};

// Create a domain entry
const procPostDomains: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vAuthAccount) {
        if (req.body && req.body.domain && req.body.domain.label) {
            const newDomainName = req.body.domain.label;
            if (IsNotNullOrEmpty(newDomainName)) {
                const ifValid = await DomainFields.name.validate(DomainFields.name, req.vAuthAccount, newDomainName);
                if (ifValid.valid) {
                    const generatedAPIkey: string = GenUUID();

                    const newDomain = Domains.createDomain();
                    newDomain.name = newDomainName;
                    newDomain.apiKey = generatedAPIkey;
                    if (req.vSenderKey) {
                        newDomain.iPAddrOfFirstContact = req.vSenderKey;
                    }

                    if (req.body.domain.network_address) {
                        newDomain.networkAddr = req.body.domain.network_address;
                    }
                    if (req.body.domain.network_port) {
                        newDomain.networkPort = req.body.domain.network_port;
                    }
                    // Domain is associated with the account that is logged in for the creation
                    Logger.debug(`procPostDomains: associating account ${req.vAuthToken.accountId} with new domain ${newDomain.id}`);
                    newDomain.sponsorAccountId = req.vAuthToken.accountId;

                    // Creating a domain also creates a Place for that domain
                    // Note that place names are unique so we modify the place name if there is already one.
                    const newPlacename = await Places.uniqifyPlaceName(newDomain.name);
                    const newPlace = await Places.createPlace(req.vAuthToken.accountId);
                    newPlace.domainId = newDomain.id;
                    newPlace.name = newPlacename;
                    newPlace.description = "A place in " + newDomain.name;
                    newPlace.maturity = newDomain.maturity;
                    newPlace.iPAddrOfFirstContact = req.vSenderKey;
                    newPlace.managers = [req.vAuthAccount.username];

                    // Now that the local structures are updated, store the new entries
                    Domains.addDomain(newDomain);
                    Places.addPlace(newPlace);

                    const domainInfo = await buildDomainInfo(newDomain);
                    domainInfo.api_key = newDomain.apiKey;

                    req.vRestResp.Data = {
                        "domain": domainInfo,
                        "place": await buildPlaceInfo(newPlace, newDomain)
                    };

                    // some legacy requests want the domain information at the top level
                    req.vRestResp.addAdditionalField("domain", domainInfo);
                } else {
                    req.vRestResp.respondFailure(ifValid.reason ?? "invalid domain name");
                }
            } else {
                req.vRestResp.respondFailure("label was empty");
            }
        } else {
            req.vRestResp.respondFailure("no label supplied");
        }
    } else {
        req.vRestResp.respondFailure(req.vAccountError ?? "Not logged in");
    }
    next();
};

export const name = "/api/v1/domains";

export const router = Router();

router.get("/api/v1/domains", [
    setupMetaverseAPI,    // req.vRestResp, req.vAuthToken
    accountFromAuthToken, // req.vAuthAccount
    procGetDomains,
    finishMetaverseAPI
]);
router.post("/api/v1/domains", [
    setupMetaverseAPI,    // req.vRestResp, req.vAuthToken
    accountFromAuthToken, // req.vAuthAccount
    procPostDomains,
    finishMetaverseAPI
]);
