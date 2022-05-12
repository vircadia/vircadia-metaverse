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

import appRootPath from 'app-root-path';
import config from '../../../appconfig';
import fs from 'fs';
import fsStore from 'fs-blob-store';
import glob from 'glob';
import path from 'path';
import {
    BlobStore,
    StorageListObjectInterface,
    StorageObjectInterface,
    StorageProviderInterface,
} from '../../../common/interfaces/storageProvider';
import { FileContentType } from '../../../common/interfaces/FileContentType';
import { getContentType } from '../../../utils/fileUtils';
import { Conflict, NotAcceptable } from '@feathersjs/errors';

export class LocalStorage implements StorageProviderInterface {
    path = './upload';
    cacheDomain = config.server.localStorageProvider;
    _store = fsStore(path.join(appRootPath.path, this.path));

    constructor() {
        // make upload folder if it doesnt already exist
        if (!fs.existsSync(path.join(appRootPath.path, 'upload')))
            fs.mkdirSync(path.join(appRootPath.path, 'upload'));
    }

    getObject = async (key: string): Promise<StorageObjectInterface> => {
        const filePath = path.join(appRootPath.path, this.path, key);
        const result = await fs.promises.readFile(filePath);
        return {
            Body: result,
            ContentType: getContentType(filePath),
        };
    };

    listObjects = async (
        prefix: string,
        results: any[],
        recursive = false,
        continuationToken: string
    ): Promise<StorageListObjectInterface> => {
        const filePath = path.join(appRootPath.path, this.path, prefix);
        if (!fs.existsSync(filePath)) return { Contents: [] };
        const globResult = glob.sync(path.join(filePath, '**/*.*'));
        return {
            Contents: globResult.map((result: any) => {
                return {
                    Key: result.replace(
                        path.join(appRootPath.path, this.path),
                        ''
                    ),
                };
            }),
        };
    };

    putObject = async (params: StorageObjectInterface): Promise<any> => {
        const filePath = path.join(
            appRootPath.path,
            this.path,
            params.Key || ''
        );
        const pathWithoutFile = path.dirname(filePath);
        if (filePath.substr(-1) === '/') {
            if (!fs.existsSync(filePath)) {
                await fs.promises.mkdir(filePath, { recursive: true });
                return true;
            }
            return false;
        }
        if (pathWithoutFile == null)
            throw new NotAcceptable('Invalid file path in local putObject');
        const pathWithoutFileExists = fs.existsSync(pathWithoutFile);
        if (!pathWithoutFileExists)
            await fs.promises.mkdir(pathWithoutFile, { recursive: true });
        return fs.promises.writeFile(filePath, params.Body);
    };

    createInvalidation = async (): Promise<any> => Promise.resolve();

    getProvider = (): StorageProviderInterface => this;
    getStorage = (): BlobStore => this._store;

    checkObjectExistence = (key: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            const filePath = path.join(appRootPath.path, this.path, key);
            const exists = fs.existsSync(filePath);
            if (exists) reject(new Conflict('Object already exists'));
            else resolve(null);
        });
    };

    getSignedUrl = (
        key: string,
        expiresAfter: number,
        conditions: any
    ): any => {
        return {
            fields: {
                Key: key,
            },
            url: `https://${this.cacheDomain}`,
            local: true,
            cacheDomain: this.cacheDomain,
        };
    };

    deleteResources(keys: string[]): Promise<any> {
        //Currently Not able to delete dir
        const blobs = this.getStorage();

        return Promise.all(
            keys.map((key) => {
                return new Promise((resolve) => {
                    blobs.exists(key, (err: any, exists: any) => {
                        if (err) {
                            console.error(err);
                            resolve(false);
                            return;
                        }
                        if (exists) {
                            blobs.remove(key, (err: any) => {
                                if (err) {
                                    console.error(err);
                                    resolve(false);
                                    return;
                                }
                                resolve(true);
                            });
                        } else {
                            resolve(true);
                        }
                    });
                });
            })
        );
    }

    listFolderContent = async (folderName: string): Promise<any> => {
        const filePath = path.join(appRootPath.path, this.path, folderName);
        const files = glob
            .sync(path.join(filePath, '*.*'))
            .map((result: any) => {
                const key = result.replace(
                    path.join(appRootPath.path, this.path),
                    ''
                );
                const regexx = /(?:.*)\/(?<name>.*)\.(?<extension>.*)/g;
                const query = regexx.exec(key);
                const signedUrl = this.getSignedUrl(key, 3600, null);
                const url = signedUrl.url + signedUrl.fields.Key;
                const res: FileContentType = {
                    key,
                    name: query?.groups?.name || '',
                    type: query?.groups?.extension || '',
                    url,
                };
                return res;
            });
        const folder = glob
            .sync(path.join(filePath, '*/'))
            .map((result: any) => {
                const key = result.replace(
                    path.join(appRootPath.path, this.path),
                    ''
                );
                const name = key.replace(`${folderName}`, '').split('/')[0];
                const url = this.getSignedUrl(key, 3600, null).url;
                const res: FileContentType = {
                    key,
                    name,
                    type: 'folder',
                    url,
                };
                return res;
            });
        files.push(...folder);
        return files;
    };

    moveObject = async (
        current: string,
        destination: string,
        isCopy = false,
        renameTo?: string
    ): Promise<boolean> => {
        const contentpath = path.join(appRootPath.path, this.path);
        let fileName = renameTo != null ? renameTo : path.basename(current);
        let fileCount = 1;
        const file = fileName.split('.');
        current = path.join(contentpath, current);
        destination = path.join(contentpath, destination);
        while (fs.existsSync(path.join(destination, fileName))) {
            fileName = '';
            for (let i = 0; i < file.length - 1; i++) fileName += file[i];
            fileName = `${fileName}(${fileCount}).${file[file.length - 1]}`;
            fileCount++;
        }
        try {
            if (isCopy === true) {
                await fs.promises.copyFile(
                    current,
                    path.join(destination, fileName)
                );
            } else {
                await fs.promises.rename(
                    current,
                    path.join(destination, fileName)
                );
            }
        } catch (err) {
            return false;
        }
        return true;
    };
}
export default LocalStorage;
