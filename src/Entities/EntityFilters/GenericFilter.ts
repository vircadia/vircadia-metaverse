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

// A generic filter wrapper where the caller can pass any criteria.
// This is used to pass a raw MongoDB query parameter and fulfills
//    the value typing and tags all the MongoDB queries spread around
//    the code -- at least you can find them if the DB access needs
//    to change.
export class GenericFilter extends CriteriaFilter {

  private _criteria: any;
  private _sortCriteria: any;

  public constructor(pFilterCriteria: any, pSortCriteria?: any) {
    super();
    this._criteria = pFilterCriteria;
    this._sortCriteria = pSortCriteria;
  }

  // Take a request and extract filter parameters
  public parametersFromRequest(pRequest: Request): void {
    return;
  };

  // Add any parameters to the response
  public addResponseFields(pRequest: Request) {
    return;
  };

  // Test a thing and return 'true' if it should be included in the set
  public criteriaTest(pThingy: any): boolean {
    return true;
  };

    public async criteriaTestAsync(pThingy: any): Promise<boolean> {
        return this.criteriaTest(pThingy);
    };

  // Return Mongodb criteria for the search query
  // This changes what 'criteriaTest' returns since the testing is now
  //     expected to be in the query.
  public criteriaParameters(): any {
    return this._criteria;
  };
  public sortCriteriaParameters(): any {
    return this._sortCriteria;
  };
};
