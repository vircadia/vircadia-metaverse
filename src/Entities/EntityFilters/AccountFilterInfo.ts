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
import { AccountEntity } from '@Entities/AccountEntity';

import { Logger } from '@Tools/Logging';

export class AccountFilterInfo extends CriteriaFilter {
  private _filter: string;
  private _status: string;
  private _search: string;

  // Set to 'true' if the pagination was passed in the criteria query parameters
  private _doingQuery: boolean = false;

  public constructor() {
    super();
    return;
  }

  public parametersFromRequest(pRequest: Request) : void {
    try {
      this._filter = String(pRequest.query.filter);
      this._status = String(pRequest.query.status);
      this._search = String(pRequest.query.search);
    }
    catch (e) {
      Logger.error('AccountFilterInfo: parameters from request: exception: ' + e);
    }
  };

  public criteriaTest(pThingy: any): boolean {
    return true;
  };

  public criteriaParameters(): any {
    // Logger.debug(`AccountFilterInfo.criteriaParameters: `);
    return {
    };
  };

  // TODO: add some filtering
  async *filter(pToFilter: AsyncGenerator<AccountEntity>) : AsyncGenerator<AccountEntity> {
    return pToFilter;
  };
};