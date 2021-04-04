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
import { Domains } from '@Entities/Domains';

import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { domainFromParams, domainAPIkeyFromMultipart, verifyDomainAccess } from '@Route-Tools/middleware';

import multer from 'multer';

import { Logger } from '@Tools/Logging';
import { createSimplifiedPublicKey, convertBinKeyToPEM } from '@Route-Tools/Util';
import { HTTPStatusCode } from '@Route-Tools/RESTResponse';

// GET /domains/:domainId/public_key
// For backward-compatibility, the PEM formatted public key is returned by this
//     request as a single line string without the BEGIN and END texts.
const procGetDomainsPublicKey: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    Logger.debug('procGetDomainsPublicKey');
    if (req.vDomain) {
        // Response is a simple public_key field
        req.vRestResp.Data = {
            'public_key': createSimplifiedPublicKey(req.vDomain.publicKey)
        };
    }
    else {
        req.vRestResp.HTTPStatus = HTTPStatusCode.Unauthorized;
        req.vRestResp.respondFailure('No domain');
    };
    next();
};

// PUT /domains/:domainId/public_key
// The api_key and public_key are POSTed as entities in a multi-part-form mime type.
// The public_key is sent as a binary (DER) form of a PKCS1 key.
// To keep backward compatibility, we convert the PKCS1 key into a SPKI key in PEM format
//      ("PEM" format is "Privacy Enhanced Mail" format and has the "BEGIN" and "END" text included).
const procPutDomainsPublicKey: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    Logger.debug('procPutDomainsPublicKey');
    if (req.vDomain) {
        if (req.files) {
            try {
                // The public key is a binary 'file' that should be in multer memory storage
                const publicKeyBin: Buffer = (req.files as any).public_key[0].buffer;

                const fieldsToUpdate = {
                    'publicKey': convertBinKeyToPEM(publicKeyBin)
                };
                await Domains.updateEntityFields(req.vDomain, fieldsToUpdate);
            }
            catch (e) {
                Logger.error('procPutDomainsPublicKey: exception converting: ' + e);
                req.vRestResp.respondFailure('exception converting public key');
            }
        }
        else {
            Logger.error('procPutDomainsPublicKey: no files part of body');
            req.vRestResp.respondFailure('no public key supplied');
        };
    }
    else {
        req.vRestResp.HTTPStatus = HTTPStatusCode.Unauthorized;
        req.vRestResp.respondFailure(req.vDomainError ?? 'no such domain');
    };
    next();
};

export const name = '/api/v1/domains/public_key';

export const router = Router();

router.get(   '/api/v1/domains/:domainId/public_key',  [ setupMetaverseAPI,
                                                  domainFromParams,
                                                  procGetDomainsPublicKey,
                                                  finishMetaverseAPI ] );

// The public key is sent in binary in a multipart-form.
// This creates an unpacker to catch fields 'api_key' and 'public_key'
const multiStorage = multer.memoryStorage();
const uploader = multer( { storage: multiStorage, });
const multiParser = uploader.fields( [ { name: 'api_key' }, { name: 'public_key' }]);
router.put(   '/api/v1/domains/:domainId/public_key',  [ setupMetaverseAPI,
                                                  domainFromParams,           // vRESTResp.vDomain
                                                  multiParser,    // body['api_key'], files['public_key'].buffer
                                                  domainAPIkeyFromMultipart,  // vRestRest.vDomainAPIKey
                                                  verifyDomainAccess,
                                                  procPutDomainsPublicKey,
                                                  finishMetaverseAPI ] );

