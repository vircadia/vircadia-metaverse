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
import { PlaceEntity } from '@Entities/PlaceEntity';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { Maturity } from '@Entities/Sets/Maturity';

import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';


// Process a request that wants to filter Account collection with parameters:
//  &maturity=unrated,mature
//  &tag=tag1,tag2,tag3
//  &status=online,active
//        online = Place/Domain are heartbeating
//        active = one or more avatars are present
//  &order=ascending,decending,num_users,name
//  &search=regex
export class PlaceFilterInfo extends CriteriaFilter {

    private _maturity: string[];
    private _tags: string[];
    private _ascending: number = 1;
    private _orderByName: boolean = false;
    private _orderByUsers: boolean = false;
    private _search: string;

    // Set to 'true' if the pagination was passed in the criteria query parameters
    private _doingQuery: boolean = false;

    public constructor() {
        super();
        return;
    }

    // Passed the request, get the filter parameters from the query.
    // Here we pre-process the parameters to make the DB query construction quicker.
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
                Logger.cdebug('query-detail', `PlaceFilterInfo.parametersFromRequest: maturity=${JSON.stringify(this._maturity)}`);
            };

            // Commas separated list of place tags
            if (typeof(pRequest.query.tag) === 'string') {
                this._tags = pRequest.query.tag.split(',');
                Logger.cdebug('query-detail', `PlaceFilterInfo.parametersFromRequest: tags=${JSON.stringify(this._tags)}`);
            };

            if (typeof(pRequest.query.status) === 'string') {
                const statuses = pRequest.query.status.split(',');
                for (const stat of statuses) {
                    switch (stat) {
                        case 'online':
                            break;
                        case 'active':
                            break;
                        default:
                            break;
                    };
                };
                // Logger.cdebug('query-detail', `PlaceFilterInfo.parametersFromRequest: status=${JSON.stringify(this._active)}`);
            };

            if (typeof(pRequest.query.order) === 'string') {
                const orderings = pRequest.query.order.split(',');
                for (const order of orderings) {
                    switch (order) {
                        case 'ascending':
                            this._ascending = 1;
                            break;
                        case 'decending':
                            this._ascending = -1;
                            break;
                        case 'num_users':
                            this._orderByUsers = true;
                            break;
                        case 'name':
                            this._orderByName = true;
                            break;
                        default:
                            break;
                    };
                };
                Logger.cdebug('query-detail', `PlaceFilterInfo.parametersFromRequest: order: ${this._ascending}, users: ${this._orderByUsers}, name: ${this._orderByName}`);
            };

            if (typeof(pRequest.query.search) === 'string') {
                const searcher = pRequest.query.search;
                this._search = searcher;
                Logger.cdebug('query-detail', `PlaceFilterInfo.parametersFromRequest: search: ${this._search}`);
            };
        }
        catch (e) {
            Logger.error('PlaceFilterInfo: parameters from request: exception: ' + e);
        };
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
            if (!ret && this._tags && pThingy.hasOwnProperty('tags')) {
                for (const aTag of this._tags) {
                    if ((pThingy as PlaceEntity).tags.includes(aTag)) {
                        ret = true;
                        break;
                    };
                };
            };
            if (!ret && this._search && pThingy.hasOwnProperty('name')) {
                const matches = (pThingy as PlaceEntity).name.match(this._search);
                ret = matches && (matches.length === 1);
            };
        };
        return ret;
    };

    public async criteriaTestAsync(pThingy: any): Promise<boolean> {
        return this.criteriaTest(pThingy);
    };

    // Return the MongoDB query parameters for the search criteria
    public criteriaParameters(): any {
        this._doingQuery = true;
        const criteria:VKeyedCollection = {};
        if (this._maturity) {
            /* tslint:disable-next-line */
            criteria['maturity'] = { '$in': this._maturity }
        };
        if (this._tags) {
            /* tslint:disable-next-line */
            criteria['tags'] = { '$in': this._tags }
        };
        if (this._search) {
            /* tslint:disable-next-line */
            criteria['name'] = { '$regex': this._search, '$options': 'i' }
        };
        return criteria;
    };

    public sortCriteriaParameters(): any {
        if (this._orderByUsers || this._orderByName) {
            const sorting: any = {};
            if (this._orderByUsers) {
                sorting.attendance = this._ascending;
            }
            if (this._orderByName) {
                sorting.name = this._ascending;
            }
            Logger.cdebug('query-detail', `PlaceFilterInfo.sortCriteriaParameters: ${JSON.stringify(sorting)}`);
            return sorting;
        }
        return null;
    };
};
