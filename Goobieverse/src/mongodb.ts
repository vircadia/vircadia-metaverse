import { MongoClient } from 'mongodb';
import { Application } from './declarations';
import { IsNotNullOrEmpty } from './utils/Misc';
export default function (app: Application): void {
    let connection = '';
    if(IsNotNullOrEmpty(process.env.DATABASE_URL)){
        connection = process.env.DATABASE_URL || '';
    }else{
        const userSpec = `${process.env.DB_USER}:${process.env.DB_PASSWORD}`;
        const hostSpec = `${process.env.DB_HOST}:${process.env.DB_PORT}`;
        let optionsSpec = '';
        if (process.env.DB_AUTHDB !== 'admin') {
            optionsSpec += `?authSource=${process.env.DB_AUTHDB}`;
        }
        connection = `mongodb://${userSpec}@${hostSpec}/${optionsSpec}`;
    }
    const database = process.env.DB_NAME;
    const mongoClient = MongoClient.connect(connection).then(client => client.db(database));
    app.set('mongoClient', mongoClient);
}
