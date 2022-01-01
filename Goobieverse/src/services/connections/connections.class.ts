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
      const ParticularUserData: any = await this.findData(config.dbCollections.accounts, { query: { id: params.user.id } });
      const newParticularUserData = ParticularUserData.data[0];
      newParticularUserData.connections.push(data.username);
      const addUserData = await this.UpdateDataById(config.dbCollections.accounts,newParticularUserData, params.user.id);
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
