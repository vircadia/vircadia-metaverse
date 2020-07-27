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
import { Domains } from '@Entities/Domains';
import { RESTResponse } from './RESTResponse';

import { IsNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';
import { Config } from '@Base/config';

// MetaverseAPI middleware.
// The request is a standard MetaverseAPI JSON-in and JSON-out request.
// Start by decorating the request with the building class that is used to create the response.
export const setupMetaverseAPI: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  req.vRestResp = new RESTResponse(req, resp);
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
      }
      resp.json(response);
    }
    else {
      resp.end();
    };
  }
  else {
    next();
  };
};

// MetaverseAPI middleware.
// Check for account specified by request 'Authorization:' token.
// Decorate passed Request with 'vAuthAccount' which points to an AccountEntity.
// If account cannot be found, sets 'vAuthAccount' to undefined.
export const accountFromAuthToken: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('accountFromAuthToken');
  if (req.vRestResp) {
    req.vAuthAccount = await Accounts.getAccountWithAuthToken(req.vRestResp.getAuthToken());
  };
  if (IsNullOrEmpty(req.vAuthAccount)) {
    req.vAccountError = 'No account found for authorization';
  };
  next();
};

// MetaverseAPI middleware.
// The request has a :accountId label that needs to be looked up and verified.
// Decorate the passed Request with 'vAccount' which points to a AccountEntity.
// If account cannot be found or verified, 'vAccountError' is set with text explaining the error.
export const accountFromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('accountFromParams');
  if (req.vRestResp) {
    const accountId = req.params.accountId;
    if (accountId) {
      req.vAccount = await Accounts.getAccountWithId(accountId);
    };
  };
  if (IsNullOrEmpty(req.vAccount)) {
    req.vAccountError = 'AccountId does not match a domain';
  };
  next();
};

// MetaverseAPI middleware.
// The request has a :domainId label that needs to be looked up and verified.
// Decorate the passed Request with 'vDoamin' which points to a DomainEntity.
// If domain cannot be found or verified, 'vDomainError' is set with text explaining the error.
export const domainFromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('domainFromParams');
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

// MetaverseAPI middleware.
// The request has a :tokenId label that is returned in 'vTokenId'.
export const tokenFromParams: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  Logger.debug('tokenFromParams');
  if (req.vRestResp) {
    req.vTokenId = req.params.tokenId;
  };
  next();
};