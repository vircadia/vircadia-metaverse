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
import hooks from './upload-media.hooks';
import express from 'express';
import multer from 'multer';
import { useStorageProvider } from '../storageprovider/storageprovider';
import blobService from 'feathers-blob';
import { v1 as uuidv1 } from 'uuid';
import dauria from 'dauria';
import config from '../../../appconfig';
const multipartMiddleware = multer();

declare module '../../../declarations' {
    interface ServiceTypes {
        media: any;
    }
}

export default (app: Application): void => {
    const provider = useStorageProvider();

    /**
     * Initialize our service with any options it requires and docs
     *
     */
    app.use(
        '/media',
        multipartMiddleware.fields([{ name: 'media' }, { name: 'thumbnail' }]),
        (
            req: any,
            res: any,
            next: any
        ) => {
            if (req?.feathers && req.method !== 'GET') {
                req.feathers.file = (req as any).files.media
                    ? (req as any).files.media[0]
                    : null;
                req.feathers.body = (req as any).body;
                req.feathers.body.fileId = req.feathers.body.fileId ?? uuidv1();
                req.feathers.mimeType = req.feathers.file.mimetype;
                req.feathers.storageProvider = provider;
                req.feathers.thumbnail = (req as any).files.thumbnail
                    ? (req as any).files.thumbnail[0]
                    : null;
                req.feathers.uploadPath =
                    req.feathers.body.uploadPath ?? req.feathers.body.fileId;
                if (req.feathers.body.name)
                    req.feathers.id = req.feathers.body.name;
            }
            next();
        },
        blobService({ Model: provider.getStorage() }),
        async (
            req: any,
            res: any,
            next: any
        ) => {
            // Only returns jpeg format image i.e. the ones uploaded to server.
            if (
                req.method === 'GET' &&
                config.server.storageProvider !== 'aws' &&
                res.data.id &&
                res.data.id.split('.')[1] === 'jpeg'
            ) {
                // Parse data uri 'Base64' to 'Buffer/Binary data'
                const { buffer } = dauria.parseDataURI(res.data.uri);
                res.setHeader('Content-Type', 'image/jpeg'); // Set content-type header to image for client
                res.write(buffer, 'binary');
                res.end(null, 'binary');
            } else {
                next();
            }
        }
    );

    const service = app.service('media');

    (service as any).hooks(hooks);
};
