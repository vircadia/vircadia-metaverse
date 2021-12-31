import { AccountModel } from './../interfaces/AccountModel';
import { Application, Paginated } from '@feathersjs/feathers';
import { HookContext } from '@feathersjs/feathers';
import { IsNotNullOrEmpty } from '../utils/Misc';
import { Perm } from '../utils/Perm';
import config from '../appconfig';
import {HTTPStatusCode} from '../utils/response';
import {Availability} from '../utils/sets/Availability';
import { SArray } from '../utils/vTypes';
import { DatabaseService } from '../dbservice/DatabaseService';

export default (pRequiredAccess: Perm[]) => {
  return async (context: HookContext): Promise<HookContext> => {
    const  dbService = new DatabaseService({},undefined,context);
    
    const accounts = await dbService.findData(config.dbCollections.accounts,{query:{id:context.id}});
    console.log(accounts);
    let canAccess = false;

    if (IsNotNullOrEmpty(accounts)) {


      let pTargetEntity:AccountModel;

      if(accounts instanceof Array){
        pTargetEntity = (accounts as Array<AccountModel>)[0];
      }else{
        pTargetEntity = accounts.data[0];  
      }


      for (const perm of pRequiredAccess) {
        switch (perm) {
        case Perm.ALL:
          canAccess = true;
          break;
        case Perm.PUBLIC:
          // The target entity is publicly visible
          // Mostly AccountEntities that must have an 'availability' field
          if (pTargetEntity.hasOwnProperty('availability')) {
            if ((pTargetEntity).availability.includes(Availability.ALL)) {
              canAccess = true;
            }
          }
          break;
        /* case Perm.DOMAIN:
          // requestor is a domain and it's account is the domain's sponsoring account
          if (pAuthToken && SArray.has(pAuthToken.scope, TokenScope.DOMAIN)) {
            if (pTargetEntity.hasOwnProperty('sponsorAccountId')) {
              canAccess = pAuthToken.accountId === (pTargetEntity as any).sponsorAccountId;
            }
            else {
              // Super special case where domain doesn't have a sponsor but has an api_key.
              // In this case, the API_KEY is put in the accountId field of the DOMAIN scoped AuthToken
              if (pTargetEntity.hasOwnProperty('apiKey')) {
                canAccess = pAuthToken.accountId === (pTargetEntity as any).apiKey;
              }
            }
          }
          break;
        case Perm.OWNER:
          // The requestor wants to be the same account as the target entity
          if (pAuthToken && pTargetEntity.hasOwnProperty('id')) {
            canAccess = pAuthToken.accountId === (pTargetEntity as AccountEntity).id;
          }
          if (!canAccess && pTargetEntity.hasOwnProperty('accountId')) {
            canAccess = pAuthToken.accountId === (pTargetEntity as any).accountId;
          }
          break;
        case Perm.FRIEND:
          // The requestor is a 'friend' of the target entity
          if (pAuthToken && pTargetEntity.hasOwnProperty('friends')) {
            const targetFriends: string[] = (pTargetEntity as AccountEntity).friends;
            if (targetFriends) {
              requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
              canAccess = SArray.hasNoCase(targetFriends, requestingAccount.username);
            }
          }
          break;
        case Perm.CONNECTION:
          // The requestor is a 'connection' of the target entity
          if (pAuthToken && pTargetEntity.hasOwnProperty('connections')) {
            const targetConnections: string[] = (pTargetEntity as AccountEntity).connections;
            if (targetConnections) {
              requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
              canAccess = SArray.hasNoCase(targetConnections, requestingAccount.username);
            }
          }
          break;
        case Perm.ADMIN:
          if (pAuthToken && Tokens.isSpecialAdminToken(pAuthToken)) {
            Logger.cdebug('field-setting', `checkAccessToEntity: isSpecialAdminToken`);
            canAccess = true;
          }
          else {
            // If the authToken is an account, has access if admin
            if (pAuthToken && SArray.has(pAuthToken.scope, TokenScope.OWNER)) {
              Logger.cdebug('field-setting', `checkAccessToEntity: admin. auth.AccountId=${pAuthToken.accountId}`);
              requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
              canAccess = Accounts.isAdmin(requestingAccount);
            }
          }
          break;
        case Perm.SPONSOR:
          // Requestor is a regular account and is the sponsor of the domain
          if (pAuthToken && SArray.has(pAuthToken.scope, TokenScope.OWNER)) {
            if (pTargetEntity.hasOwnProperty('sponsorAccountId')) {
              Logger.cdebug('field-setting', `checkAccessToEntity: authToken is domain. auth.AccountId=${pAuthToken.accountId}, sponsor=${(pTargetEntity as any).sponsorAccountId}`);
              canAccess = pAuthToken.accountId === (pTargetEntity as DomainEntity).sponsorAccountId;
            }
          }
          break;
        case Perm.MANAGER:
          // See if requesting account is in the list of managers of this entity
          if (pAuthToken && SArray.has(pAuthToken.scope, TokenScope.OWNER)) {
            if (pTargetEntity.hasOwnProperty('managers')) {
              requestingAccount = requestingAccount ?? await Accounts.getAccountWithId(pAuthToken.accountId);
              if (requestingAccount) {
                const managers: string[] = (pTargetEntity as DomainEntity).managers;
                // Logger.debug(`Perm.MANAGER: managers=${JSON.stringify(managers)}, target=${requestingAccount.username}`);
                if (managers && managers.includes(requestingAccount.username.toLowerCase())) {
                  canAccess = true;
                }
              }
            }
          }
          break;
        case Perm.DOMAINACCESS:
          // Target entity has a domain reference and verify the requestor is able to reference that domain
          if (pAuthToken && pTargetEntity.hasOwnProperty('domainId')) {
            const aDomain = await Domains.getDomainWithId((pTargetEntity as any).domainId);
            if (aDomain) {
              canAccess = aDomain.sponsorAccountId === pAuthToken.accountId;
            }
          }
          break;*/ 
        default:
          canAccess = false;
          break;
        }
        // If some permission allows access, we are done
        
      }  
    }else{
      context.statusCode = HTTPStatusCode.NotFound;
      throw new Error('Target account not found');
    }
    
    if (!canAccess){ 
      context.statusCode = HTTPStatusCode.Unauthorized;
      throw new Error('Unauthorized');
    }
    
    return context;
  };
};