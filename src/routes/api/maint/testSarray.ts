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

import { Availability } from '@Entities/Sets/Availability';
import { isValidSArraySet, isValidSArray, verifyAllSArraySetValues, isPathValidator } from '@Route-Tools/Validators';

import { SArray } from '@Tools/vTypes';
import { IsNotNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';


// Temporary maint function to test some internal functions.
// Someday there should be a real test suite.
const proctestsarray: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  req.vRestResp.Data = {
    'isValidSArray': {
      'undefined': isValidSArray(undefined),
      'null': isValidSArray(null),
      'empty object': isValidSArray({}),
      'empty array': isValidSArray([]),
      'one string': isValidSArray(['one']),
      'two strings': isValidSArray(['one', 'two']),
      'five strings': isValidSArray(['one', 'two', 'three', 'four', 'five']),
      'one number': isValidSArray(['one', 2, 'three', 'four', 'five']),
      'an object': isValidSArray(['one', { 'stuff': 'more stuff' }, 'three', 'four', 'five'])
    },
    'isValidSArraySet': {
      'undefined': isValidSArraySet(undefined),
      'null': isValidSArraySet(null),
      'empty object': isValidSArraySet({}),
      'string': isValidSArraySet('new value'),
      'set string': isValidSArraySet({ 'set': 'new value' }),
      'set array': isValidSArraySet({ 'set': [ 'one', 'two', 'three' ] }),
      'add string': isValidSArraySet({ 'add': 'new value' }),
      'add array': isValidSArraySet({ 'add': [ 'one', 'two', 'three' ] }),
      'remove string': isValidSArraySet({ 'remove': 'new value' }),
      'remove array': isValidSArraySet({ 'remove': [ 'one', 'two', 'three' ] }),
      'set and remove': isValidSArraySet({ 'set': ['one', 'two'], 'remove': [ 'three', 'four']}),
      'extra op': isValidSArraySet({ 'set': ['one', 'two'], 'diddle': [ 'three', 'four']})
    },
    'verifyAllSArraySetValues': {
      'undefined': await verifyAllSArraySetValues(undefined, undefined),
      'null': await verifyAllSArraySetValues(null, undefined),
      'null function': await verifyAllSArraySetValues(null, null),
      'good values': await verifyAllSArraySetValues({
              'set': [ 'none', 'friends' ],
              'remove': 'connections'
            }, Availability.KnownAvailability),
      'one bad value': await verifyAllSArraySetValues({
              'set': [ 'none', 'friends' ],
              'remove': [ 'connections', 'frog' ]
            }, Availability.KnownAvailability)
    },
    'checkPathValidation': {
      'good path 1': await isPathValidator(undefined, undefined, '/0,0,0/0,0,0,1'),
      'good path 2': await isPathValidator(undefined, undefined, '/23.5,-44.6,22/0.5639,-0.3355,0.32,0.33'),
      'good path 3': await isPathValidator(undefined, undefined, 'domainname/23.5,-44.6,22/0.5639,-0.3355,0.32,0.33'),
      'good path 4': await isPathValidator(undefined, undefined, '/-33,20,44/-0.447,0.3232,0.031,1'),
      'good path 5': await isPathValidator(undefined, undefined, '/4,5,6/0.343,0.444,-34,1.0'),
      'bad path 1': await isPathValidator(undefined, undefined, '0,0,0/0,0,0,1'),
      'bad path 2': await isPathValidator(undefined, undefined, '/X,0,0/0,0,0,1'),
      'bad path 3': await isPathValidator(undefined, undefined, '/0,0,0/0,0,0,1/'),

    }
  };
  next();
};

export const name = '/api/maint/testSArray';

export const router = Router();

router.get('/api/maint/testSArray',  [ setupMetaverseAPI,
                                      proctestsarray,
                                      finishMetaverseAPI ] );





