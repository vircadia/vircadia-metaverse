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
import { Roles } from '@Entities/Roles';
import { AuthToken } from '@Entities/AuthToken';
import { Tokens } from '@Entities/Tokens';
import { Scope } from '@Entities/Scope';

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

        const userScope = req.body.scope ?? Scope.OWNER;
        if (Scope.KnownScope(userScope)) {
          const aAccount = await Accounts.getAccountWithUsername(userName);
          if (aAccount) {
            if (await Accounts.validatePassword(aAccount, userPassword)) {
              Logger.debug(`procPostOAuthToken: login of user ${userName}`);
              const tokenInfo = await Tokens.createToken(aAccount.accountId, userScope);
              await Tokens.addToken(tokenInfo);
              respBody = buildOAuthResponseBody(aAccount, tokenInfo);
            }
            else {
              respBody = buildOAuthErrorBody('Invalid password');
            };
          }
          else{
            respBody = buildOAuthErrorBody('Unknown user');
          };
        }
        else {
          respBody = buildOAuthErrorBody('Invalid scope');
        };
        break;
      };
      case 'authorization_code': {
        respBody = buildOAuthErrorBody('Do not know what to do with an authorization_code');
        break;
      };
      case 'refresh_token': {
        const refreshingToken = req.body.refresh_token;
        const targetToken = await Tokens.getTokenWithToken(req.vRestResp.getAuthToken());
        if (refreshingToken === targetToken.refreshToken) {
          const updates = {
            'tokenExpirationTime': Tokens.computeDefaultExpiration(targetToken.scope)
          };
          await Tokens.updateTokenFields(targetToken, updates);
          const aAccount = await Accounts.getAccountWithId(targetToken.accountId);
          respBody = buildOAuthResponseBody(aAccount, targetToken);
        }
        else {
          respBody = buildOAuthErrorBody('refresh token does not match');
        }
        break;
      };
      default: {
        respBody = buildOAuthErrorBody('Unknown grant_type: ' + accessGrantType);
        break;
      };
    };
  }
  catch (err) {
    respBody = buildOAuthErrorBody('Exception: ' + err);
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
    'scope': Scope.MakeScopeString(pToken.scope),
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
