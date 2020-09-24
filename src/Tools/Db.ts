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

import { MongoClient, Db } from 'mongodb';

import deepmerge from 'deepmerge';

// This seems to create a circular reference  that causes variables to not be initialized
// import { domainCollection } from '@Entities/Domains';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';

import { VKeyedCollection } from '@Tools/vTypes';
import { IsNotNullOrEmpty } from './Misc';
import { Logger } from '@Tools/Logging';

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

  // Do any operations to update database formats
  await DoDatabaseFormatChanges();

  await BuildIndexes();

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
// You can optionally pass a collation which is used to select index (usually for case-insensitive queries)..
export async function getObject(pCollection: string, pCriteria: any, pCollation?: any): Promise<any> {
  if (pCollation) {
    const cursor = Datab.collection(pCollection).find(pCriteria).collation(pCollation);
    if (await cursor.hasNext()) {
      return cursor.next();
    };
    return null;
  };
  return Datab.collection(pCollection).findOne(pCriteria);
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
  };

  // Create the 'operation' object that specifies what to change on the  target object
  if (doSet) {
    op.$set = set
  };
  if (doUnset) {
    op.$unset = unset
  };

  Logger.cdebug('db-query-detail', `Db.updateObjectFields: collection=${pCollection}, criteria=${JSON.stringify(pCriteria)}, op=${JSON.stringify(op)}`);
  return Datab.collection(pCollection)
    .findOneAndUpdate(pCriteria, op, {
       returnOriginal: false    // return the updated entity
    } );
};

export async function deleteMany(pCollection: string, pCriteria: any): Promise<number> {
  const result = await Datab.collection(pCollection).deleteMany(pCriteria);
  return result.deletedCount ?? 0;
};

export async function deleteOne(pCollection: string, pCriteria: any): Promise<boolean> {
  let ret = false;
  const result = await Datab.collection(pCollection).deleteOne( pCriteria );
  if ( result.result && result.result.ok) {
    ret = result.result.ok === 1
  }
  else {
    ret = (result.deletedCount ?? 0) > 0;
  };
  return ret;
};

