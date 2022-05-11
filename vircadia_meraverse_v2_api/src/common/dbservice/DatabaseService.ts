//   Copyright 2020 Vircadia Contributors
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

'use strict';

import { Service } from 'feathers-mongodb';
import { Application } from '../../declarations';
import { HookContext, Paginated, Id, NullableId } from '@feathersjs/feathers';
import { DatabaseServiceOptions } from './DatabaseServiceOptions';
import { Db, Collection, Document, Filter } from 'mongodb';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../../utils/Misc';
import { VKeyedCollection } from '../../utils/vTypes';
import { messages } from '../../utils/messages';
import { BadRequest } from '@feathersjs/errors';
/**
 * Represet a DatabaseService
 * @public
 */
export class DatabaseService extends Service {
    /**
     * The Express application
     * @private
     */
    app?: Application;

    /**
     *
     */
    private db?: Db;

    /**
     *
     */
    private context?: HookContext;

    constructor(
        options: Partial<DatabaseServiceOptions>,
        app?: Application,
        context?: HookContext
    ) {
        super(options);
        this.app = app;
        this.context = context;
        this.loadDatabase();
    }

    async loadDatabase() {
        if (IsNotNullOrEmpty(this.app) && this.app) {
            this.db = await this.app.get('mongoClient');
        } else if (IsNotNullOrEmpty(this.context) && this.context) {
            this.db = await this.context.app.get('mongoClient');
        }
    }

    async getDatabase(): Promise<Db> {
        if (IsNullOrEmpty(this.db)) {
            await this.loadDatabase();
        }
        if (this.db) {
            return this.db;
        }
        throw new BadRequest(messages.common_messages_error);
    }

    async getService(tableName: string): Promise<Collection<Document>> {
        this.Model = await (await this.getDatabase()).collection(tableName);
        return this.Model;
    }

    async getData(tableName: string, id: Id): Promise<any> {
        await this.getService(tableName);
        return super.get(id);
    }

    async findData(
        tableName: string,
        filter?: Filter<any>
    ): Promise<Paginated<any>> {
        await this.getService(tableName);
        if (filter) {
            return (await super.find(filter)) as Paginated<any>;
        } else {
            return (await super.find()) as Paginated<any>;
        }
    }

    async findDataToArray(
        tableName: string,
        filter?: Filter<any>
    ): Promise<any[]> {
        await this.getService(tableName);
        const data = await this.findData(tableName, filter);
        if (data instanceof Array) {
            return data;
        } else {
            return data.data;
        }
    }

    async patchData(
        tableName: string,
        id: Id,
        data: VKeyedCollection
    ): Promise<any> {
        await this.getService(tableName);
        return await super.patch(id, data);
    }

    async patchMultipleData(
        tableName: string,
        id: NullableId,
        data: VKeyedCollection,
        filter: Filter<any>
    ): Promise<any> {
        await this.getService(tableName);
        return await super.patch(id, data, filter);
    }

    async deleteData(
        tableName: string,
        id: Id,
        filter?: Filter<any>
    ): Promise<any> {
        await this.getService(tableName);
        return await super.remove(id, filter);
    }

    async deleteMultipleData(
        tableName: string,
        filter: Filter<any>
    ): Promise<any> {
        await this.getService(tableName);
        return await super.remove(null, filter);
    }

    async createData(tableName: string, data: any): Promise<any> {
        await this.getService(tableName);
        return await super.create(data);
    }

    async createMultipleData(tableName: string, data: any[]): Promise<[any]> {
        await this.getService(tableName);
        return await super.create(data);
    }
}

