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

import { RequestEntity } from '@Entities/RequestEntity';

import { createObject, getObject, getObjects, updateObjectFields, deleteOne, deleteMany } from '@Tools/Db';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { GenericFilter } from '@Entities/EntityFilters/GenericFilter';

import { GenUUID, SimpleObject, IsNotNullOrEmpty, IsNullOrEmpty } from '@Tools/Misc';
import { VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

export let requestCollection = 'requests';

export class RequestType {
  public static HANDSHAKE = 'handshake';      // doing handshake to make a connection
  public static CONNECTION = 'connection';    // asking to make a connection
  public static FRIEND = 'friend';            // asking to be a friend
  public static FOLLOW = 'follow';            // asking to follow
  public static VERIFYEMAIL = 'verifyEmail';  // verifying email request
};

// Initialize request management.
// Mostly starts a periodic function that deletes expired requests.
export function initRequests(): void {

  // Expire requests that have pased their prime
  setInterval( async () => {
    const nowtime = new Date();
    const numDeleted = await deleteMany(requestCollection,
                              new GenericFilter({ 'expirationTime': { $lt: nowtime } }) );
    if (numDeleted > 0) {
      Logger.debug(`Requests.Expiration: expired ${numDeleted} requests`);
    };
  }, 1000 * 60 * 2 );
};

export const Requests = {
  async getWithId(pRequestId: string): Promise<RequestEntity> {
    return IsNullOrEmpty(pRequestId) ? null : getObject(requestCollection,
                                                new GenericFilter({ 'id': pRequestId }));
  },
  // Return all Requests that have the passed Id as either the requester or target.
  // Normally matches the accountId fields but can change it to others (usually for connection NodeId).
  async getWithRequesterOrTarget(pRequestId: string, pType: string,
                  pRequesterField: string = 'requestingAccountId',
                  pTargetField: string = 'targetAccountId'): Promise<RequestEntity> {
    return IsNullOrEmpty(pRequestId) ? null : getObject(requestCollection,
            new GenericFilter(
                { '$or': [ SimpleObject(pRequesterField, pRequestId),
                          SimpleObject(pTargetField, pRequestId)
                        ],
                  'requestType': pType
                }) );
  },
  // Return a Request between the two specified id's
  // Normally matches the accountId fields but can change it to others (usually for connection NodeId).
  async getWithRequestBetween(pRequestId: string, pTargetId: string, pType: string,
                  pRequesterField: string = 'requestingAccountId',
                  pTargetField: string = 'targetAccountId'): Promise<RequestEntity> {
    const wayone: VKeyedCollection = {};
    wayone[pRequesterField] = pRequestId;
    wayone[pTargetField] = pTargetId;
    const waytwo: VKeyedCollection = {};
    waytwo[pRequesterField] = pTargetId;
    waytwo[pTargetField] = pRequestId;
    return IsNullOrEmpty(pRequestId) ? null : getObject(requestCollection,
            new GenericFilter(
                { '$or': [ wayone, waytwo ],
                  'requestType': pType
                }) );
  },
  create(): RequestEntity {
    const aRequest = new RequestEntity();
    aRequest.id = GenUUID();
    aRequest.expirationTime = new Date(Date.now() + 1000 * 60);
    aRequest.whenCreated = new Date();
    return aRequest;
  },
  // A 'handshake' request is special request between session NodeIds
  createHandshakeRequest(pRequesterNodeId: string, pTargetNodeId: string): RequestEntity {
    const newRequest = Requests.create();
    newRequest.requestType = RequestType.HANDSHAKE;
    newRequest.requesterNodeId = pRequesterNodeId;
    newRequest.requesterAccepted = false;
    newRequest.targetNodeId = pTargetNodeId;
    newRequest.targetAccepted = false;

    // A connection request lasts only for so long
    const expirationMinutes = Config["metaverse-server"]["handshake-request-expiration-minutes"];
    newRequest.expirationTime = new Date(Date.now() + 1000 * 60 * expirationMinutes);

    return newRequest;
  },
  add(pRequestEntity: RequestEntity) : Promise<RequestEntity> {
    return createObject(requestCollection, pRequestEntity);
  },
  async update(pEntity: RequestEntity, pFields: VKeyedCollection): Promise<RequestEntity> {
    return updateObjectFields(requestCollection,
                              new GenericFilter({ 'id': pEntity.id }), pFields);
  },
  async remove(pRequestEntity: RequestEntity) : Promise<boolean> {
    return deleteOne(requestCollection, new GenericFilter({ 'id': pRequestEntity.id }) );
  },
  // Remove all requests for specified account of the specified type
  // If type not specified, remove them all
  async removeAllMyRequests(pAccountId: string, pRequestType?: string): Promise<number>{
    const criteria: VKeyedCollection = {
      'requestingAccount': pAccountId
    };
    if (IsNotNullOrEmpty(pRequestType)) {
      criteria.requestType = pRequestType;
    };
    return deleteMany(requestCollection, new GenericFilter(criteria));
  },
  // TODO: add scope (admin) and filter criteria filtering
  //    It's push down to this routine so we could possibly use DB magic for the queries
  async *enumerateAsync(pPager: CriteriaFilter,
              pInfoer?: CriteriaFilter, pScoper?: CriteriaFilter): AsyncGenerator<RequestEntity> {
    for await (const acct of getObjects(requestCollection, pPager, pInfoer, pScoper)) {
      yield acct;
    };
  }
};