// Low level generator to a stream of objects fitting a criteria.
// Page number starts at 1.
// Throws exception if anything wrong with the fetch.
export async function *getObjects(pCollection: string,
        pPager?: CriteriaFilter, pInfoer?: CriteriaFilter, pScoper?: CriteriaFilter): AsyncGenerator<any> {

  // If a paging filter is passed, incorporate it's search criteria
  let criteria:any = {};
  let sortCriteria:any

  if (pPager) {
    criteria = deepmerge(criteria, pPager.criteriaParameters());
    sortCriteria = pPager.sortCriteriaParameters ?? sortCriteria;
  };
  if (pInfoer) {
    criteria = deepmerge(criteria, pInfoer.criteriaParameters());
    sortCriteria = pInfoer.sortCriteriaParameters ?? sortCriteria;
  };
  if (pScoper) {
    criteria = deepmerge(criteria, pScoper.criteriaParameters());
    sortCriteria = pScoper.sortCriteriaParameters ?? sortCriteria;
  };

  Logger.cdebug('db-query-detail', `Db.getObjects: collection=${pCollection}, criteria=${JSON.stringify(criteria)}`);
  const cursor = Datab.collection(pCollection).find(criteria);

  if (sortCriteria) {
    cursor.sort(sortCriteria);
  };

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

const domainCollection = 'domains';
const accountCollection = 'accounts';
const placeCollection = 'places';

export let noCaseCollation: any = {
  locale: 'en_US',
  strength: 2
};

async function BuildIndexes() {
  // Accounts:
  //    'accountId'
  //    'username': should be case-less compare. Also update Accounts.getAccountWithUsername()
  //    'locationNodeId'
  //    'email'
  //    what is needed for friends?
  await Datab.createIndex(accountCollection, { 'accountId': 1 } );
  await Datab.createIndex(accountCollection, { 'username': 1 },
                    { collation: noCaseCollation } );
  await Datab.createIndex(accountCollection, { 'locationNodeId': 1 } );
  await Datab.createIndex(accountCollection, { 'email': 1 },
                    { collation: noCaseCollation } );
  // Domains:
  //    'domainId'
  //    'apiKey'
  //    'lastSenderKey'
  await Datab.createIndex(domainCollection, { 'domainId': 1 } );
  await Datab.createIndex(domainCollection, { 'apiKey': 1 } );
  await Datab.createIndex(domainCollection, { 'lastSenderKey': 1 } );
  // Places:
  //    'placeId'
  //    'name'
  await Datab.createIndex(placeCollection, { 'placeId': 1 } );
  await Datab.createIndex(placeCollection, { 'name': 1 },
                    { collation: { locale: 'en_US', strength: 2 } } );
};

// Do any database format changes.
// Eventually, there should be a system of multiple, versioned updates
//    but, to keep things running, just do the updates needed for now.
async function DoDatabaseFormatChanges() {

  // Domain naming changed a little when place_names were added.
  //    so domain.placeName changed to domain.name.
  // If any domain entry exists with 'place_name', replace it with 'name'
  // await RenameDbField(domainCollection, 'placeName', 'name');
  let updateCount = 0;
  await Datab.collection(domainCollection).find({ 'placeName': { '$exists': true }})
  .forEach( doc => {
    updateCount++;
    Datab.collection(domainCollection).updateOne(
            { _id: doc._id},
            { '$rename': { 'placeName': 'name' } }
    );
  });
  Logger.debug(`Db.DoDatabaseFormatChanges: ${updateCount} ${domainCollection}.placeName renames`);

  // Domain naming changed 'sponserAccountId' =? 'sponsorAccountId'
  // await RenameDbField(domainCollection, 'sponserAccountId', 'sponsorAccountId');
  updateCount = 0;
  await Datab.collection(domainCollection).find({ 'sponserAccountId': { '$exists': true }})
  .forEach( doc => {
    updateCount++;
    Datab.collection(domainCollection).updateOne(
            { _id: doc._id},
            { '$rename': { 'sponserAccountId': 'sponsorAccountId' } }
    );
  });
  Logger.debug(`Db.DoDatabaseFormatChanges: ${updateCount} ${domainCollection}.sponserAccountId renames`);

  // await RenameDbField(domainCollection, 'whenDomainEntryCreated', 'whenCreated');
  updateCount = 0;
  await Datab.collection(domainCollection).find({ 'whenDomainEntryCreated': { '$exists': true }})
  .forEach( doc => {
    updateCount++;
    Datab.collection(domainCollection).updateOne(
            { _id: doc._id},
            { '$rename': { 'whenDomainEntryCreated': 'whenCreated' } }
    );
  });
  Logger.debug(`Db.DoDatabaseFormatChanges: ${updateCount} ${domainCollection}.whenDomainEntryCreated renames`);

  // await RenameDbField(accountCollection, 'whenAccountCreated', 'whenCreated');
  updateCount = 0;
  await Datab.collection(accountCollection).find({ 'whenAccountCreated': { '$exists': true }})
  .forEach( doc => {
    updateCount++;
    Datab.collection(accountCollection).updateOne(
            { _id: doc._id},
            { '$rename': { 'whenAccountCreated': 'whenCreated' } }
    );
  });
  Logger.debug(`Db.DoDatabaseFormatChanges: ${updateCount} ${accountCollection}.whenAccountCreated renames`);

  // await RenameDbField(placeCollection, 'whenPlaceEntryCreated', 'whenCreated');
  updateCount = 0;
  await Datab.collection(placeCollection).find({ 'whenPlaceEntryCreated': { '$exists': true }})
  .forEach( doc => {
    updateCount++;
    Datab.collection(placeCollection).updateOne(
            { _id: doc._id},
            { '$rename': { 'whenPlaceEntryCreated': 'whenCreated' } }
    );
  });
  Logger.debug(`Db.DoDatabaseFormatChanges: ${updateCount} ${placeCollection}.whenPlaceEntryCreated renames`);
};
// For unknown reasons, this function does not work. It doesn't find anything to rename.
// The explicit versions above work but calling this sub-routine does not. Wierd.
async function RenameDbField(pCollection: string, pFrom: string, pTo: string) {
  let updateCount = 0;
  await Datab.collection(pCollection).find({ pFrom: { '$exists': true }})
  .forEach( doc => {
    updateCount++;
    Datab.collection(pCollection).updateOne(
            { _id: doc._id},
            { '$rename': { pFrom: pTo } }
    );
  });
  Logger.debug(`Db.DoDatabaseFormatChanges: ${updateCount} ${pCollection}.${pFrom} renames`);
};