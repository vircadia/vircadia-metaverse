//   Copyright 2020 Robert Adams
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

import { RESTResponse } from '../../MetaverseAPI/RESTResponse';
import { AccountEntity } from '../AccountEntity';
import { Logger } from '../../Tools/Logging';

export class AccountFilterInfo {
  private _filter: string;
  private _status: string;
  private _search: string;

  public constructor() {
    return;
  }
  public parametersFromRequest(pRequest: RESTResponse) : void {
    const req = pRequest.getRequest();
    try {
      this._filter = String(req.query.filter);
      this._status = String(req.query.status);
      this._search = String(req.query.search);
    }
    catch (e) {
      Logger.error('AccountFilterInfo: parameters from request: exception: ' + e);
    }
  }

  public *filter(pToFilter: Generator<AccountEntity>) : Generator<AccountEntity> {
    return {
      'value': null,
      'done': true
    };
  };
};