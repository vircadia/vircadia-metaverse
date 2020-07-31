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
import { AccountEntity } from '../AccountEntity';
import { Logger } from '../../Tools/Logging';

export class AccountScopeFilter {
  private _asAdmin = false;

  public constructor(pRequestorAccount: AccountEntity) {
    return;
  }
  public parametersFromRequest(pRequest: Request) : void {
    try {
      if (pRequest.query.asAdmin) {
        this._asAdmin = true;
      }
    }
    catch (e) {
      Logger.error('AccountScopeFilter: parameters from request: exception: ' + e);
    }
  }

  // TODO: add some filtering
  async *filter(pToFilter: AsyncGenerator<AccountEntity>) : AsyncGenerator<AccountEntity> {
    return pToFilter;
  };
};