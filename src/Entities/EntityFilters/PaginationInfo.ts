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

import { Clamp } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

export class PaginationInfo extends CriteriaFilter {
  public PageNum: number = 1;
  public PerPage: number = 20;

  // results from as filter operation
  private _currentPage: number = 1;
  private _currentItem: number = 1;

  // Set to 'true' if the pagination was passed in the criteria query parameters
  private _doingQuery: boolean = false;

  public constructor(pPageNum: number = 1, pPerPage: number = 1000) {
    super();
    this.PageNum = Clamp(pPageNum, 1, 1000);
    this.PerPage = Clamp(pPerPage, 1, 1000);
  }

  public parametersFromRequest(pRequest: Request) : void {
    if (pRequest.query.page) {
      this.PageNum = Clamp(Number(pRequest.query.page), 1, 1000);
    };
    if (pRequest.query.per_page) {
      this.PerPage = Clamp(Number(pRequest.query.per_page), 1, 1000);
    };
    // Logger.debug(`PaginstationInfo: pageNum=${this.PageNum}, perPage=${this.PerPage}`);
  }

  public criteriaTest(pThingy: any): boolean {
    if (! this._doingQuery) {
      if (++this._currentItem > this.PerPage) {
        this._currentItem = 1;
        ++this._currentPage;
      }
      return this.PageNum === this._currentPage;
    };
    return true;
  };

  public criteriaParameters(): any {
    // this._doingQuery = true;
    return {
      // '$skip': (this.PageNum - 1) * this.PerPage,
      // '$limit': this.PerPage
    };
  };

  public *filter<T>(pToFilter: Generator<T>) : Generator<T> {
    this._currentPage = 1;
    this._currentItem = 1;
    for (const item of pToFilter) {
      if (this.PageNum === this._currentPage) {
        yield item;
      }
      if (++this._currentItem > this.PerPage) {
        this._currentItem = 1;
        if (++this._currentPage > this.PageNum)
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
      if (this.PageNum === this._currentPage) {
        yield item;
      }
      if (++this._currentItem > this.PerPage) {
        this._currentItem = 1;
        if (++this._currentPage > this.PageNum)
        {
          break;
        };
      };
    };
  };
};