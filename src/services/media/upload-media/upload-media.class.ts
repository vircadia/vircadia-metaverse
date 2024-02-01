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

import { Id, NullableId, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {}

interface ServiceOptions {}

/**
 * UploadMedia.
 * @noInheritDoc
 */
export class UploadMedia implements ServiceMethods<Data> {
    app: Application;
    options: ServiceOptions;

    constructor(options: ServiceOptions = {}, app: Application) {
        this.options = options;
        this.app = app;
    }

    async find(params: Params): Promise<any> {
        return [];
    }

    async get(id: Id, params: Params): Promise<Data> {
        return {};
    }

    async create(data: Data, params: Params): Promise<Data> {
        if (Array.isArray(data)) {
            return await Promise.all(
                data.map((current) => this.create(current, params))
            );
        }

        return data;
    }

    async update(id: NullableId, data: Data, params: Params): Promise<Data> {
        return data;
    }

    async patch(id: NullableId, data: Data, params: Params): Promise<Data> {
        return data;
    }

    async remove(id: NullableId, params: Params): Promise<Data> {
        return { id };
    }
}
