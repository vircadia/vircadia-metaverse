import { AccountModel } from './../interfaces/AccountModel';
import { IsNotNullOrEmpty,IsNullOrEmpty } from '../utils/Misc';
import { buildDomainInfo } from './domainsBuilder';
import { DomainModel } from '../interfaces/DomainModel';
import { isOnline } from '../utils/Utils';
import { PlaceModel } from '../interfaces/PlaceModel';
import { Visibility } from '../utils/sets/Visibility';
import { Maturity } from '../utils/sets/Maturity';
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

// Return an object with the formatted place information
// Pass the PlaceModel and the place's domain if known.
export async function buildPlaceInfo(pPlace: PlaceModel,pDomain?: DomainModel): Promise<any> {
  const ret = await buildPlaceInfoSmall(pPlace, pDomain);
  
  // if the place points to a domain, add that information also
  if (IsNotNullOrEmpty(pDomain) && pDomain) {
    ret.domain = await buildDomainInfo(pDomain);
  }
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


// Return the basic information block for a Place
export async function buildPlaceInfoSmall(pPlace: PlaceModel,pDomain?: DomainModel): Promise<any> {
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
    current_last_update_time_s: pPlace.currentLastUpdateTime?.getTime().toString(),
    last_activity_update: pPlace.lastActivity?.toISOString(),
    last_activity_update_s: pPlace.lastActivity?.getTime().toString(),
  };
  return ret;
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