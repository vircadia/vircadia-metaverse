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

'use strict';

import { Config } from '@Base/config';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';

import { Accounts } from '@Entities/Accounts';
import { AccountEntity } from '@Entities/AccountEntity';
import { Domains } from '@Entities/Domains';
import { Tokens, TokenScope } from '@Entities/Tokens';
import { AuthToken } from '@Entities/AuthToken';
import { Sessions } from '@Entities/Sessions';
import { Places } from '@Entities/Places';
import { setPlaceField } from '@Entities/PlaceEntity';

import { RESTResponse } from '@Route-Tools/RESTResponse';

import { GenericFilter } from '@Entities/EntityFilters/GenericFilter';

import { IsNullOrEmpty, IsNotNullOrEmpty } from '@Tools/Misc';
import { SArray, VKeyedCollection } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';

// MetaverseAPI middleware.
// The request is a standard MetaverseAPI JSON-in and JSON-out request.
// Start by decorating the request with the building class that is used to create the response
//     and setup the session.
export const setupMetaverseAPI: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  req.vRestResp = new RESTResponse(req, resp);
  if (req.socket) {
    req.vSenderKey = `${req.socket.remoteAddress}:${req.socket.remotePort}`;

    req.vSession = Sessions.getSessionWithSenderKey(req.vSenderKey);
    if (req.vSession) {
      Sessions.touchSession(req.vSession);
    }
    else {
      // No existing session for this request
      req.vSession = Sessions.createSession(req.vSenderKey);
      Sessions.addSession(req.vSession);
      Logger.debug('setupMetaverseAPI: created new session for ' + req.vSenderKey);
    };

    let authToken = req.vRestResp.getAuthToken();
    // If an authToken is not supplied in the header, it can be supplied in the query
    if (IsNullOrEmpty(authToken)) {
      if (req.query && req.query.access_token && typeof(req.query.access_token) === 'string') {
        authToken = (req.query.access_token as string);
      };
    };
    if (IsNotNullOrEmpty(authToken)) {
      try {
        req.vAuthToken = await Tokens.getTokenWithToken(authToken);
      }
      catch (err) {
        Logger.error(`setupMetaverseAPI: exception in token lookup: ${err}`);
      };
    };
  };
  next();
};

// MetaverseAPI middleware.
// Finish the API call by constructing the '{"status": "success", "data": RESPONSE }' JSON response
// The request is terminated here by either 'resp.end()' or 'resp.json()'.
export const finishMetaverseAPI: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  // Logger.debug('finishMetaverseAPI: enter');
  if (req.vRestResp) {
    resp.statusCode = req.vRestResp.HTTPStatus;
    const response = req.vRestResp.buildRESTResponse();
    if (response) {
      Logger.cdebug('metaverseapi-response-detail', 'finishMetaverseAPI: response: ' + JSON.stringify(response));
      resp.json(response);
    }
    else {
      resp.end();
    };
  };
};

// Like 'finishMetaverseAPI' but doesn't return the status/data JSON object but only
//    returns the data body as the JSON response.
// This is needed for some of the API requests (eg. /oauth/token) who's response is
//    just JSON data.
// The request is terminated here by either 'resp.end()' or 'resp.json()'.
export const finishReturnData: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp) {
    resp.statusCode = req.vRestResp.HTTPStatus;
    const response = req.vRestResp.buildRESTResponse();
    if (response && response.data) {
      Logger.cdebug('metaverseapi-response-detail', 'finishMetaverseAPI: response: ' + JSON.stringify(response.data));
      resp.json(response.data);
    }
    else {
      resp.end();
    };
  };
};

// MetaverseAPI middleware.
// Check for account specified by request 'Authorization:' token.
// Decorate passed Request with 'vAuthToken' and 'vAuthAccount' which point
//      to an AccountEntity.
// If account cannot be found, sets 'vAuthAccount' to undefined.
export const accountFromAuthToken: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp) {
    if (IsNotNullOrEmpty(req.vAuthToken)) {
      req.vAuthAccount = await Accounts.getAccountWithId(req.vAuthToken.accountId);
    };
  };
  if (IsNullOrEmpty(req.vAuthAccount)) {
    req.vAccountError = 'No account found for authorization';
    Logger.debug('accountFromAuthToken: account lookup fail: authToken=' + req.vRestResp.getAuthToken());
  };
  next();
};

// MetaverseAPI middleware.
// The request has a :accountId label that needs to be looked up and verified.
// We check if the accountId is either an account username or the accountId.
// Decorate the passed Request with 'vAccount' which points to a AccountEntity.
// If account cannot be found or verified, 'vAccountError' is set with text explaining the error.
export const accountFromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp) {
    if (req.params && req.params.accountId && typeof(req.params.accountId) === 'string') {
      const accountId = decodeURIComponent(req.params.accountId);
      // Most of the account references are by username
      req.vAccount = await Accounts.getAccountWithUsername(accountId);
      if (IsNullOrEmpty(req.vAccount)) {
        // If username didn't work, try by the accountId
        req.vAccount = await Accounts.getAccountWithId(accountId);
      };
    };
  };
  if (IsNullOrEmpty(req.vAccount)) {
    req.vAccountError = 'AccountId does not match an account';
  };
  next();
};

