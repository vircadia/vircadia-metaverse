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

// Criteria filters are used to filter collections of entities.
// They work by taking an enumeration stream and returning a stream
//    with only entities  that fit the criteria.
// They work with the MongoDB database and create query filters
//    so the queries return only the selected entities.
// After construction, the filter is gets parameters from the request
//    URL. A call to 'parametersFromRequest' with a request query like
//    '?pagenum=5' would be selecting only page 5 entries.
// The criteria filter is called before making the MongoDB query and
//    can return MongoDB query pieces if it can be done. The filter
//    doesn't have to do DB query filtering as it is called for each
//    found entity so it can test them. So, filters usually either
//    return a DB query filter when called by 'criteriaParameters' or
//    does the test with 'criteriaTest'.
// The call 'addResponseFields' is called after the request is completed
//    and is used mostly by Pagination to add page info to the query
//    response.
export abstract class CriteriaFilter {

  // Take a request and extract filter parameters
  abstract parametersFromRequest(pRequest: Request): void;

  // Adds additional fields to the response
  abstract addResponseFields(pRequest: Request): void;

  // Test a thing and return 'true' if it should be included in the set
  abstract criteriaTest(pThingy: any): boolean;

  // Return Mongodb criteria for the search query
  // This changes what 'criteriaTest' returns since the testing is now
  //     expected to be in the query.
  abstract criteriaParameters(): any;

  // return Mongodb critera for sort operations
  abstract sortCriteriaParameters(): any;
};
