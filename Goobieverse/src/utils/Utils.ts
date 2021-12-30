import { DomainModel } from '../interfaces/DomainModel';
import { PlaceModel } from '../interfaces/PlaceModel';
import { Visibility } from './sets/Visibility';
import { Maturity } from './sets/Maturity';
import { SArray,VKeyedCollection } from './vTypes';
import { Roles } from './sets/Roles';
import { AccountModel } from '../interfaces/AccountModel';
import { IsNotNullOrEmpty,IsNullOrEmpty } from './Misc';
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


// The returned location info has many options depending on whether
//    the account has set location and/or has an associated domain.
// Return a structure that represents the target account's domain

export async function buildLocationInfo(pAcct: AccountModel,aDomain?: DomainModel): Promise<any> {
  let ret: any = {};
  if (pAcct.locationDomainId) {
    if (IsNotNullOrEmpty(aDomain) && aDomain) {
      ret = {
        root: {
          domain: await buildDomainInfo(aDomain),
        },
        path: pAcct.locationPath,
      };
    } else {
      // The domain doesn't have an ID
      ret = {
        root: {
          domain: {
            network_address: pAcct.locationNetworkAddress,
            network_port: pAcct.locationNetworkPort,
          },
        },
      };
    }
  }
  ret.node_id = pAcct.locationNodeId;
  ret.online = isOnline(pAcct);
  return ret;
}

// A smaller, top-level domain info block
export async function buildDomainInfo(pDomain: DomainModel): Promise<any> {
  return {
    id: pDomain.id,
    domainId: pDomain.id,
    name: pDomain.name,
    visibility: pDomain.visibility ?? Visibility.OPEN,
    capacity: pDomain.capacity,
    sponsorAccountId: pDomain.sponsorAccountId,
    label: pDomain.name,
    network_address: pDomain.networkAddr,
    network_port: pDomain.networkPort,
    ice_server_address: pDomain.iceServerAddr,
    version: pDomain.version,
    protocol_version: pDomain.protocol,
    active: pDomain.active ?? false,
    time_of_last_heartbeat: pDomain.timeOfLastHeartbeat?.toISOString(),
    time_of_last_heartbeat_s: pDomain.timeOfLastHeartbeat?.getTime().toString(),
    num_users: pDomain.numUsers,
  };
}

// Return a structure with the usual domain information.
export async function buildDomainInfoV1(pDomain: DomainModel): Promise<any> {
  return {
    domainId: pDomain.id,
    id: pDomain.id, // legacy
    name: pDomain.name,
    visibility: pDomain.visibility ?? Visibility.OPEN,
    world_name: pDomain.name, // legacy
    label: pDomain.name, // legacy
    public_key: pDomain.publicKey
      ? createSimplifiedPublicKey(pDomain.publicKey)
      : undefined,
    owner_places: await buildPlacesForDomain(pDomain),
    sponsor_account_id: pDomain.sponsorAccountId,
    ice_server_address: pDomain.iceServerAddr,
    version: pDomain.version,
    protocol_version: pDomain.protocol,
    network_address: pDomain.networkAddr,
    network_port: pDomain.networkPort,
    automatic_networking: pDomain.networkingMode,
    restricted: pDomain.restricted,
    num_users: pDomain.numUsers,
    anon_users: pDomain.anonUsers,
    total_users: pDomain.numUsers,
    capacity: pDomain.capacity,
    description: pDomain.description,
    maturity: pDomain.maturity ?? Maturity.UNRATED,
    restriction: pDomain.restriction,
    managers: pDomain.managers,
    tags: pDomain.tags,
    meta: {
      capacity: pDomain.capacity,
      contact_info: pDomain.contactInfo,
      description: pDomain.description,
      images: pDomain.images,
      managers: pDomain.managers,
      restriction: pDomain.restriction,
      tags: pDomain.tags,
      thumbnail: pDomain.thumbnail,
      world_name: pDomain.name,
    },
    users: {
      num_anon_users: pDomain.anonUsers,
      num_users: pDomain.numUsers,
      user_hostnames: pDomain.hostnames,
    },
    time_of_last_heartbeat: pDomain.timeOfLastHeartbeat?.toISOString(),
    time_of_last_heartbeat_s: pDomain.timeOfLastHeartbeat?.getTime().toString(),
    last_sender_key: pDomain.lastSenderKey,
    addr_of_first_contact: pDomain.iPAddrOfFirstContact,
    when_domain_entry_created: pDomain.whenCreated?.toISOString(),
    when_domain_entry_created_s: pDomain.whenCreated?.getTime().toString(),
  };
}

