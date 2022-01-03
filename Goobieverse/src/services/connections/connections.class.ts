import {  MongoDBServiceOptions } from 'feathers-mongodb';
import { DatabaseService } from './../../dbservice/DatabaseService';
import { Application } from '../../declarations';
import config from '../../appconfig';
import { Response } from '../../utils/response';
import { isValidObject } from '../../utils/Misc';

export class Connections extends DatabaseService {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options, app);
    this.app = app;
  }
  
  async create(data: any, params?: any): Promise<any> {
    if (data && data.username) {
      const userData: any = await this.getData(config.dbCollections.accounts,  params.user.id);
      
      userData.connections.push(data.username);
      const addUserData = await this.patchData(config.dbCollections.accounts,params.user.id,userData);
      if (isValidObject(addUserData)) {
        return Promise.resolve({}); 
      } else {
        return Response.error('cannot add connections this way');
      }
    } else {
      return Response.error('Badly formed request');
    }
  }


}
