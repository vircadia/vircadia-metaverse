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
import { AccountEntity } from '../AccountEntity';
import { Logger } from '../../Tools/Logging';

export class AccountScopeFilter extends CriteriaFilter {
  private _asAdmin = false;
  private _accessingAcct: AccountEntity;
  private _targetAcct: string = undefined;

  // Set to 'true' if the pagination was passed in the criteria query parameters
  private _doingQuery: boolean = false;

  public constructor(pRequestorAccount: AccountEntity) {
    super();
    this._accessingAcct = pRequestorAccount;
    return;
  }
  public parametersFromRequest(pRequest: Request) : void {
    try {
      if (pRequest.query.asAdmin) {
        if (this._accessingAcct.administrator) {
          this._asAdmin = true;
        };
      };
      // The administrator can specify an account to limit requests to
      if (pRequest.query.acct) {
        this._targetAcct = pRequest.query.account as string;
      }
    }
    catch (e) {
      Logger.error('AccountScopeFilter: parameters from request: exception: ' + e);
    };
  };

  public criteriaTest(pThingy: any): boolean {
    if (! this._doingQuery) {
      if (this._asAdmin) {
        if (this._targetAcct) {
          return typeof(pThingy.accountId) !== 'undefined'
                && pThingy.accountId === this._targetAcct;
        }
        return true;
      };
      return typeof(pThingy.accountId) !== 'undefined'
              && pThingy.accountId === this._accessingAcct.accountId;
    }
    return true;
  };

  public criteriaParameters(): any {
    this._doingQuery = true;
    const criteria: any = {};
    if (! this._asAdmin) {
      criteria.accountId = this._accessingAcct.accountId;
    };
    if (this._asAdmin && typeof(this._targetAcct) !== 'undefined') {
      criteria.accountId = this._targetAcct
    }
    return criteria;
  };


  // TODO: add some filtering
  async *filter(pToFilter: AsyncGenerator<AccountEntity>) : AsyncGenerator<AccountEntity> {
    return pToFilter;
  };
};