// Return the limited "user" info.. used by /api/v1/users
export async function buildUserInfo(pAccount: AccountModel): Promise<any> {
  return {
    accountId: pAccount.id,
    id: pAccount.id,
    username: pAccount.username,
    images: await buildImageInfo(pAccount),
    location: await buildLocationInfo(pAccount),
  };
}

export async function buildImageInfo(pAccount: AccountModel): Promise<any> {
  const ret:VKeyedCollection = {};
  
  if (pAccount.imagesTiny) ret.tiny = pAccount.imagesTiny;
  if (pAccount.imagesHero) ret.hero = pAccount.imagesHero;
  if (pAccount.imagesThumbnail) ret.thumbnail = pAccount.imagesThumbnail;
  return ret;
}

// Return the block of account information.
// Used by several of the requests to return the complete account information.
export async function buildAccountInfo(
  pAccount: AccountModel
): Promise<any> {
  return {
    accountId: pAccount.id,
    id: pAccount.id,
    username: pAccount.username,
    email: pAccount.email,
    administrator: isAdmin(pAccount),
    enabled: isEnabled(pAccount),
    roles: pAccount.roles,
    availability: pAccount.availability,
    public_key: createSimplifiedPublicKey(pAccount.sessionPublicKey),
    images: {
      hero: pAccount.imagesHero,
      tiny: pAccount.imagesTiny,
      thumbnail: pAccount.imagesThumbnail,
    },
    profile_detail: pAccount.profileDetail,
    location: await buildLocationInfo(pAccount),
    friends: pAccount.friends,
    connections: pAccount.connections,
    when_account_created: pAccount.whenCreated?.toISOString(),
    when_account_created_s: pAccount.whenCreated?.getTime().toString(),
    time_of_last_heartbeat: pAccount.timeOfLastHeartbeat?.toISOString(),
    time_of_last_heartbeat_s: pAccount.timeOfLastHeartbeat
      ?.getTime()
      .toString(),
  };
}

// getter property that is 'true' if the user is a grid administrator
function isAdmin(pAcct: AccountModel): boolean {
  return SArray.has(pAcct.roles, Roles.ADMIN);
}
// Any logic to test of account is active
//   Currently checks if account email is verified or is legacy
//   account (no 'accountEmailVerified' variable)
function isEnabled(pAcct: AccountModel): boolean {
  return pAcct.accountEmailVerified ?? true;
}

// Return the block of account information used as the account 'profile'.
// Anyone can fetch a profile (if 'availability' is 'any') so not all info is returned
export async function buildAccountProfile(
  pAccount: AccountModel,
  aDomain?: DomainModel
): Promise<any> {
  return {
    accountId: pAccount.id,
    id: pAccount.id,
    username: pAccount.username,
    images: {
      hero: pAccount.imagesHero,
      tiny: pAccount.imagesTiny,
      thumbnail: pAccount.imagesThumbnail,
    },
    profile_detail: pAccount.profileDetail,
    location: await buildLocationInfo(pAccount,aDomain),
    when_account_created: pAccount.whenCreated?.toISOString(),
    when_account_created_s: pAccount.whenCreated?.getTime().toString(),
    time_of_last_heartbeat: pAccount.timeOfLastHeartbeat?.toISOString(),
    time_of_last_heartbeat_s: pAccount.timeOfLastHeartbeat
      ?.getTime()
      .toString(),
  };
}

