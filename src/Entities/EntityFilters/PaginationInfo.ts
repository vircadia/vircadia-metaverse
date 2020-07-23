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

import { RESTResponse } from '../../MetaverseAPI/RESTResponse';
import { Clamp } from '../../Tools/Misc';

export class PaginationInfo {
  private _pageNum: number = 1;
  private _perPage: number = 20;

  // results from as filter operation
  private _currentPage: number = 1;
  private _currentItem: number = 1;

  public constructor(pPageNum: number, pPerPage: number) {
    this._pageNum = Clamp(pPageNum, 1, 1000);
    this._perPage = Clamp(pPerPage, 1, 1000);
  }

  public parametersFromRequest(pRequest: RESTResponse) : void {
    const req = pRequest.getRequest();
    if (req.query.page) {
      this._pageNum = Clamp(Number(req.query.page), 1, 1000);
    }
    if (req.query.per_page) {
      this._perPage = Clamp(Number(req.query.per_page), 1, 1000);
    }
  }

  public *filter<T>(pToFilter: Generator<T>) : Generator<T> {
    this._currentPage = 1;
    this._currentItem = 1;
    for (const item of pToFilter) {
      if (this._pageNum === this._currentPage) {
        yield item;
      }
      if (++this._currentItem > this._perPage) {
        this._currentItem = 1;
        if (++this._currentPage > this._pageNum)
        {
          break;
        };
      };
    };
  };

  public async *filterAsync<T>(pToFilter: AsyncIterable<T>) : AsyncGenerator<T> {
    this._currentPage = 1;
    this._currentItem = 1;
    for await (const item of pToFilter) {
      if (this._pageNum === this._currentPage) {
        yield item;
      }
      if (++this._currentItem > this._perPage) {
        this._currentItem = 1;
        if (++this._currentPage > this._pageNum)
        {
          break;
        };
      };
    };
  };
};