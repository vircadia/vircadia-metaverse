import { Service } from 'feathers-mongodb';
import { Application } from '../declarations';
import { HookContext, Paginated, } from '@feathersjs/feathers';
import { DatabaseServiceOptions } from './DatabaseServiceOptions';
import { Db, Collection, Document, FindCursor, WithId,Filter } from 'mongodb';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../utils/Misc';
import { AccountModel } from '../interfaces/AccountModel';
 

export class DatabaseService extends Service {
  app?: Application;
  db?:Db;
  context?:HookContext;
  constructor(options: Partial<DatabaseServiceOptions>,app?: Application,context?: HookContext) {
    super(options);
    this.app = app;
    this.context = context;
    this.loadDatabase();
  }

  
  async loadDatabase() {
    if(IsNotNullOrEmpty(this.app) && this.app){
      this.db = await this.app.get('mongoClient');
    }else if(IsNotNullOrEmpty(this.context) && this.context){
      this.db = await this.context.app.get('mongoClient');
    }
  }

  async getDatabase(): Promise<Db>  {
    if(IsNullOrEmpty(this.db)){
      await this.loadDatabase();
    }
    return this.db!;
  }

  async getService(tableName:string):Promise<Collection<Document>>{
    this.Model = await (await this.getDatabase()).collection(tableName);
    return this.Model;
  }

  async findData(tableName: string, filter?:Filter<any> ): Promise<Paginated<any> | any[]>{
    await (this.getService(tableName));
    if(IsNotNullOrEmpty(filter)){
      console.log(filter);
      return await super.find(filter!);
    } else {
      return await super.find();
    }
  }

  async findDataToArray(tableName: string, filter?:Filter<any> ): Promise<any[]>{
    await (this.getService(tableName));
    const data = await this.findData(tableName,filter);
    if(data instanceof Array){
      return data;
    }else{
      return data.data;
    }
  }

  async CreateData(tableName: string, data:any): Promise<any> {
    await (this.getService(tableName));
    return await super.create(data);
  }

  async UpdateDataById(tableName: string, data:any,id:any): Promise<any> {
    await (this.getService(tableName));
    return await super.update(id, data); 
  }

}