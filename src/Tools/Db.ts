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

import { MongoClient, Db, DeleteWriteOpResultObject } from 'mongodb';
import deepmerge from 'deepmerge';

import { VKeyedCollection } from '@Tools/vTypes';
import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { Logger } from '@Tools/Logging';
import { IsNotNullOrEmpty } from './Misc';
import { createConnection } from 'net';

// The initial MongoClient
export let BaseClient: MongoClient;
// The base database for this application (spec'ed in Config.database.db)
export let Datab: Db;

// Do the setup of the database.
// Return a Promise for the creation operation that resolved with the MongoClient.
// The operation initializes the global 'BaseClient' and 'Datab' with the latter
//     being the configured database to use with this application (spec'ed in
//     Config.database.db).
export async function setupDB(): Promise<void> {
  // Connection URL docs: https://docs.mongodb.com/manual/reference/connection-string/
  let connectUrl: string;
  if (IsNotNullOrEmpty(Config.database["db-connection"])) {
    // if user supplied a connection string, just use that
    connectUrl = Config.database["db-connection"];
    Logger.debug(`setupDb: using user supplied connection string`);
  }
  else {
    const userSpec = `${Config.database["db-user"]}:${Config.database["db-pw"]}`;
    const hostSpec = `${Config.database["db-host"]}:${Config.database["db-port"]}`;
    let optionsSpec = '';
    if (Config.database["db-authdb"] !== 'admin') {
      optionsSpec += `?authSource=${Config.database["db-authdb"]}`;
    };
    connectUrl = `mongodb://${userSpec}@${hostSpec}/${optionsSpec}`;
    Logger.debug(`setupDb: connecting to DB at: mongodb://USER@${hostSpec}/${optionsSpec}`);
  };

  // Connect to the client and then get a database handle to the database to use for this app
  // This app returns the base client and keeps it in the exported global variable.
  BaseClient = await MongoClient.connect(connectUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  Datab = BaseClient.db(Config.database.db);
  return;
};

// Low level access to database to create an object is specified collection.
// Note: there is no check for duplicates.
// Throws exception if anything wrong with the fetch.
export async function createObject(pCollection: string, pObject: any): Promise<any> {
  return Datab.collection(pCollection)
    .insertOne(pObject, {
      forceServerObjectId: true // have server assign _Id rather than the driver
    } );
};

// Low level access to database to fetch the first instance of an object matching the criteria
// Throws exception if anything wrong with the fetch.
export async function getObject(pCollection: string, pCriteria: any): Promise<any> {
  return Datab.collection(pCollection)
    .findOne(pCriteria)
};

// Low level access to database to update the passed object in the passed collection.
// Note that the passed source object has only the fields to update in the target object.
// Throws exception if anything wrong with the fetch.
// Returns the complete updated object.
export async function updateObjectFields(pCollection: string, pCriteria: any, pFields: VKeyedCollection): Promise<any> {
  let doSet = false;
  let doUnset = false;
  const set: VKeyedCollection = {};
  const unset: VKeyedCollection = {};
  const op: VKeyedCollection = {};

  // Go through all the passed values that are to be updated in the target object
  for (const [key, value] of Object.entries(pFields)) {
    if (key === 'id') continue;
    if (value === null) {
      doUnset = true;
      unset[key] = '';
    }
    else {
      doSet = true;
      set[key] = value
    }
  }

  // Create the 'operation' object that specifies what to change on the  target object
  if (doSet) {
    op.$set = set
  }
  if (doUnset) {
    op.$unset = unset
  }

  return Datab.collection(pCollection)
    .findOneAndUpdate(pCriteria, op, {
       returnOriginal: false    // return the updated entity
      }
    );
};

export async function deleteMany(pCollection: string, pCriteria: any): Promise<DeleteWriteOpResultObject> {
  return Datab.collection(pCollection).deleteMany(pCriteria);
};

export async function deleteOne(pCollection: string, pCriteria: any): Promise<DeleteWriteOpResultObject> {
  return Datab.collection(pCollection).deleteOne( pCriteria );
};

// Low level generator to a stream of objects fitting a criteria.
// Page number starts at 1.
// Throws exception if anything wrong with the fetch.
export async function *getObjects(pCollection: string, pPager?: CriteriaFilter,
             pInfoer?: CriteriaFilter, pScoper?: CriteriaFilter): AsyncGenerator<any> {

  // If a paging filter is passed, incorporate it's search criteria
  let criteria:any = {};
  if (pPager) {
    criteria = deepmerge(criteria, pPager.criteriaParameters);
  };
  if (pInfoer) {
    criteria = deepmerge(criteria, pPager.criteriaParameters);
  };
  if (pScoper) {
    criteria = deepmerge(criteria, pPager.criteriaParameters);
  };

  if (Config.debug["db-query-detail"]) {
    Logger.debug(`Db.getObjects: collection=${pCollection}, criteria=${JSON.stringify(criteria)}`)
  };
  const cursor = Datab.collection(pCollection).find(criteria);

  while (await cursor.hasNext()) {
    const nextItem = await cursor.next();
    if (     ( pPager ? pPager.criteriaTest(nextItem) : true)
          && ( pInfoer ? pInfoer.criteriaTest(nextItem) : true)
          && ( pScoper ? pScoper.criteriaTest(nextItem) : true)
        ) {
      yield nextItem;
    };
  };
};