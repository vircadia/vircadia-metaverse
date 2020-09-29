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

import { Request } from 'express';
import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { Accounts } from '@Entities/Accounts';
import { AccountEntity } from '@Entities/AccountEntity';
import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

export class RelationshipScopeFilter extends CriteriaFilter {
  private _asAdmin = false;
  private _accessingAcct: AccountEntity;
  private _targetAcct: string = undefined;
  private _fromId = 'fromId';
  private _toId = 'toId';

  // Set to 'true' if the pagination was passed in the criteria query parameters
  private _doingQuery: boolean = false;

  // Create a new filter and specify the requesting account and
  //     field in target entity to check for match.
  // "accountId" works for most things but scoping domains by their owners
  //     requires checking "sponsorAccountId">
  public constructor(pRequestorAccount: AccountEntity, pFrom: string = 'fromId', pTo: string = 'toId') {
    super();
    this._accessingAcct = pRequestorAccount;
    return;
  }
  public parametersFromRequest(pRequest: Request) : void {
    try {
      if (pRequest.query.hasOwnProperty('asAdmin')) {
        const askingForAdmin = pRequest.query.asAdmin === 'true';
        if (askingForAdmin) {
          if (Accounts.isAdmin(this._accessingAcct)) {
            this._asAdmin = true;
          };
        };
      };
      // The administrator can specify an account to limit requests to
      if (pRequest.query.acct) {
        this._targetAcct = pRequest.query.account as string;
      };
      Logger.cdebug('query-detail', `AccountScopeFilter.parametersFromRequest: asAdmin=${this._asAdmin}, target=${this._targetAcct}`);
    }
    catch (e) {
      Logger.error('AccountScopeFilter: parameters from request: exception: ' + e);
    };
  };

  // Return if we've found admin enabling parameters
  public AsAdmin(): boolean {
    return this._asAdmin;
  };

  public criteriaTest(pToTest: any): boolean {
    if (! this._doingQuery) {
      if (pToTest.hasOwnProperty(this._fromId) && pToTest.hasOwnProperty(this._toId)) {
        let getAccountId = this._accessingAcct.id;
        if (this._asAdmin) {
          if (typeof(this._targetAcct) !== 'undefined') {
            getAccountId = this._targetAcct
          }
          else {
            return true;  // we're admin so the entry matches
          };
        };
        return pToTest[this._fromId] === getAccountId || pToTest[this._toId] === getAccountId;
      };
    };
    return true;
  };

  public criteriaParameters(): any {
    this._doingQuery = true;
    let getAccountId = this._accessingAcct.id;
    if (this._asAdmin && typeof(this._targetAcct) !== 'undefined') {
      getAccountId = this._targetAcct
    };
    const criteria: any = {};
    // If not an admin, the found items must match the id of the requestor
    const orCriteriaFrom: VKeyedCollection = {};
    orCriteriaFrom[this._fromId] = getAccountId;
    const orCriteriaTo: VKeyedCollection = {};
    orCriteriaTo[this._toId] = getAccountId;
    if (! this._asAdmin) {
      criteria.$or = [ orCriteriaFrom, orCriteriaTo ];
    };
    return criteria;
  };

  public sortCriteriaParameters(): any {
    return null;
  };
};
