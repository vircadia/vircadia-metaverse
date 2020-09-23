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
import { Accounts } from '@Entities/Accounts';
import { AccountEntity } from '@Entities/AccountEntity';
import { Domains } from '@Entities/Domains';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';

import { IsNullOrEmpty } from '@Tools/Misc';
import { SArray } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';


export class AccountFilterInfo extends CriteriaFilter {

  private _requestingAccount: AccountEntity;

  private _filter: string;  // comma list of "all", "friends", "connections"
  private _findFriends: boolean = false;
  private _friendsList: string[];
  private _findConnections: boolean = false;
  private _connectionsList: string[];
  private _findDomain: boolean = false;
  private _targetDomain: string;

  private _status: string;  // comma list of "online"
  private _findOnline: boolean = false;

  private _search: string;  // specific name to look for?
  private _findMatch: string;

  // Set to 'true' if the pagination was passed in the criteria query parameters
  private _doingQuery: boolean = false;

  public constructor() {
    super();
    return;
  }

  // Passed the request, get the filter parameters from the query.
  // Here we pre-process the parameters to make the DB query construction quicker.
  public parametersFromRequest(pRequest: Request) : void {
    this._requestingAccount = pRequest.vAuthAccount;

    try {
      // Comma separated list of attribute criteria.
      if (typeof(pRequest.query.filter) === 'string') {
        this._filter = pRequest.query.filter;
        const filterPieces = this._filter.split(',');
        filterPieces.forEach( filterClass => {
          switch (filterClass) {
            case 'all':
              this._findFriends = false;
              this._findConnections = false;
              break;
            case 'friends':
              this._findFriends = true;
              break;
            case 'connections':
              this._findConnections = true;
              break;
            default:
              break;
          };
        });
        if (this._findFriends && this._requestingAccount) {
          this._friendsList = this._requestingAccount.friends;
          if (IsNullOrEmpty(this._friendsList)) {
            // asking to filter on friends but has no friends
            this._findFriends = false;  // if no friends, don't search for it
          };
        };
        if (this._findConnections && this._requestingAccount) {
          this._connectionsList = this._requestingAccount.connections;
          if (IsNullOrEmpty(this._connectionsList)) {
            // asking to filter on friends but has no friends
            this._findConnections = false;  // if no friends, don't search for it
          };
        };
      };

      // Commas separated list of target's status.
      // Currently, the only selection is 'online'.
      if (typeof(pRequest.query.status) === 'string') {
        this._status = pRequest.query.status;
        const statusPieces = this._status.split(',');
        statusPieces.forEach( statusClass => {
          switch (statusClass) {
            case 'online':
              this._findOnline = true;
              break;
            default:
              // There is the version where the status is a domainId which
              //     limits the accounts to the specified domain.
              //     Also presumes 'online'.
              if (Domains.couldBeDomainId(statusClass)) {
                this._findDomain = true;
                this._findOnline = true;
                this._targetDomain = statusClass;
              };
              break;
          };
        });
      };

      this._search = String(pRequest.query.search);

      Logger.cdebug('query-detail', `AccountFilterInfo.parametersFromRequest: findFriends=${this._findFriends}, findConn=${this._findConnections}, findOnline=${this._findOnline}, findDomain=${this._findDomain}`);
    }
    catch (e) {
      Logger.error('AccountFilterInfo: parameters from request: exception: ' + e);
    }
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
      let filterSelect = false
      if (this._findFriends) {
        if (pThingy.hasOwnProperty('friends')) {
          for (const friend of this._friendsList) {
            if (SArray.has(pThingy.friends, friend)) {
              filterSelect = true;
              break;
            };
          };
        };
      };
      if (this._findConnections) {
        if (pThingy.hasOwnProperty('connections')) {
          for (const connection of this._connectionsList) {
            if (SArray.has(pThingy.connections, connection)) {
              filterSelect = true;
              break;
            };
          };
        };
      };
      const statusSelect = false;
      if (this._findOnline) {
        if (pThingy.hasOwnProperty('timeOfLastHeartbeat')) {
          ret = Accounts.isOnline(pThingy as AccountEntity);
        };
      };
      ret = filterSelect && statusSelect;
    }
    return ret;
  };

  // Return the MongoDB query parameters for the search criteria
  public criteriaParameters(): any {
    this._doingQuery = true;
    const criteria:any = {};
    if (this._findFriends) {
      criteria.friends = { '$in': this._friendsList }
    };
    if (this._findConnections) {
      criteria.connections = { '$in': this._connectionsList }
    };
    if (this._findOnline) {
      criteria.timeOfLastHeartbeat = { '$gte': Accounts.dateWhenNotOnline() }
    };
    if (this._findDomain) {
      criteria.locationDomainId = this._targetDomain
    };
    return criteria;
  };
};