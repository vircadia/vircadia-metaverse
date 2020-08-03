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
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';

import { buildOAuthResponseBody } from '@Route-Tools/Util';

import { Accounts } from '@Entities/Accounts';
import { Tokens } from '@Entities/Tokens';

import { VKeyedCollection } from '@Tools/vTypes';

import { Logger } from '@Tools/Logging';

// Do a 'login' and return an initial access token for a user
// Request comes as a 'application/x-www-form-urlencoded' body
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

        const userScope = req.body.scope ?? 'owner';

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
        break;
      };
      case 'authorization_code': {
        respBody = buildOAuthErrorBody('Do not know what to do with an authorization_code');
        break;
      };
      case 'refresh_token': {
        const refreshingToken = req.body.refresh_token;
        const userScope = req.body.scope ?? 'owner';
        const targetToken = await Tokens.getTokenWithToken(req.vRestResp.getAuthToken());
        if (refreshingToken === targetToken.refreshToken) {
          const updates = {
            'tokenExpirationTime': new Date(targetToken.tokenExpirationTime.valueOf()
                  + Config.auth["auth-token-expire-days"] * 1000*60*60*24 )
          }
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

  if (Config.debug["metaverseapi-response-detail"]) {
    Logger.debug('oauth/token: response: ' + JSON.stringify(respBody));
  };
  resp.json(respBody);
};

function buildOAuthErrorBody(pMsg: string): VKeyedCollection {
  return {
    'error': pMsg
  };
};

export const name = "/oauth/token";

export const router = Router();

router.post( '/oauth/token',      setupMetaverseAPI,
                                  bodyParser.urlencoded({extended: true}),
                                  procPostOauthToken);
