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

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { accountFromAuthToken } from '@Route-Tools/middleware';

import { Requests, RequestType } from '@Entities/Requests';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';
import { RequestScopeFilter } from '@Entities/EntityFilters/RequestScopeFilter';
import { Logger } from '@Tools/Logging';

const procGetRequests: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    const pager = new PaginationInfo();
    const scoper = new RequestScopeFilter(req.vAuthAccount);
    pager.parametersFromRequest(req);
    scoper.parametersFromRequest(req);

    // Loop through all the filtered accounts and create array of info
    const reqs: any[] = [];
    for await (const aReq of Requests.enumerateAsync(scoper, pager)) {
      const thisReq: any = {
        'id': aReq.id,
        'type': aReq.requestType,
        'requesting_account_id': aReq.requestingAccountId,
        'target_account_id': aReq.targetAccountId,
        'when_created': aReq.whenCreated ? aReq.whenCreated.toISOString() : undefined,
        'expiration_time': aReq.expirationTime ? aReq.expirationTime.toISOString() : undefined
      };
      switch (aReq.requestType) {
        case RequestType.HANDSHAKE:
          thisReq.handshake = {
            'requester_id': aReq.requesterNodeId,
            'target_id': aReq.targetNodeId,
            'requester_accepted': aReq.requesterAccepted,
            'target_accepted': aReq.targetAccepted
          };
      };
      reqs.push(thisReq);
    };

    req.vRestResp.Data = {
      requests: reqs
    };
  }
  else {
    req.vRestResp.respondFailure('No account specified');
  };
  next();
};

export const name = '/api/v1/requests';

export const router = Router();

router.get(   '/api/v1/requests',                 [ setupMetaverseAPI,
                                                  accountFromAuthToken,   // vRestResp.vAuthAccount
                                                  procGetRequests,
                                                  finishMetaverseAPI ] );