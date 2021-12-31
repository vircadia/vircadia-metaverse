import { DatabaseService } from './../../dbservice/DatabaseService';
import { DomainModel } from './../../interfaces/DomainModel';
import { AccountModel } from '../../interfaces/AccountModel';
import config from '../../appconfig';
import { Availability } from '../../utils/sets/Availability';
import { Params, Id } from '@feathersjs/feathers';
import {  MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';
import { buildAccountProfile } from '../../responsebuilder/accountsBuilder';
import { IsNotNullOrEmpty } from '../../utils/Misc';

export class Profiles extends DatabaseService {

  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options,app);
  }

  async find(params?: Params): Promise<any> {
    
    const perPage = parseInt(params?.query?.per_page) || 10;
    const skip = ((parseInt(params?.query?.page) || 1) - 1) * perPage;

    const accountData = await this.findData(config.dbCollections.accounts,{
      query: {
        $or: [{availability:undefined},{availability: Availability.ALL }],
        $skip: skip,
        $limit: perPage,
      }, 
    });

    let accounts:AccountModel[] = [];

    if(accountData instanceof Array){
      accounts = accountData as Array<AccountModel>;
    }else{
      accounts = accountData.data as Array<AccountModel>;  
    }


    const domainIds = (accounts as Array<AccountModel>)
      ?.map((item) => item.locationDomainId)
      .filter(
        (value, index, self) =>
          self.indexOf(value) === index && value !== undefined
      );
      
    const domainData= await this.findData(config.dbCollections.domains,{ query:{id: { $in: domainIds }}});

    let domains:DomainModel[] = [];

    if(domainData instanceof Array){
      domains = domainData as Array<DomainModel>;
    }else{
      domains = domainData.data as Array<DomainModel>;  
    }   

    const profiles: Array<any> = [];

    (accounts as Array<AccountModel>)?.forEach(async (element) => {
      let domainModel: DomainModel | undefined;
      for (const domain of domains) {
        if (domain && domain.id === element.locationDomainId) {
          domainModel = domain;
          break;
        }
      }
      profiles.push(await buildAccountProfile(element, domainModel));
    });
    return Promise.resolve({ profiles }); 
  }

  async get(id: Id, params: Params): Promise<any> {
    const accountData = await this.findData(config.dbCollections.accounts,{query:{id:id}});
   
    let accounts:AccountModel[] = [];

    if(accountData instanceof Array){
      accounts = accountData as Array<AccountModel>;
    }else{
      accounts = accountData.data as Array<AccountModel>;  
    }

    if(IsNotNullOrEmpty(accounts)){
      const account = (accounts as Array<AccountModel>)[0];    
      
      const domainData = await this.findData(config.dbCollections.domains,{ id: { $eq: account.locationDomainId } });
      
      let domains:DomainModel[] = [];

      if(domainData instanceof Array){
        domains = domainData as Array<DomainModel>;
      }else{
        domains = domainData.data as Array<DomainModel>;  
      }  

      let domainModel: any;
      if(IsNotNullOrEmpty(domains)){domainModel = domains[0];}
      const profile = await buildAccountProfile(account, domainModel);
      return Promise.resolve({ profile });
    }else{
      return Promise.resolve({});
    }
  }
}
