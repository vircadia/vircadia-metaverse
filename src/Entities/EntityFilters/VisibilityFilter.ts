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

import { Request } from 'express';
import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { Visibility } from '@Entities/Sets/Visibility';
import { Accounts } from '@Entities/Accounts';
import { Domains } from '@Entities/Domains';
import { AccountEntity } from '@Entities/AccountEntity';
import { Logger } from '@Tools/Logging';
import { DomainEntity } from '@Entities/DomainEntity';

// A filter to return entities the requestor can "see".
// This checks for 'friend', 'connection' and 'asAdmin' relationships
//     and returns entities that are friends, etc of the requestor.
//  
// NOTE NOTE NOTE NOTE NOTE
// This filter can't be used as a usual criteria filter because the test
//    requires a DB $LOOKUP operation (to lookup the account of the Place's domain)
//    and this function can't be done until the DB queries use the aggregate() operation.
//    When the DB queries are changed, this can be reworked into a DB filter.
//    Until then, use  the criteriaTestAsync inline to filter.
// NOTE NOTE NOTE NOTE NOTE
// Filter entities that have a 'visibility' field.
// Visibility of such entities depends on the requestor.
// An admin account can make the request 'asAdmin' to see all Places
//  &asAdmin=true
export class VisibilityFilter extends CriteriaFilter {
    private _asAdmin: boolean = false;
    private _accessingAcct: AccountEntity;
    private _accessingAcctName: string;
    private _friends: string[] = [];
    private _connections: string[] = [];

    // Set to 'true' if the pagination was passed in the criteria query parameters
    private _doingQuery: boolean = false;

    // Note that requesting account can be 'undefined'
    public constructor(pRequestorAccount: AccountEntity) {
        super();
        this._accessingAcct = pRequestorAccount;
        return;
    }

    public parametersFromRequest(pRequest: Request) : void {
        try {
            if (this._accessingAcct) {
                this._accessingAcctName = this._accessingAcct.username;
                if (this._accessingAcct.hasOwnProperty('friends')) {
                    this._friends = this._accessingAcct.friends ?? [];
                };
                if (this._accessingAcct.hasOwnProperty('connections')) {
                    this._connections = this._accessingAcct.connections ?? [];
                };
                if (pRequest.query.hasOwnProperty('asAdmin')) {
                    const askingForAdmin = pRequest.query.asAdmin === 'true';
                    if (askingForAdmin) {
                        if (Accounts.isAdmin(this._accessingAcct)) {
                            this._asAdmin = true;
                        };
                    };
                };
            };
            Logger.cdebug('query-detail', `VisibilityFilter.parametersFromRequest: asAdmin=${this._asAdmin}`);
        }
        catch (e) {
            Logger.error('VisibilityFilter: parameters from request: exception: ' + e);
        };
    };

    // Add any parameters to the response
    public addResponseFields(pRequest: Request) {
        return;
    };

    // Return if we've found admin enabling parameters
    public AsAdmin(): boolean {
        return this._asAdmin;
    };

    public criteriaTest(pToTest: any): boolean {
        let ret = this._doingQuery || this._asAdmin;
        if (! ret) {
            if (pToTest.hasOwnProperty('visibility')) {
                ret = pToTest.visibility === Visibility.OPEN
            }
            else {
                ret = true;
            };
        }
        return ret;
    };

    public async criteriaTestAsync(pToTest: any, pDomain?: DomainEntity): Promise<boolean> {
        let ret = this._doingQuery || this._asAdmin;
        if (! ret) {
            if (pToTest.hasOwnProperty('visibility')) {
                switch (pToTest.visibility) {
                    case Visibility.OPEN:
                        ret = true;
                        break;
                    case Visibility.PRIVATE:
                        if (this._accessingAcct && pToTest.hasOwnProperty('domainId')) {
                            const aDomain = pDomain ?? await Domains.getDomainWithId(pToTest.domainId);
                            if (aDomain) {
                                ret = aDomain.sponsorAccountId === this._accessingAcct.id;
                            };
                        };
                        break;
                    default:
                        ret = false;
                        break;
                }
            }
            else {
                // if 'visibility' is not specified, it's assumed "OPEN"
                ret = true;
            };
        }
        return ret;
    };

    public criteriaParameters(): any {
        this._doingQuery = true;
        const criteria: any = {};
        if (! this._asAdmin) {
            /* tslint:disable-next-line */
            criteria['$or'] = [ { 'visibility': { '$exists': false }},
                                { 'visibility': Visibility.OPEN },
                            ];
        }
        return criteria;
    };

    public sortCriteriaParameters(): any {
        return null;
    };
};
