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

import Config from '@Base/config';

import bodyParser from 'express';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI, finishReturnData } from '@Route-Tools/middleware';

import { AccountEntity } from '@Entities/AccountEntity';
import { Accounts } from '@Entities/Accounts';
import { AccountRoles } from '@Entities/AccountRoles';
import { AuthToken } from '@Entities/AuthToken';
import { Tokens } from '@Entities/Tokens';
import { TokenScope } from '@Entities/TokenScope';

import { VKeyedCollection } from '@Tools/vTypes';

import { Logger } from '@Tools/Logging';

// Do a 'login' and return an initial access token for a user
// Request comes as a 'application/x-www-form-urlencoded' body.
// Note that the response is not a standard MetaverseAPI response since it
//    is trying to mimic a standard /oauth/token request. So this
//    code builds a response and finishes the request.
const procPostOauthToken: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  let respBody: VKeyedCollection;
  try {
    const accessGrantType = req.body.grant_type;
    switch (accessGrantType) {
      case 'password': {
        // There are several types of "password"s passed by Interface:
        // PLAIN PASSWORD
        const userName = req.body.username;
        const userPassword = req.body.password;

        // STEAM
        // string userPassword = req.body.steam_auth_ticket;

        // OCULUS
        // string userPassword = req.body.oculus_nonce;
        // string userPassword = req.body.oculus_id;

        const userScope: string = req.body.scope ?? TokenScope.OWNER;
        if (TokenScope.KnownScope(userScope)) {
          const aAccount = await Accounts.getAccountWithUsername(userName);
          if (aAccount) {
            if (await Accounts.validatePassword(aAccount, userPassword)) {
              Logger.debug(`procPostOAuthToken: login of user ${userName}`);
              const tokenInfo = await Tokens.createToken(aAccount.accountId, [ userScope ]);
              await Tokens.addToken(tokenInfo);
              respBody = buildOAuthResponseBody(aAccount, tokenInfo);
            }
            else {
              respBody = buildOAuthErrorBody('Invalid password');
              req.vRestResp.IsFailure = true;
            };
          }
          else{
            respBody = buildOAuthErrorBody('Unknown user');
            req.vRestResp.IsFailure = true;
          };
        }
        else {
          respBody = buildOAuthErrorBody('Invalid scope');
          req.vRestResp.IsFailure = true;
        };
        break;
      };
      case 'authorization_code': {
        respBody = buildOAuthErrorBody('Do not know what to do with an authorization_code');
        req.vRestResp.IsFailure = true;
        break;
      };
      case 'refresh_token': {
        const refreshingToken = req.body.refresh_token;
        const refreshToken = await Tokens.getTokenWithRefreshToken(refreshingToken);
        if (Tokens.hasNotExpired(refreshToken)) {
          const requestingAccount = await Accounts.getAccountWithAuthToken(req.vRestResp.getAuthToken());
          if (requestingAccount && refreshToken.accountId === requestingAccount.accountId) {
            // refresh token has not expired and requestor is owner of the token so make new
            const newToken = await Tokens.createToken(req.vAuthAccount.accountId, refreshToken.scope);
            Tokens.addToken(newToken);
            respBody = buildOAuthResponseBody(requestingAccount, newToken);
          }
          else {
            respBody = buildOAuthErrorBody('refresh token not owned by accessing account');
            req.vRestResp.IsFailure = true;
          };
        }
        else {
          respBody = buildOAuthErrorBody('refresh token expired');
          req.vRestResp.IsFailure = true;
        }
        break;
      };
      default: {
        respBody = buildOAuthErrorBody('Unknown grant_type: ' + accessGrantType);
        req.vRestResp.IsFailure = true;
        break;
      };
    };
  }
  catch (err) {
    respBody = buildOAuthErrorBody('Exception: ' + err);
    req.vRestResp.IsFailure = true;
  };

  req.vRestResp.Data = respBody;
  next();
};

// The response to /oauth/token is special since it tries to mimic an official interface.
// This is also used by /api/v1/token/new to return the created token.
export function buildOAuthResponseBody(pAcct: AccountEntity, pToken: AuthToken): VKeyedCollection {
  const body: VKeyedCollection = {
    'access_token': pToken.token,
    'token_type': 'Bearer',
    'expires_in': pToken.tokenExpirationTime.valueOf()/1000 - pToken.tokenCreationTime.valueOf()/1000,
    'refresh_token': pToken.refreshToken,
    'scope': TokenScope.MakeScopeString(pToken.scope),
    'created_at': pToken.tokenCreationTime.valueOf() / 1000,
  };
  if (pAcct) {
    body.account_id = pAcct.accountId,
    body.account_name = pAcct.username,
    body.account_roles = pAcct.roles;
  };
  return body;
};


function buildOAuthErrorBody(pMsg: string): VKeyedCollection {
  Logger.error(`procPostOauthToken: returning error body: ${pMsg}`);
  return {
    'error': pMsg
  };
};

export const name = "/oauth/token";

export const router = Router();

router.post( '/oauth/token',  [ setupMetaverseAPI,        // req.vRestResp
                                bodyParser.urlencoded({extended: true}), // req.body
                                procPostOauthToken,
                                finishReturnData ]);
