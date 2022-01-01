import { AccountModel } from '../interfaces/AccountModel';
import { Application, Paginated } from '@feathersjs/feathers';
import { HookContext } from '@feathersjs/feathers';
import { IsNotNullOrEmpty } from '../utils/Misc';
import { Perm } from '../utils/Perm';
import { isAdmin } from '../utils/Utils';
import config from '../appconfig';
import {HTTPStatusCode} from '../utils/response';
import {Availability} from '../utils/sets/Availability';
import { SArray } from '../utils/vTypes';
import { DatabaseService } from '../dbservice/DatabaseService';
import { messages } from '../utils/messages';

export default (collection: string ,pRequiredAccess: Perm[]) => {
  return async (context: HookContext): Promise<HookContext> => {
    const  dbService = new DatabaseService({},undefined,context);
    const loginUser = context.params.user;
  
    const entryDataArray = await dbService.findDataToArray(collection,{query:{id:context.id}});
    let canAccess = false;

    let pTargetEntity: any; 
    if(IsNotNullOrEmpty(entryDataArray)){
      pTargetEntity = entryDataArray[0];
    }


    if (IsNotNullOrEmpty(pTargetEntity) && pTargetEntity) {
      for (const perm of pRequiredAccess) {
        switch (perm) {
        case Perm.ALL:
          canAccess = true;
          break;
        case Perm.PUBLIC:
          // The target entity is publicly visible
          // Mostly AccountEntities that must have an 'availability' field
          if (pTargetEntity?.hasOwnProperty('availability')) {
            if ((pTargetEntity).availability.includes(Availability.ALL)) {
              canAccess = true;
            }
          }
          break;
        case Perm.DOMAIN:
          // requestor is a domain and it's account is the domain's sponsoring account
          if (loginUser) {
            if (pTargetEntity.hasOwnProperty('sponsorAccountId')) {
              canAccess = loginUser.id === (pTargetEntity as any).sponsorAccountId;
            }
            else {
              // Super special case where domain doesn't have a sponsor but has an api_key.
              // In this case, the API_KEY is put in the accountId field of the DOMAIN scoped AuthToken
              if (pTargetEntity.hasOwnProperty('apiKey')) {
                canAccess = loginUser.id === (pTargetEntity as any).apiKey;
              }
            }
          }
          break; 
        case Perm.OWNER:
          // The requestor wants to be the same account as the target entity
          if (loginUser && pTargetEntity.hasOwnProperty('id')) {
            canAccess = (loginUser.id === (pTargetEntity as any).id);
          }
          if (loginUser && !canAccess && pTargetEntity.hasOwnProperty('accountId')) {
            canAccess = loginUser.id === (pTargetEntity as any).accountId;
          } 
          break;
        case Perm.FRIEND:
          // The requestor is a 'friend' of the target entity
          if (loginUser && pTargetEntity.hasOwnProperty('friends')) {
            const targetFriends: string[] = (pTargetEntity as AccountModel).friends;
            if (targetFriends) {
              canAccess = SArray.hasNoCase(targetFriends, loginUser.username);
            }
          }
          break;
        case Perm.CONNECTION:
          // The requestor is a 'connection' of the target entity
          if (loginUser && pTargetEntity.hasOwnProperty('connections')) {
            const targetConnections: string[] = (pTargetEntity as AccountModel).connections;
            if (targetConnections) {
              canAccess = SArray.hasNoCase(targetConnections, loginUser.username);
            }
          }
          break;
        case Perm.ADMIN: 
          // If the authToken is an account, has access if admin
          if (loginUser) {
            canAccess = isAdmin(loginUser as AccountModel);
          }
          break;
        case Perm.SPONSOR:
          // Requestor is a regular account and is the sponsor of the domain
          if (loginUser) {
            if (pTargetEntity.hasOwnProperty('sponsorAccountId')) {
              canAccess = loginUser.id === (pTargetEntity as any).sponsorAccountId;
            }
          }
          break;
        case Perm.MANAGER:
          // See if requesting account is in the list of managers of this entity
          if (loginUser) {
            if (pTargetEntity.hasOwnProperty('managers')) {
              const managers: string[] = (pTargetEntity as any).managers;
              if (managers && managers.includes(loginUser.username.toLowerCase())) {
                canAccess = true;
              }
            }
          }
          break;
        case Perm.DOMAINACCESS:
          // Target entity has a domain reference and verify the requestor is able to reference that domain
          if (loginUser && pTargetEntity.hasOwnProperty('domainId')) {
            const aDomains = await dbService.findDataToArray(config.dbCollections.domains,{query:{id:(pTargetEntity as any).domainId}});
            if (IsNotNullOrEmpty(aDomains)) {
              canAccess = aDomains[0].sponsorAccountId === loginUser.id;
            }
          }
          break;
        }
        if(canAccess)break;
      }  
    }else{
      context.statusCode = HTTPStatusCode.NotFound;
      throw new Error(messages.common_messages_target_account_notfound);
    }
    
    if (!canAccess){ 
      context.statusCode = HTTPStatusCode.Unauthorized;
      throw new Error(messages.common_messages_unauthorized);
    }
    
    return context;
  };
};