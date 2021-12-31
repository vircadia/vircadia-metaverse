import { Visibility } from '../utils/sets/Visibility';
import { DomainModel } from '../interfaces/DomainModel';
import { createSimplifiedPublicKey } from '../utils/Utils';
import { buildPlacesForDomain } from './placesBuilder';
import { Maturity } from '../utils/sets/Maturity';
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
    public_key: pDomain.publicKey? createSimplifiedPublicKey(pDomain.publicKey): undefined,
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
  