// Check that 'vDomain' has access. Checks 'vDomainAPIKey' and request's authtoken.
// If the domain in 'vDomain' does not check out, null out 'vDomain'.
export const verifyDomainAccess: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vRestResp && req.vDomain) {
      let verified: boolean = false;

      const authToken = req.vRestResp.getAuthToken();
      // Logger.debug(`verifyDomainAccess: domainId: ${req.vDomain.id}, authT: ${authToken}, apikey: ${req.vDomainAPIKey}`);

      if (IsNullOrEmpty(authToken)) {
        // Auth token not available. See if APIKey does the trick
        if (req.vDomain.apiKey === req.vDomainAPIKey) {
          // APIKEY matches so create a fake AuthToken that works with checkAccessToEntity
          req.vAuthToken = await Tokens.createToken(req.vDomainAPIKey, [ TokenScope.DOMAIN ], 1);
          verified = true;
        };
      }
      else {
        // The request is being made with an authToken.
        // The token should be for a domain.
        const aToken: AuthToken = await Tokens.getTokenWithToken(authToken);
        if (aToken && aToken.accountId) {
          if (SArray.has(aToken.scope, TokenScope.DOMAIN)) {
            // As a hack, if the domain doesn't have a sponsor set, assign the account to the domain.
            // This should be fixed with a request that does the initial domain-to-account assignment
            if (IsNullOrEmpty(req.vDomain.sponsorAccountId)) {
              const aAccount: AccountEntity = await Accounts.getAccountWithId(aToken.accountId);
              if (aAccount) {
                Logger.debug(`verifyDomainAccess: assigning domain ${req.vDomain.id} to account ${aAccount.id}`);
                req.vDomain.sponsorAccountId = aAccount.id;
                await Domains.updateEntityFields(req.vDomain, { 'sponsorAccountId': aAccount.id } );
              };
            };
            if (req.vDomain.sponsorAccountId === aToken.accountId) {
              verified = true;
            };
          }
          else {
            Logger.debug(`verifyDomainAccess: not DOMAIN token: ${authToken}`);
          };
        };
      };

      if (!verified) {
        req.vDomain = undefined;
        req.vDomainError = 'Domain not authorized';
      };
    };
    next();
};

// Find domain apikey from JSON body and set as 'vDomainAPIKey'
export const usernameFromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.params && req.params.username) {
    if (typeof(req.params.username) === 'string') {
      req.vUsername = decodeURIComponent(req.params.username);
    };
  };
  next();
};

// The request has a :domainId label that needs to be looked up and verified.
// Decorate the passed Request with 'vDoamin' which points to a DomainEntity.
// If domain cannot be found or verified, 'vDomainError' is set with text explaining the error.
export const domainFromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  let domainId: string;
  if (req.params && req.params.domainId) {
    if (typeof(req.params.domainId) === 'string') {
      domainId = req.params.domainId;
      req.vDomain = await Domains.getDomainWithId(domainId);
    };
  };
  if (IsNullOrEmpty(req.vDomain)) {
    req.vDomainError = 'DomainId does not match a domain';
    Logger.error(`domainFromParams: wanted domain ${domainId} but not found`);
  };
  next();
};

// Look for :placeId label and lookup and set req.vPlace and req.vDomain.
// The accepts either the 'placeId' or the name of the place
export const placeFromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.params && req.params.placeId) {
    if (typeof(req.params.placeId) === 'string') {
      let aPlace = await Places.getPlaceWithId(req.params.placeId);
      if (IsNullOrEmpty(aPlace)) {
        aPlace = await Places.getPlaceWithName(decodeURIComponent(req.params.placeId));
      };
      if (aPlace) {
        const aDomain = await Domains.getDomainWithId(aPlace.domainId);
        if (aDomain) {
          req.vPlace = aPlace;
          req.vDomain = aDomain;
        }
        else {
          Logger.error(`placeFromParams: lookup Place with bad domain. placeId=${req.params.placeId}, domainId=${aPlace.domainId}`);
        };
      };
    };
  };
  next();
};

// Find domain apikey from JSON body and set as 'vDomainAPIKey'
export const domainAPIkeyFromBody: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.body && req.body.domain && req.body.domain.api_key) {
    if (typeof(req.body.domain.api_key) === 'string') {
      req.vDomainAPIKey = req.body.domain.api_key;
    };
  };
  next();
};

// Find domain apikey from previously parsed multi-part form body and set as 'vDomainAPIKey'
export const domainAPIkeyFromMultipart: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.body && req.body.api_key) {
    if (typeof(req.body.api_key) === 'string') {
      req.vDomainAPIKey = req.body.api_key;
    };
  };
  next();
};

// MetaverseAPI middleware.
// The request has a :tokenId label that is returned in 'vTokenId'.
export const tokenFromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.params && req.params.tokenId) {
    if (typeof(req.params.tokenId) === 'string') {
      req.vTokenId = req.params.tokenId;
    };
  };
  next();
};
// MetaverseAPI middleware.
// The request has a :param1 label that is returned in 'vParam1'.
export const param1FromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.params && req.params.param1) {
    if (typeof(req.params.param1) === 'string') {
      req.vParam1 = decodeURIComponent(req.params.param1);
    };
  };
  next();
};
// MetaverseAPI middleware.
// The request has a :param2 label that is returned in 'vParam2'.
export const param2FromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.params && req.params.param2) {
    if (typeof(req.params.param2) === 'string') {
      req.vParam2 = decodeURIComponent(req.params.param2);
    };
  };
  next();
};
// MetaverseAPI middleware.
// The request has a :param3 label that is returned in 'vParam3'.
export const param3FromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.params && req.params.param3) {
    if (typeof(req.params.param3) === 'string') {
      req.vParam3 = decodeURIComponent(req.params.param3);
    };
  };
  next();
};