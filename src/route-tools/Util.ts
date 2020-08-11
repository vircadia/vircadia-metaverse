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

import { Request } from 'express';
import { createPublicKey } from 'crypto';
import { checkAvailability } from '@Entities/AccountEntity';
import { VKeyedCollection } from '@Tools/vTypes';
import { IsNotNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

// The public_key is sent as a binary (DER) form of a PKCS1 key.
// To keep backward compatibility, we convert the PKCS1 key into a SPKI key in PEM format
//      ("PEM" format is "Privacy Enhanced Mail" format and has the "BEGIN" and "END" text included).
export function convertBinKeyToPEM(pBinKey: Buffer): string {
  // Convert the passed binary into a crypto.KeyObject
  const publicKey = createPublicKey( {
    key: pBinKey,
    format: 'der',
    type: 'pkcs1'
  });
  // Convert the public key to 'SubjectPublicKeyInfo' (SPKI) format as a PEM string
  const convertedKey = publicKey.export({ type: 'spki', format: 'pem' });
  return convertedKey as string;
};

// The legacy interface returns public keys as a stripped PEM key.
// "stripped" in that the bounding "BEGIN" and "END" lines have been removed.
// This routine returns a stripped key string from a properly PEM formatted public key string.
export function createSimplifiedPublicKey(pPubKey: string): string {
    let keyLines: string[] = [];
    if (pPubKey) {
      keyLines = pPubKey.split('\n');
      keyLines.shift(); // Remove the "BEGIN" first line
      while (keyLines.length > 1
              && ( keyLines[keyLines.length-1].length < 1 || keyLines[keyLines.length-1].includes('END PUBLIC KEY') ) ) {
        keyLines.pop();   // Remove the "END" last line
      };
    }
    return keyLines.join('');    // Combine all lines into one long string
};

// Returns a set of fields for 'location' that should be updated.
// Returns undefined if there was an error
export function getAccountLocationIfSpecified(pReq: Request): any {
  let newLoc: VKeyedCollection = IsNotNullOrEmpty(pReq.vAuthAccount.location) ? pReq.vAuthAccount.location : {};
  if (pReq.body.location) {
    try {
      // build location from what is in the account already
      const loc = pReq.body.location;
      if (loc.hasOwnProperty('connected'))       newLoc.connected = loc.connected;
      if (loc.hasOwnProperty('path'))            newLoc.path = loc.path;
      if (loc.hasOwnProperty('place_id'))        newLoc.placeId = loc.place_id;
      if (loc.hasOwnProperty('domain_id'))       newLoc.domainId = loc.domain_id;
      if (loc.hasOwnProperty('network_address')) newLoc.networkAddress = loc.network_address;
      if (loc.hasOwnProperty('network_port'))    newLoc.networkPort = loc.network_port;
      if (loc.hasOwnProperty('node_id'))         newLoc.nodeId = loc.node_id;
      if (loc.hasOwnProperty('availablity')) {
        if (checkAvailability(loc.availablity)) {
          newLoc.availablity = loc.availablity;
        }
        else {
          Logger.debug(`procPutUserLocation: defaulting availability to "none" because passed odd value ${loc.availablity} by ${pReq.vAuthAccount.username}`);
          newLoc.availablity = 'none';
        };
      };
    }
    catch ( err ) {
      Logger.error(`procPutUserLocation: exception parsing put from ${pReq.vAuthAccount.username}: ${err}`);
      pReq.vRestResp.respondFailure(`exception parsing request: ${err}`);
      newLoc = undefined;
    };
  };
  return newLoc;
}