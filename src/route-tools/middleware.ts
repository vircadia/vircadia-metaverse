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

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';

import { Accounts } from '@Entities/Accounts';
import { AccountEntity } from '@Entities/AccountEntity';
import { Domains } from '@Entities/Domains';
import { Sessions } from '@Entities/Sessions';
import { RESTResponse } from './RESTResponse';

import { IsNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';
import { Config } from '@Base/config';
import { SessionEntity } from '@Entities/SessionEntity';

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
      SessionEntity.TouchSession(req.vSession);
    }
    else {
      // No existing session for this request
      req.vSession = Sessions.createSession(req.vSenderKey);
      Sessions.addSession(req.vSession);
      Logger.debug('setupMetaverseAPI: created new session for ' + req.vSenderKey);
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
      if (Config.debug["metaverseapi-response-detail"]) {
        Logger.debug('finishMetaverseAPI: response: ' + JSON.stringify(response));
      };
      resp.json(response);
    }
    else {
      resp.end();
    };
  };
};

// MetaverseAPI middleware.
// Check for account specified by request 'Authorization:' token.
// Decorate passed Request with 'vAuthAccount' which points to an AccountEntity.
// If account cannot be found, sets 'vAuthAccount' to undefined.
export const accountFromAuthToken: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp) {
    req.vAuthAccount = await Accounts.getAccountWithAuthToken(req.vRestResp.getAuthToken());
  };
  if (IsNullOrEmpty(req.vAuthAccount)) {
    req.vAccountError = 'No account found for authorization';
    Logger.debug('accountFromAuthToken: account lookup fail: authToken=' + req.vRestResp.getAuthToken());
  };
  next();
};

// MetaverseAPI middleware.
// The request has a :accountId label that needs to be looked up and verified.
// Decorate the passed Request with 'vAccount' which points to a AccountEntity.
// If account cannot be found or verified, 'vAccountError' is set with text explaining the error.
export const accountFromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  // Logger.debug('accountFromParams');
  if (req.vRestResp) {
    const accountId = req.params.accountId;
    if (accountId) {
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

// Find domain apikey from JSON body and set as 'vDomainAPIKey'
export const usernameFromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vRestResp) {
    req.vUsername = req.params.username;
  };
  next();
};

// MetaverseAPI middleware.
// The request has a :domainId label that needs to be looked up and verified.
// Decorate the passed Request with 'vDoamin' which points to a DomainEntity.
// If domain cannot be found or verified, 'vDomainError' is set with text explaining the error.
export const domainFromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  // Logger.debug('domainFromParams');
  if (req.vRestResp) {
    const domainId = req.params.domainId;
    if (domainId) {
      req.vDomain = await Domains.getDomainWithId(domainId);
    };
  };
  if (IsNullOrEmpty(req.vDomain)) {
    req.vDomainError = 'DomainId does not match a domain';
  };
  next();
};

// Find domain apikey from JSON body and set as 'vDomainAPIKey'
export const domainAPIkeyFromBody: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.body && req.body.domain && req.body.domain.api_key) {
    req.vDomainAPIKey = req.body.domain.api_key;
  };
  next();
};

// Find domain apikey from previously parsed multi-part form body and set as 'vDomainAPIKey'
export const domainAPIkeyFromMultipart: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.body && req.body.api_key) {
    req.vDomainAPIKey = req.body.api_key;
  };
  next();
};

// Check that 'vDomain' has access. Checks 'vDomainAPIKey' and request's authtoken.
// If the domain in 'vDomain' does not check out, null out 'vDomain'.
export const verifyDomainAccess: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vRestResp && req.vDomain) {
      let verified: boolean = false;

      const authToken = req.vRestResp.getAuthToken();
      // Logger.debug(`verifyDomainAccess: domainId: ${req.vDomain.domainId}, authT: ${authToken}, apikey: ${req.vDomainAPIKey}`);

      if (IsNullOrEmpty(authToken)) {
        // Auth token not available. See if APIKey does the trick
        if (req.vDomain.apiKey === req.vDomainAPIKey) {
          verified = true;
        };
      }
      else {
        const aAccount: AccountEntity = await Accounts.getAccountWithAuthToken(authToken);
        if (aAccount) {
          if (IsNullOrEmpty(req.vDomain.sponserAccountID)) {
            // If the domain doesn't have an associated account, form the link to this account
            req.vDomain.sponserAccountID = aAccount.accountId;
          };
          if (req.vDomain.sponserAccountID === aAccount.accountId) {
            verified = true;
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

// MetaverseAPI middleware.
// The request has a :tokenId label that is returned in 'vTokenId'.
export const tokenFromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('tokenFromParams');
  if (req.vRestResp) {
    req.vTokenId = req.params.tokenId;
  };
  next();
};