// Return an object with the formatted place information
// Pass the PlaceModel and the place's domain if known.
export async function buildPlaceInfo(
  pPlace: PlaceModel,
  pDomain?: DomainModel
): Promise<any> {
  const ret = await buildPlaceInfoSmall(pPlace, pDomain);

  // if the place points to a domain, add that information also
  if (IsNotNullOrEmpty(pDomain) && pDomain) {
    ret.domain = await buildDomainInfo(pDomain);
  }
  return ret;
}
// Return the basic information block for a Place
export async function buildPlaceInfoSmall(
  pPlace: PlaceModel,
  pDomain?: DomainModel
): Promise<any> {
  const ret = {
    placeId: pPlace.id,
    id: pPlace.id,
    name: pPlace.name,
    displayName: pPlace.displayName,
    visibility: pPlace.visibility ?? Visibility.OPEN,
    address: getAddressString(pPlace,pDomain),
    path: pPlace.path,
    description: pPlace.description,
    maturity: pPlace.maturity ?? Maturity.UNRATED,
    tags: pPlace.tags,
    managers: await getManagers(pPlace,pDomain),
    thumbnail: pPlace.thumbnail,
    images: pPlace.images,
    current_attendance: pPlace.currentAttendance ?? 0,
    current_images: pPlace.currentImages,
    current_info: pPlace.currentInfo,
    current_last_update_time: pPlace.currentLastUpdateTime?.toISOString(),
    current_last_update_time_s: pPlace.currentLastUpdateTime
      ?.getTime()
      .toString(),
    last_activity_update: pPlace.lastActivity?.toISOString(),
    last_activity_update_s: pPlace.lastActivity?.getTime().toString(),
  };
  return ret;
}


function getAddressString(pPlace: PlaceModel,aDomain?: DomainModel): string {
  // Compute and return the string for the Places's address.
  // The address is of the form "optional-domain/x,y,z/x,y,z,w".
  // If the domain is missing, the domain-server's network address is added
  let addr = pPlace.path ?? '/0,0,0/0,0,0,1';

  // If no domain/address specified in path, build addr using reported domain IP/port
  const pieces = addr.split('/');
  if (pieces[0].length === 0) {
    if (IsNotNullOrEmpty(aDomain) && aDomain) {
      if (IsNotNullOrEmpty(aDomain.networkAddr)) {
        let domainAddr = aDomain.networkAddr;
        if (IsNotNullOrEmpty(aDomain.networkPort)) {
          domainAddr = aDomain.networkAddr + ':' + aDomain.networkPort;
        }
        addr = domainAddr + addr;
      }
    }
  }
  return addr;
}

async function getManagers(pPlace: PlaceModel,aDomain?: DomainModel): Promise<string[]> {
  if(IsNullOrEmpty(pPlace.managers)) {
    pPlace.managers = [];
    //uncomment after complete Accounts Places api  
    /*
    if (aDomain) {
      const aAccount = await Accounts.getAccountWithId(aDomain.sponsorAccountId);
      if (aAccount) {
        pPlace.managers = [ aAccount.username ];
      }
    }
    await Places.updateEntityFields(pPlace, { 'managers': pPlace.managers })
    */
  }
  return pPlace.managers;
}

// Return an array of Places names that are associated with the passed domain
export async function buildPlacesForDomain(pDomain: DomainModel): Promise<any[]> {
  const ret: any[] = [];
  //uncomment after complete Places api
  /* for await (const aPlace of Places.enumerateAsync(new GenericFilter({ domainId: pDomain.id }))) {
    ret.push(await buildPlaceInfoSmall(aPlace, pDomain));
  }*/
  return ret;
}

function isOnline(pAcct: AccountModel): boolean {
  if (pAcct && pAcct.timeOfLastHeartbeat) {
    return (
      Date.now().valueOf() - pAcct.timeOfLastHeartbeat.valueOf() <
      config.metaverseServer.heartbeat_seconds_until_offline * 1000
    );
  }
  return false;
}
