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

import { Params } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import config from '../../../appconfig';
import { IsNotNullOrEmpty } from '../../../utils/Misc';
import { NotFound } from '@feathersjs/errors';
import { messages } from './../../../utils/messages';
import { Id, NullableId } from '@feathersjs/feathers';

/**
 * StaticResource.
 * @noInheritDoc
 */
export class StaticResource extends DatabaseService {
    public docs: any;

    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    async create(data: any, params?: Params): Promise<any> {
        const oldResource = await this.findDataToArray(
            config.dbCollections.asset,
            {
                query: {
                    $select: ['id'],
                    url: data.url,
                },
            }
        );

        if ((oldResource as any).total > 0) {
            return this.patchMultipleData(
                config.dbCollections.asset,
                null,
                data,
                { query: { url: data.url } }
            );
        } else {
            return this.createData(config.dbCollections.asset, data);
        }
    }

    async find(params: Params): Promise<any> {
        if (params.query?.getAvatarThumbnails === true) {
            delete params.query.getAvatarThumbnails;
            const result = await this.findData(
                config.dbCollections.asset,
                params
            );
            for (const item of result.data) {
                const dataList = await this.findDataToArray(
                    config.dbCollections.asset,
                    {
                        query: {
                            name: item.name,
                            staticResourceType: 'user-thumbnail',
                        },
                    }
                );
                if (dataList.length > 0) {
                    item.thumbnail = dataList[0];
                }
            }
            return result;
        } else {
            return await this.findData(config.dbCollections.asset, params);
        }
    }

    async get(id: Id, params?: Params): Promise<any> {
        return await this.getData(config.dbCollections.asset, id);
    }

    async patch(id: NullableId, data: any, params?: Params): Promise<any> {
        if (IsNotNullOrEmpty(id) && id) {
            return await this.patchData(config.dbCollections.asset, id, data);
        } else {
            throw new NotFound(messages.common_messages_data_notfound);
        }
    }

    async remove(id: NullableId, params?: Params): Promise<any> {
        if (IsNotNullOrEmpty(id) && id) {
            return await this.deleteData(config.dbCollections.asset, id);
        } else {
            throw new NotFound(messages.common_messages_data_notfound);
        }
    }
}
