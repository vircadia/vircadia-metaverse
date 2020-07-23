//   Copyright 2020 Robert Adams
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

import { RESTResponse } from './MetaverseAPI/RESTResponse';
import { AccountEntity } from './Entities/AccountEntity';
import { DomainEntity } from './Entities/DomainEntity';

declare global {
    namespace Express {
        interface Request {
            vRestResp?: RESTResponse;   // structure used to process the MetaverseAPI input and output JSON
            vAuthAccount?: AccountEntity;   // pointer to verified AccountEntity
            vAccount?: AccountEntity;   // pointer to account found in Params
            vAccountError?: string;     // if vAccount is not set, the reason why
            vDomain?: DomainEntity;     // pointer to verified DomainEntity
            vDomainError?: string;      // if vDomain is not set, the reason why
            vDomainAPIKey?: string;      // if domain APIkey supplied in the request, it is passed here
        }
    }
}
