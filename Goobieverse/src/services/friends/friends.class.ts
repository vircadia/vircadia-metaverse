import {  MongoDBServiceOptions } from 'feathers-mongodb';
import { DatabaseService } from './../../dbservice/DatabaseService';
import { Application } from '../../declarations';
import config from '../../appconfig';
import { Response } from '../../utils/response'; 


export class Friends extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
        super(options, app);
        this.app = app;
    }

    async create(data: any, params?: any): Promise<any> {
        if (data && data.username) {
            const ParticularUserData: any = await this.findData(config.dbCollections.accounts, { query: { id: params.user.id } });
            if (ParticularUserData.data[0].connections.includes(data.username)) {
                const newParticularUserData = ParticularUserData.data[0];
                newParticularUserData.friends.push(data.username);
                await this.patchData(config.dbCollections.accounts, params.user.id,newParticularUserData);
            } else {
                return Response.error('cannot add friend who is not a connection');
            }
        } else {
            return Response.error('Badly formed request');
        }
    }

    async find(params?: any): Promise<any> {
        if (params.user.friends) {
            const friends = params.user.friends;
            return Promise.resolve({ friends });
        } else {
            throw new Error('No friend found');
        }
    }

    async remove(id: string, params?: any): Promise<any> {
        if (params.user.friends) {
            const ParticularUserData: any = await this.findData(config.dbCollections.accounts, { query: { id: params.user.id } });
            const friends = ParticularUserData.data[0].friends.filter(function (value:string) {
                return value !== id;
            });
            ParticularUserData.data[0].friends = friends; 
            const newParticularUserData = ParticularUserData.data[0];
            await this.patchData(config.dbCollections.accounts,params.user.id,newParticularUserData);
        } else {
            throw new Error('Not logged in');
        }
    }

}
