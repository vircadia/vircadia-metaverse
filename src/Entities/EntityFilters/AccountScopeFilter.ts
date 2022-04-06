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


import { Request } from "express";
import { CriteriaFilter } from "@Entities/EntityFilters/CriteriaFilter";
import { Accounts } from "@Entities/Accounts";
import { AccountEntity } from "@Entities/AccountEntity";
import { Logger } from "@Tools/Logging";
import { prototype } from "events";

// AccountScopeFilter filters a query stream to the accounts the requestor
//    can look at. That is, a person can normally see only the domains
//    that they sponsor.
//  &asAdmin=true
//  &acct=targetAccountId
export class AccountScopeFilter extends CriteriaFilter {
    private _asAdmin = false;
    private _accessingAcct: AccountEntity;
    private _field: string;
    private _targetAcct: string = undefined;

    // Set to 'true' if the pagination was passed in the criteria query parameters
    private _doingQuery = false;

    // Create a new filter and specify the requesting account and
    //     field in target entity to check for match.
    // "accountId" works for most things but scoping domains by their owners
    //     requires checking "sponsorAccountId">
    public constructor(pRequestorAccount: AccountEntity, pField = "id") {
        super();
        this._accessingAcct = pRequestorAccount;
        this._field = pField;

    }

    public parametersFromRequest(pRequest: Request): void {
        try {
            if (pRequest.query.hasOwnProperty("asAdmin")) {
                const askingForAdmin = pRequest.query.asAdmin === "true";
                if (askingForAdmin) {
                    if (Accounts.isAdmin(this._accessingAcct)) {
                        this._asAdmin = true;
                    }
                }
            }
            // The administrator can specify an account to limit requests to
            if (pRequest.query.acct) {
                this._targetAcct = pRequest.query.account as string;
            }
            Logger.cdebug("query-detail", `AccountScopeFilter.parametersFromRequest: asAdmin=${this._asAdmin}, target=${this._targetAcct}`);
        } catch (e) {
            Logger.error("AccountScopeFilter: parameters from request: exception: " + e);
        }
    }

    // Add any parameters to the response
    public addResponseFields(pRequest: Request) {

    }

    // Return if we've found admin enabling parameters
    public AsAdmin(): boolean {
        return this._asAdmin;
    }

    public criteriaTest(pToTest: any): boolean {
        if (!this._doingQuery) {
            if (this._asAdmin) {
                if (this._targetAcct) {
                    return typeof pToTest[this._field] !== "undefined"
                && pToTest[this._field] === this._targetAcct;
                }
                return true;
            }
            return typeof pToTest[this._field] !== "undefined"
              && pToTest[this._field] === this._accessingAcct.id;
        }
        return true;
    }

    public async criteriaTestAsync(pThingy: any): Promise<boolean> {
        return this.criteriaTest(pThingy);
    }

    public criteriaParameters(): any {
        this._doingQuery = true;
        const criteria: any = {};
        // If not an admin, the found items must match the id of the requestor
        if (!this._asAdmin) {
            criteria[this._field] = this._accessingAcct.id;
            // Logger.debug(`AccountScopeFilter.criteriaParameters: not admin so limiting to account ${this._accessingAcct.username}`);
        }
        // If an admin and requested scope of target account, do that check
        if (this._asAdmin && typeof this._targetAcct !== "undefined") {
            criteria[this._field] = this._targetAcct;
        }
        return criteria;
    }

    public sortCriteriaParameters(): any {
        return null;
    }
}
