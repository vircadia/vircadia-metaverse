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

import Config from '../config';

import { Request, Response } from 'express';

import { IsNotNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

export enum HTTPStatusCode {
  OK = 200,
  Found = 302,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
};

export class RESTResponse {
  IsFailure: boolean;
  Status: string;
  HTTPStatus: number;
  Data: any;

  private _request: Request;
  private _response: Response;
  private _additionalFields: Map<string,any> = new Map<string,any>();

  constructor(pReq : Request, pResp: Response) {
    this._request = pReq;
    this._response = pResp;
    this.IsFailure = false;
    this.Status = 'success';
    this.HTTPStatus = HTTPStatusCode.OK;
  };

  getRequest(): Request {
    return this._request;
  };

  getResponse(): Response {
    return this._response;
  };

  private _authToken:string = null;
  getAuthToken(): string {
    if (this._authToken === null) {
      const auth = this._request.headers.authorization;
      if (auth) {
        if (auth.toLowerCase().startsWith('bearer ')) {
          this._authToken = auth.substr(7);
        }
        else {
          this._authToken = auth;
        }
      }
    }
    return this._authToken;
  }

  respondSuccess() : RESTResponse {
    this.Status = 'success';
    return this;
  };

  respondFailure( msg1: string, msg2?: string ) : RESTResponse {
    this.Status = 'failure';
    this.IsFailure = true;
    this._additionalFields.set('error', msg1);
    if (msg2) {
      this._additionalFields.set('errorInfo', msg2);
    }
    return this;
  };

  addAdditionalField( pFieldName: string, pFieldValue: any) {
    this._additionalFields.set(pFieldName, pFieldValue);
  };

  // Build JSON response into the http response structure
  // If successful, returns the standard response of
  //     { 'status': 'success', 'data': this._data }
  // Extra top-level things are added if in _addtionalFields
  buildRESTResponse() : any {
    let responseData: any;
    if (this.IsFailure) {
      // If a specific header is in the request, return errors as
      //     HTTP badrequest errors rather than just returning the JSON status
      if (Config["metaverse-server"]["http-error-on-failure"]) {
        const errorHeader = Config["metaverse-server"]["error-header"];
        const errorAction = this._request.get(errorHeader);
        if (errorAction && errorAction.toLowerCase() === "badrequest") {
          this._response.statusCode = HTTPStatusCode.BadRequest;
        }
      }
      // Set status to 'failure'. Any additional error info is added by _additionalFields.
      responseData = {
        'status': 'failure'
      };
    }
    else {
      responseData = {
          'status': this.Status,
      };
    };

    if (IsNotNullOrEmpty(this.Data)) {
      responseData.data = this.Data;
    };

    if (this._additionalFields.size > 0) {
      this._additionalFields.forEach( (val, key) => {
        responseData[key] = val;
      });
    };
    return responseData;
  };
};
