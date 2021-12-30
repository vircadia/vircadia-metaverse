import { DomainModel } from './../../interfaces/DomainModel';
import { AccountModel } from '../../interfaces/AccountModel';
import config from '../../appconfig';
import { Availability } from '../../utils/sets/Availability';
import { Db } from 'mongodb';
import { Params, Id } from '@feathersjs/feathers';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';
import { buildAccountProfile } from '../../utils/Utils';
import { IsNotNullOrEmpty } from '../../utils/Misc';

export class Profiles extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  app: Application;
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);
    this.app = app;

    const client: Promise<Db> = app.get('mongoClient');
    client.then((database) => {
      this.Model = database.collection(config.dbCollections.accounts);
    });
  }

  async find(params?: Params): Promise<any> {
    const db = await this.app.get('mongoClient');
    const perPage = parseInt(params?.query?.per_page) || 10;
    const skip = ((parseInt(params?.query?.page) || 1) - 1) * perPage;

    const accounts = await super.find({
      query: {
        $or: [{ availability: undefined }, { availability: Availability.ALL }],
        $skip: skip,
        $limit: perPage,
      },
    });

    const domainIds = (accounts as Array<AccountModel>)
      ?.map((item) => item.locationDomainId)
      .filter(
        (value, index, self) =>
          self.indexOf(value) === index && value !== undefined
      );

    const domains: Array<DomainModel> = await db
      .collection(config.dbCollections.domains)
      .find({ query:{id: { $in: domainIds }}})
      .toArray();

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
    const db = await this.app.get('mongoClient');
    const accounts = await super.find({query:{id:id}});
    if(IsNotNullOrEmpty(accounts)){
      const account = (accounts as Array<AccountModel>)[0];    
      const domains: Array<DomainModel> = await db.collection(config.dbCollections.domains).find({ id: { $eq: account.locationDomainId } }).toArray();
      let domainModel: any;
      if(IsNotNullOrEmpty(domains)){domainModel = domains[0];}
      const profile = await buildAccountProfile(account, domainModel);
      return Promise.resolve({ profile });
    }else{
      return Promise.resolve({});
    }
  }
}
