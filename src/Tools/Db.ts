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

import { MongoClient, Db, FilterQuery } from 'mongodb';

import deepmerge from 'deepmerge';

// This seems to create a circular reference  that causes variables to not be initialized
// import { domainCollection } from '@Entities/Domains';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';

import { VKeyedCollection } from '@Tools/vTypes';
import { SimpleObject, IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
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
export async function getObject(pCollection: string,
                                pCriteria: CriteriaFilter,
                                pCollation?: any): Promise<any> {
    if (pCollation) {
        Logger.cdebug('db-query-detail', `Db.getObject: collection=${pCollection}, criteria=${JSON.stringify(pCriteria.criteriaParameters())}`);
        const cursor = Datab.collection(pCollection)
                        .find(pCriteria.criteriaParameters())
                        .collation(pCollation);
        if (await cursor.hasNext()) {
            return cursor.next();
        };
        return null;
    };
    Logger.cdebug('db-query-detail', `Db.getObject: collection=${pCollection}, criteria=${JSON.stringify(pCriteria.criteriaParameters())}`);
    return Datab.collection(pCollection)
              .findOne(pCriteria.criteriaParameters());
};

// Low level access to database to update the passed object in the passed collection.
// Note that the passed source object has only the fields to update in the target object.
// Throws exception if anything wrong with the fetch.
// Returns the complete updated object.
export async function updateObjectFields(pCollection: string,
                                         pCriteria: CriteriaFilter,
                                         pFields: VKeyedCollection): Promise<any> {
    let doSet = false;
    let doUnset = false;
    const set: VKeyedCollection = {};
    const unset: VKeyedCollection = {};
    const op: VKeyedCollection = {};

    // If not updating anything, just return
    if (IsNullOrEmpty(pFields) || Object.keys(pFields).length === 0) {
        return;
    };

    // Go through all the passed values that are to be updated in the target object
    for (const [key, value] of Object.entries(pFields)) {
        if (key === 'id') continue; // never change an id
        if (value === null) {
            doUnset = true;
            unset[key] = '';
        }
        else {
            doSet = true;
            set[key] = value
        };
    };

    // Create the 'operation' object that specifies what to change on the  target object
    if (doSet) {
        op.$set = set
    };
    if (doUnset) {
        op.$unset = unset
    };

    Logger.cdebug('db-query-detail', `Db.updateObjectFields: collection=${pCollection}, criteria=${JSON.stringify(pCriteria.criteriaParameters())}, op=${JSON.stringify(op)}`);
    return Datab.collection(pCollection)
        .findOneAndUpdate(pCriteria.criteriaParameters(), op, {
            returnOriginal: false    // return the updated entity
    } );
};

export async function deleteMany(pCollection: string, pCriteria: CriteriaFilter): Promise<number> {
    const result = await Datab.collection(pCollection).deleteMany(pCriteria.criteriaParameters());
    return result.deletedCount ?? 0;
};

export async function deleteOne(pCollection: string, pCriteria: CriteriaFilter): Promise<boolean> {
    let ret = false;
    const result = await Datab.collection(pCollection).deleteOne( pCriteria.criteriaParameters() );
    if ( result.result && result.result.ok) {
        ret = result.result.ok === 1
    }
    else {
        ret = (result.deletedCount ?? 0) > 0;
    };
    return ret;
};

// Return a count of the documents that match the passed filter
export async function countObjects(pCollection: string,
                                  pFilter: CriteriaFilter): Promise<number> {
    Logger.cdebug('db-query-detail', `Db.countObjects: collection=${pCollection}, criteria=${JSON.stringify(pFilter.criteriaParameters())}`);
    return Datab.collection(pCollection).countDocuments(pFilter.criteriaParameters() as FilterQuery<any>);
};

// Low level generator to a stream of objects fitting a criteria.
// Page number starts at 1.
// Throws exception if anything wrong with the fetch.
export async function *getObjects(pCollection: string,
                                  pPager?: CriteriaFilter,
                                  pInfoer?: CriteriaFilter,
                                  pScoper?: CriteriaFilter): AsyncGenerator<any> {

    // If a paging filter is passed, incorporate it's search criteria
    let criteria:any = {};
    let sortCriteria:any

    if (pPager) {
        criteria = deepmerge(criteria, pPager.criteriaParameters());
        if (pPager.sortCriteriaParameters()) {
            sortCriteria = deepmerge(sortCriteria ?? {}, pPager.sortCriteriaParameters());
        };
    };
    if (pInfoer) {
        criteria = deepmerge(criteria, pInfoer.criteriaParameters());
        if (pInfoer.sortCriteriaParameters()) {
            sortCriteria = deepmerge(sortCriteria ?? {}, pInfoer.sortCriteriaParameters());
        };
    };
    if (pScoper) {
        criteria = deepmerge(criteria, pScoper.criteriaParameters());
        if (pScoper.sortCriteriaParameters()) {
            sortCriteria = deepmerge(sortCriteria ?? {}, pScoper.sortCriteriaParameters());
        };
    };

    Logger.cdebug('db-query-detail', `Db.getObjects: collection=${pCollection}, criteria=${JSON.stringify(criteria)}`);
    const cursor = Datab.collection(pCollection).find(criteria);

    if (sortCriteria) {
      Logger.cdebug('db-query-detail', `Db.getObjects: collection=${pCollection}, sortCriteria=${JSON.stringify(sortCriteria)}`);
      cursor.sort(sortCriteria);
    };

    while (await cursor.hasNext()) {
        const nextItem = await cursor.next();
        if (    ( pPager  ? pPager.criteriaTest(nextItem) : true)
             && ( pInfoer ? pInfoer.criteriaTest(nextItem) : true)
             && ( pScoper ? pScoper.criteriaTest(nextItem) : true)
                ) {
            yield nextItem;
        };
    };
};

// These definitions are here because doing the 'import' reference seems
//     to create some reference loop that causes the field tables in the
//     Entities to not get initialized.
const domainCollection = 'domains';
const accountCollection = 'accounts';
const placeCollection = 'places';
const tokenCollection = 'tokens';

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
    await Datab.createIndex(accountCollection, { 'id': 1 } );
    await Datab.createIndex(accountCollection, { 'username': 1 },
                        { collation: noCaseCollation } );
    await Datab.createIndex(accountCollection, { 'locationNodeId': 1 } );
    await Datab.createIndex(accountCollection, { 'email': 1 },
                        { collation: noCaseCollation } );
    // Domains:
    //    'domainId'
    //    'apiKey'
    //    'lastSenderKey'
    await Datab.createIndex(domainCollection, { 'id': 1 } );
    await Datab.createIndex(domainCollection, { 'apiKey': 1 } );
    await Datab.createIndex(domainCollection, { 'lastSenderKey': 1 } );
    // Places:
    //    'placeId'
    //    'name'
    await Datab.createIndex(placeCollection, { 'id': 1 } );
    await Datab.createIndex(placeCollection, { 'name': 1 },
                    { collation: { locale: 'en_US', strength: 2 } } );
};

