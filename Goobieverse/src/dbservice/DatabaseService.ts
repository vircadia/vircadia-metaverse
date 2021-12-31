import { Service } from 'feathers-mongodb';
import { Application } from '../declarations';
import { DatabaseServiceOptions } from './DatabaseServiceOptions';
import { Db, Collection, Document, FindCursor, WithId, DeleteResult } from 'mongodb';
import { IsNullOrEmpty } from '../utils/Misc';
 

export class DatabaseService extends Service {
  app: Application;
  db?:Db;
  
  constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
    super(options);
    this.app = app;
    this.loadDatabase();
  }

  async loadDatabase() {
    this.db = await this.app.get('mongoClient');
  }

  async getDatabase(): Promise<Db>  {
    if(IsNullOrEmpty(this.db)){
      await this.loadDatabase();
    }
    return this.db!;
  }

  async getService(tableName:string):Promise<Collection<Document>>{
    return await (await this.getDatabase()).collection(tableName);
  }

  async findData(tableName: string, filter?:Document ): Promise<FindCursor<WithId<any>>>{
    if(IsNullOrEmpty(filter)){
      return await (await (this.getService(tableName))).find(filter!);
    }else{
      return await (await (this.getService(tableName))).find();
    }
  }

  async findDataAsArray(tableName: string, filter?:Document): Promise<any[]> {
    return (await this.findData(tableName,filter)).toArray();
  }

}