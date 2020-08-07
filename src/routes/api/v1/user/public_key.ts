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

import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';
import { accountFromAuthToken, domainAPIkeyFromMultipart, verifyDomainAccess } from '@Route-Tools/middleware';

import multer from 'multer';

import { Logger } from '@Tools/Logging';
import { convertBinKeyToPEM } from '@Route-Tools/Util';
import { Accounts } from '@Entities/Accounts';

// metaverseServerApp.use(express.urlencoded({ extended: false }));

// PUT /api/v1/user/public_key
// The api_key and public_key are POSTed as entities in a multi-part-form mime type.
// The public_key is sent as a binary (DER) form of a PKCS1 key.
// To keep backward compatibility, we convert the PKCS1 key into a SPKI key in PEM format
//      ("PEM" format is "Privacy Enhanced Mail" format and has the "BEGIN" and "END" text included).
const procPutUserPublicKey: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.vAuthAccount) {
    if (req.files) {
      try {
        // The public key is a binary 'file' that should be in multer memory storage
        const publicKeyBin: Buffer = (req.files as any).public_key[0].buffer;

        const fieldsToUpdate = {
          'sessionPublicKey': convertBinKeyToPEM(publicKeyBin)
        };
        await Accounts.updateEntityFields(req.vAuthAccount, fieldsToUpdate);
      }
      catch (e) {
        Logger.error('procPutUserPublicKey: exception converting: ' + e);
        req.vRestResp.respondFailure('exception converting public key');
      }
    }
    else {
      Logger.error('procPutUserPublicKey: no files part of body');
      req.vRestResp.respondFailure('no public key supplied');
    }
  }
  else {
    req.vRestResp.respondFailure('unauthorized');
  };
  next();
};

export const name = '/api/v1/user/public_key';

export const router = Router();

router.put(   '/api/v1/user/public_key',             procPutUserPublicKey);

// The public key is sent in binary in a multipart-form.
// This creates an unpacker to catch fields 'api_key' and 'public_key'
const multiStorage = multer.memoryStorage();
const uploader = multer( { storage: multiStorage, });
const multiParser = uploader.fields( [ { name: 'public_key' }]);
router.put( '/api/v1/user/public_key', [ setupMetaverseAPI,
                                         accountFromAuthToken,  // vRESTResp.vAuthAccount
                                         multiParser,    // body['api_key'], files['public_key'].buffer
                                         procPutUserPublicKey,
                                         finishMetaverseAPI ] );