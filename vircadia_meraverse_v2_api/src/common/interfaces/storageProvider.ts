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

import { FileContentType } from './FileContentType';

export interface StorageObjectInterface {
    Key?: string;
    Body: Buffer;
    ContentType: string;
}

export interface StorageListObjectInterface {
    Prefix?: string;
    IsTruncated?: boolean;
    NextContinuationToken?: string;
    Contents: { Key: string }[];
    CommonPrefixes?: { Prefix: string }[];
}

export interface SignedURLResponse {
    fields: {
        [key: string]: string;
    };
    url: string;
    local: boolean;
    cacheDomain: string;
}

export interface BlobStore {
    path: string;

    cache: any;

    createWriteStream(
        options: string | { key: string },
        cb?: (err: any, result: any) => void
    ): void;

    createReadStream(key: string | { key: string }, options?: any): void;

    exists(
        options: string | { key: string },
        cb?: (err: any, result: any) => void
    ): void;

    remove(
        options: string | { key: string },
        cb?: (err: any, result: any) => void
    ): void;
}

export interface StorageProviderInterface {
    cacheDomain: string;

    /**
     * Checks if an object exists
     * @param key
     * @returns {Promise<null>}
     * @throws {Error}
     *
     */
    checkObjectExistence(key: string): Promise<any>;

    /**
     * Gets the object
     * @param key
     * @returns {StorageObjectInterface}
     */
    getObject(key: string): Promise<StorageObjectInterface>;

    /**
     * Gets the provider
     * @returns {StorageProviderInterface}
     */
    getProvider(): StorageProviderInterface;

    /**
     *
     * @param key
     * @param expiresAfter
     * @param conditions
     * @returns {SignedURLResponse}
     */
    getSignedUrl(
        key: string,
        expiresAfter: number,
        conditions: any
    ): Promise<SignedURLResponse>;

    /**
     * @returns {any} Blob store
     */
    getStorage(): BlobStore;

    /**
     * Get a list of keys under a path
     * @param prefix
     * @param results
     * @param recursive
     * @param continuationToken
     * @returns {Promise<StorageListObjectInterface>}
     */
    listObjects(
        prefix: string,
        results: any,
        recursive?: boolean,
        continuationToken?: string
    ): Promise<StorageListObjectInterface>;

    /**
     * Puts an object into the store
     * @param object
     * @returns {any}
     */
    putObject(object: StorageObjectInterface): Promise<any>;

    /**
     * Deletes resources in the store
     * @param keys
     */
    deleteResources(keys: string[]): Promise<any>;

    /**
     * Invalidates items in the store
     * @param invalidationItems list of keys
     */
    createInvalidation(invalidationItems: string[]): Promise<any>;

    /**
     * List all the files/folders in the directory
     * @param folderName
     */
    listFolderContent(
        folderName: string,
        recursive?: boolean
    ): Promise<FileContentType[]>;

    /**
     * Moves a directory
     * @param current
     * @param destination
     * @param isCopy
     * @param isRename
     */
    moveObject(
        current: string,
        destination: string,
        isCopy?: boolean,
        isRename?: string
    ): Promise<any>;
}