// Do any database format changes.
// Eventually, there should be a system of multiple, versioned updates
//    but, to keep things running, just do the updates needed for now.
async function DoDatabaseFormatChanges() {

    await RenameDbField(domainCollection, 'domainId', 'id');
    // Domain naming changed a little when place_names were added.
    //    so domain.placeName changed to domain.name.
    // If any domain entry exists with 'place_name', replace it with 'name'
    await RenameDbField(domainCollection, 'placeName', 'name');

    await RenameDbField(domainCollection, 'sponserAccountId', 'sponsorAccountId');
    await RenameDbField(domainCollection, 'whenDomainEntryCreated', 'whenCreated');

    await RenameDbField(accountCollection, 'accountId', 'id');
    await RenameDbField(accountCollection, 'whenAccountCreated', 'whenCreated');

    await RenameDbField(placeCollection, 'placeId', 'id');
    await RenameDbField(placeCollection, 'address', 'path');
    await RenameDbField(placeCollection, 'whenPlaceEntryCreated', 'whenCreated');

    await RenameDbField(tokenCollection, 'tokenId', 'id');
    await RenameDbField(tokenCollection, 'tokenExpirationTime', 'expirationTime');
    await RenameDbField(tokenCollection, 'tokenCreationTime', 'whenCreated');
};

// Scan the collection for entities with the 'from' field. Rename to 'to' if found.
async function RenameDbField(pCollection: string, pFrom: string, pTo: string) {
    let updateCount = 0;
    await Datab.collection(pCollection).find(SimpleObject(pFrom, { '$exists': true }))
    .forEach( doc => {
        updateCount++;
        Datab.collection(pCollection).updateOne(
            { _id: doc._id},
            { '$rename': SimpleObject(pFrom, pTo) }
        );
    });
    if (updateCount > 0) {
        Logger.debug(`Db.DoDatabaseFormatChanges: ${updateCount} ${pCollection}.${pFrom} renames`);
    };
};