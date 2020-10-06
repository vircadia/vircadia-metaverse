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

import { Config } from '@Base/config';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';

import { AccountRoles } from '@Entities/AccountRoles';
import { AccountAvailability } from '@Entities/AccountAvailability';
import { isValidSArraySet, isValidSArray, verifyAllSArraySetValues } from '@Route-Tools/Permissions';

import { SArray } from '@Tools/vTypes';
import { IsNotNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';


// Temporary maint function to test some internal functions.
// Someday there should be a real test suite.
const proctestsarray: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  req.vRestResp.Data = {
    'isValidSArray': {
      'undefined': await isValidSArray(undefined),
      'null': await isValidSArray(null),
      'empty object': await isValidSArray({}),
      'empty array': await isValidSArray([]),
      'one string': await isValidSArray(['one']),
      'two strings': await isValidSArray(['one', 'two']),
      'five strings': await isValidSArray(['one', 'two', 'three', 'four', 'five']),
      'one number': await isValidSArray(['one', 2, 'three', 'four', 'five']),
      'an object': await isValidSArray(['one', { 'stuff': 'more stuff' }, 'three', 'four', 'five'])
    },
    'isValidSArraySet': {
      'undefined': await isValidSArraySet(undefined),
      'null': await isValidSArraySet(null),
      'empty object': await isValidSArraySet({}),
      'string': await isValidSArraySet('new value'),
      'set string': await isValidSArraySet({ 'set': 'new value' }),
      'set array': await isValidSArraySet({ 'set': [ 'one', 'two', 'three' ] }),
      'add string': await isValidSArraySet({ 'add': 'new value' }),
      'add array': await isValidSArraySet({ 'add': [ 'one', 'two', 'three' ] }),
      'remove string': await isValidSArraySet({ 'remove': 'new value' }),
      'remove array': await isValidSArraySet({ 'remove': [ 'one', 'two', 'three' ] }),
      'set and remove': await isValidSArraySet({ 'set': ['one', 'two'], 'remove': [ 'three', 'four']}),
      'extra op': await isValidSArraySet({ 'set': ['one', 'two'], 'diddle': [ 'three', 'four']})
    },
    'verifyAllSArraySetValues': {
      'undefined': await verifyAllSArraySetValues(undefined, undefined),
      'null': await verifyAllSArraySetValues(null, undefined),
      'null functino': await verifyAllSArraySetValues(null, null),
      'good values': await verifyAllSArraySetValues({
              'set': [ 'none', 'friends' ],
              'remove': 'connections'
            }, AccountAvailability.KnownAvailability),
      'one bad value': await verifyAllSArraySetValues({
              'set': [ 'none', 'friends' ],
              'remove': [ 'connections', 'frog' ]
            }, AccountAvailability.KnownAvailability)
    }
  };
  next();
};

export const name = '/api/maint/testSArray';

export const router = Router();

router.get('/api/maint/testSArray',  [ setupMetaverseAPI,
                                      proctestsarray,
                                      finishMetaverseAPI ] );





