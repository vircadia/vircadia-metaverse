import { AccountModel } from './../interfaces/AccountModel';
import { SArray } from './vTypes';
import { Roles } from './sets/Roles';
import config from '../appconfig';


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
    }
  }
  return keyLines.join('');    // Combine all lines into one long string
}

// getter property that is 'true' if the user is a grid administrator
export function isAdmin(pAcct: AccountModel): boolean {
  return SArray.has(pAcct.roles, Roles.ADMIN);
}
// Any logic to test of account is active
//   Currently checks if account email is verified or is legacy
//   account (no 'accountEmailVerified' variable)
export function isEnabled(pAcct: AccountModel): boolean {
  return pAcct.accountEmailVerified ?? true;
}


export function isOnline(pAcct: AccountModel): boolean {
  if (pAcct && pAcct.timeOfLastHeartbeat) {
    return (
      Date.now().valueOf() - pAcct.timeOfLastHeartbeat.valueOf() <
      config.metaverseServer.heartbeat_seconds_until_offline * 1000
    );
  }
  return false;
}
 
export function couldBeDomainId(pId: string): boolean {
  return pId.length === 36;
}

// Return the ISODate when an account is considered offline
export function dateWhenNotOnline(): Date {
  const whenOffline = new Date(Date.now() - config.metaverseServer.heartbeat_seconds_until_offline);
  return whenOffline;
}

export function validateEmail(email:string):boolean{
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;
  return emailRegexp.test(email);
}