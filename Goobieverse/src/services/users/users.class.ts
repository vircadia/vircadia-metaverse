import { DatabaseService } from './../../dbservice/DatabaseService';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';
import config from '../../appconfig';
import { Id, Params } from '@feathersjs/feathers';
import { AccountModel } from '../../interfaces/AccountModel';
import { Response } from '../../utils/response';
import { GenUUID, IsNotNullOrEmpty } from '../../utils/Misc';
import { Roles } from '../../utils/sets/Roles';
import { IsNullOrEmpty } from '../../utils/Misc';
export class Users extends DatabaseService {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options,app);
  }

  async create(data: AccountModel, params?: Params): Promise<any> {
    // try {
    //   const id = GenUUID();
    //   const username = trim(data.username);
    //   const email = trim(data.email);
    //   const password = trim(data.password);
    //   const roles = [Roles.USER];
    //   const friends : string[] = [];
    //   const connections : string[] = [];
    //   const whenCreated = new Date();
    //   // const perPage = parseInt(params?.query?.per_page) || 10;
    //   // const skip = ((parseInt(params?.query?.page) || 1) - 1) * perPage;

    //   const accounts = await super.find({});
    //   console.log(accounts, 'all accounts');
    //   if (
    //     id != '' &&
    //     typeof id != 'undefined' &&
    //     username != '' &&
    //     typeof username != 'undefined' &&
    //     email != '' &&
    //     typeof email != 'undefined' &&
    //     password != '' &&
    //     typeof password != 'undefined' &&
    //     typeof roles != 'undefined'
    //   ) {
    //     const newData = { ...data, id: id , roles:roles,friends:friends,connections:connections,whenCreated:whenCreated};
    //     const UserData = await super
    //       .create(newData)
    //       .then((result: any) => {
    //         let finalData = {};
    //         finalData = result == null ? {} : result;
    //         return finalData;
    //       })
    //       .catch((error: any) => {
    //         return error;
    //       });
    //     if (isValidObject(UserData) && !UserData.type) {
    //       return Response.success(UserData);
    //     }
    //   } else {
    //     return Response.error(messages.common_messages_record_added_failed);
    //   }
    // } catch (error: any) {
    //   return Response.error(messages.common_messages_error);
    // }
    if (data) {
      const username : string = data.username;
      const email : string  = data.email;
      const password : string = data.password;
      if (username) {
        const accountsName: AccountModel[] = await this.findDataAsArray(config.dbCollections.accounts, { username: username } );
        console.log(accountsName, 'accountsName');
        const name = (accountsName as Array<AccountModel>)
          ?.map((item) => item.username);
        console.log(name);
        if (!name.includes(username)) {
          const accountsEmail: AccountModel[] = await this.findDataAsArray(config.dbCollections.accounts, { email: email } );
          const emailAddress = (accountsEmail as Array<AccountModel>)
            ?.map((item) => item.email);
          if (!emailAddress.includes(email)) {
            console.log('in');
            const id = GenUUID();
            const roles = [Roles.USER];
            const friends : string[] = [];
            const connections : string[] = [];
            const whenCreated = new Date();

            const newUserData = {
              ...data,
              id: id,
              roles: roles,
              whenCreated: whenCreated,
              friends: friends,
              connections:connections,
            };

            const accounts: AccountModel[] = await this.CreateData(config.dbCollections.accounts, { newUserData });
            console.log(accounts, 'accounts');
            // return Promise.resolve({ newUserData });
            // const AccountDetails = await this.CreateData(config.dbCollections.accounts, { query: {insertOne:{newUserData} } });
            // console.log(AccountDetails,'AccountDetails');
          }else{
            return Response.error('Email already exists');
          }
        } else {
          return Response.error('Account already exists');
        }
      } else {
        return Response.error('Badly formatted username');
      }
    } else {
      return Response.error('Badly formatted request');
    }
  }

  // async find(params?: Params): Promise<any> {
  //   try {
  //     const UserData = await super
  //       .find()
  //       .then((result: any) => {
  //         let finalData = {};
  //         finalData = result == null ? {} : result;
  //         return finalData;
  //       })
  //       .catch((error: any) => {
  //         return error;
  //       });
  //     if (isValidArray(UserData.data)) {
  //       return Response.success(UserData.data);
  //     } else {
  //       return Response.error(messages.common_messages_records_not_available);
  //     }
  //   } catch (error: any) {
  //     return Response.error(messages.common_messages_error);
  //   }
  // }

  // async get(id: string, params?: Params): Promise<any> {
  //   try {
  //     const UserData = await super
  //       .get(id)
  //       .then((result: any) => {
  //         let finalData = {};
  //         finalData = result == null ? {} : result;
  //         return finalData;
  //       })
  //       .catch((error: any) => {
  //         return error;
  //       });
  //     if (isValidObject(UserData) && !UserData.type) {
  //       return Response.success(UserData);
  //     } else {
  //       return Response.error(messages.common_messages_record_not_available);
  //     }
  //   } catch (error: any) {
  //     return Response.error(messages.common_messages_error);
  //   }
  // }
}
