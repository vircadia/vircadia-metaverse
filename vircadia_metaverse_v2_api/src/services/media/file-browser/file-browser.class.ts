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

import { Application } from '../../../declarations';
import { StorageProviderInterface } from '../../../common/interfaces/storageProvider';
import { FileContentType } from '../../../common/interfaces/FileContentType';
import { getCachedAsset } from '../storageprovider/getCachedAsset';
import { useStorageProvider } from '../storageprovider/storageprovider';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { NotImplemented } from '@feathersjs/errors';

interface PatchParams {
    body: Buffer;
    contentType: string;
}

/**
 * FileBrowserService.
 * @noInheritDoc
 */

export class FileBrowserService extends DatabaseService {
    store: StorageProviderInterface;

    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
        this.store = useStorageProvider();
    }

    find(): Promise<any> {
        return Promise.resolve();
    }

    /**
     * Return the metadata for each file in a directory
     * @param id
     * @param params
     * @returns
     */
    async get(directory: string): Promise<FileContentType[]> {
        if (directory.substr(0, 1) === '/') directory = directory.slice(1); // remove leading slash
        const result = await this.store.listFolderContent(directory);
        return result;
    }

    /**
     * Create a directory
     * @param directory
     * @param params
     * @returns
     */
    async create(directory: any) {
        if (directory.substr(0, 1) === '/') directory = directory.slice(1); // remove leading slash
        return this.store.putObject({
            Key: directory + '/',
            Body: Buffer.alloc(0),
            ContentType: 'application/x-empty',
        });
    }

    /**
     * Move content from one path to another
     * @param id
     * @param data
     * @param params
     * @returns
     */
    async update(from: string, data: any) {
        // TODO
        throw new NotImplemented(
            '[File Browser]: Temporarily disabled for instability. - TODO'
        );
        return this.store.moveObject(
            from,
            data.destination,
            data.isCopy,
            data.renameTo
        );
    }

    /**
     * Upload file
     * @param id
     * @param data
     * @param params
     */
    async patch(path: string, data: PatchParams) {
        await this.store.putObject({
            Key: path,
            Body: data.body,
            ContentType: data.contentType,
        });
        return getCachedAsset(path, this.store.cacheDomain);
    }

    /**
     * Remove a directory
     * @param id
     * @param params
     * @returns
     */
    async remove(path: string) {
        const dirs = await this.store.listObjects(path + '/', [], true);
        return await this.store.deleteResources([
            path,
            ...dirs.Contents.map((a) => a.Key),
        ]);
    }
}
