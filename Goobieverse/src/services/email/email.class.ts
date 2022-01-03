import { Db } from 'mongodb';
import { DatabaseService } from './../../dbservice/DatabaseService';
import { DatabaseServiceOptions } from './../../dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import config from '../../appconfig';
export class Email extends DatabaseService {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
    super(options,app);
    this.getService(config.dbCollections.email);
  }
}
