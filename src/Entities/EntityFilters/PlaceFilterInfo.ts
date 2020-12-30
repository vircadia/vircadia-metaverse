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
import { AccountEntity } from '@Entities/AccountEntity';
import { PlaceEntity } from '@Entities/PlaceEntity';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { Maturity } from '@Entities/Sets/Maturity';

import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';


// Process a request that wants to filter Account collection with parameters:
export class PlaceFilterInfo extends CriteriaFilter {

  private _maturity: string[];
  private _tags: string[];

  // Set to 'true' if the pagination was passed in the criteria query parameters
  private _doingQuery: boolean = false;

  public constructor() {
    super();
    return;
  }

  // Passed the request, get the filter parameters from the query.
  // Here we pre-process the parameters to make the DB query construction quicker.
  //  maturity=string
  //  tag=string,string,...   (contains one)
  public parametersFromRequest(pRequest: Request) : void {
    try {
      // Comma separated list of attribute criteria.
      if (typeof(pRequest.query.maturity) === 'string') {
        this._maturity = pRequest.query.maturity.split(',');
        // Check to make sure all the pieces are legal maturity names
        let allLegal = true;
        for (const mat of this._maturity) {
          if ( ! Maturity.KnownMaturity(mat)) {
            allLegal = false;
            break;
          };
        };
        if (allLegal) {
          if (this._maturity.includes(Maturity.UNRATED)) {
            // Adding a 'null' to the set causes places with no rating to be included
            this._maturity.push(null);
          };
        }
        else {
          Logger.cdebug('query-detail', `PlaceFilterInfo.parametersFromRequest: passed undefined maturity level ${JSON.stringify(this._maturity)}`);
          this._maturity = undefined;
        };
      };

      // Commas separated list of target's status.
      // Currently, the only selection is 'online'.
      if (typeof(pRequest.query.tag) === 'string') {
        this._tags = pRequest.query.tag.split(',');
      };

      Logger.cdebug('query-detail', `PlaceFilterInfo.parametersFromRequest: _maturity=${JSON.stringify(this._maturity)}, _tags=${JSON.stringify(this._tags)}`);
    }
    catch (e) {
      Logger.error('PlaceFilterInfo: parameters from request: exception: ' + e);
    }
  };

  // Add any parameters to the response
  public addResponseFields(pRequest: Request) {
    return;
  };

  // Passed (what should be) an AccountEntity, test if the filters
  //    think it's passable.
  // Return 'true' of this account fits the search criteria.
  public criteriaTest(pThingy: any): boolean {
    let ret = false;
    if (this._doingQuery) {
      ret = true;
    }
    else {
      if (this._maturity) {
        if (pThingy.hasOwnProperty('maturity')) {
          if (this._maturity.includes((pThingy as PlaceEntity).maturity)) {
            ret = true;
          };
        }
        else {
          if (this._maturity.includes(Maturity.UNRATED)) {
            ret = true;
          };
        };
      };
      if (this._tags && pThingy.hasOwnProperty('tags')) {
        for (const aTag of this._tags) {
          if ((pThingy as PlaceEntity).tags.includes(aTag)) {
            ret = true;
            break;
          };
        };
      };
    };
    return ret;
  };

  // Return the MongoDB query parameters for the search criteria
  public criteriaParameters(): any {
    this._doingQuery = true;
    const criteria:VKeyedCollection = {};
    if (this._maturity) {
      criteria.maturity = { '$in': this._maturity }
    };
    if (this._tags) {
      criteria.tags = { '$in': this._tags }
    };
    return criteria;
  };

  public sortCriteriaParameters(): any {
    return null;
  };
};
