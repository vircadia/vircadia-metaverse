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
import multer from 'multer';
import { Params } from '@feathersjs/feathers';
import hooks from './upload-asset.hooks';
import express from 'express';
import { AdminAssetUploadArgumentsType } from '../../../common/interfaces/UploadAssetInterface';
import { useStorageProvider } from '../storageprovider/storageprovider';
import { getCachedAsset } from '../storageprovider/getCachedAsset';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
import { isAdmin } from '../../../utils/Utils';
import { messages } from '../../../utils/messages';
import { BadRequest } from '@feathersjs/errors';

const multipartMiddleware = multer({ limits: { fieldSize: Infinity } });

declare module '../../../declarations' {
    interface ServiceTypes {
        'upload-asset': any;
    }
}

export const addGenericAssetToS3AndStaticResources = async (
    app: Application,
    file: Buffer,
    args: AdminAssetUploadArgumentsType,
    params?: Params
) => {
    const provider = useStorageProvider();
    // make userId optional and safe for feathers create
    const userIdQuery = args.userId ? { userId: args.userId } : {};

    const existingAsset = await app.service('static-resource').find({
        query: {
            staticResourceType: args.staticResourceType,
            // safely spread conditional params so we can query by name if it is given, otherwise fall back to key
            ...(args.name ? { name: args.name } : { key: args.key }),
            ...userIdQuery,
        },
        params,
    });

    const promises: Promise<any>[] = [];

    // upload asset to storage provider
    promises.push(
        new Promise<void>(async (resolve) => {
            await provider.createInvalidation([args.key]);
            await provider.putObject({
                Key: args.key,
                Body: file,
                ContentType: args.contentType,
            });
            resolve();
        })
    );

    // add asset to static resources
    const assetURL = getCachedAsset(args.key, provider.cacheDomain);

    if (existingAsset.data.length) {
        promises.push(provider.deleteResources([existingAsset.data[0].id]));

        promises.push(
            app.service('static-resource').patch(
                existingAsset.data[0].id,
                {
                    url: assetURL,
                    key: args.key,
                },
                params
            )
        );
    } else {
        promises.push(
            app.service('static-resource').create(
                {
                    name: args.name ?? null,
                    mimeType: args.contentType,
                    url: assetURL,
                    key: args.key,
                    staticResourceType: args.staticResourceType,
                    storageProvider: provider.constructor.name,
                    ...userIdQuery,
                },
                params
            )
        );
    }

    await Promise.all(promises);
    return assetURL;
};

/**
 * Upload asset
 *
 * @remarks
 * This method is part of the Upload asset
 * Request Type - POST
 * End Point - API_URL/upload-asset
 * Request Type - form-data
 *
 * If type is user-avatar-upload
 *
 * @param type - (user-avatar-upload)
 * @param isPublicAvatar - boolean (true or false)
 * @param avatarName - avatar Name
 * @param files - attach 2 file first is GLB and second is thumbnail png
 *
 * @returns - { "avatarURL": "https://digisomni-frankfurt-1.eu-central-1.linodeobjects.com/digisomni-frankfurt-1/avatars/21da78db-6ed6-495a-ae95-b0f67619e1f1/newAvatar1234.glb","thumbnailURL": "https://digisomni-frankfurt-1.eu-central-1.linodeobjects.com/digisomni-frankfurt-1/avatars/21da78db-6ed6-495a-ae95-b0f67619e1f1/newAvatar1234.png"}
 *
 *
 * If type is admin-file-upload
 *
 * @param type - (admin-file-upload)
 * @param files - list of files
 * @param args - string format files info json array  ([{"key":"nft","contentType":"model/gltf-binary","staticResourceType":"3dobject","userId":"uuid","name":"gun"}]) name and userId is optional
 *
 * @returns - ["https://digisomni-frankfurt-1.eu-central-1.linodeobjects.com/digisomni-frankfurt-1/avatars/21da78db-6ed6-495a-ae95-b0f67619e1f1/newAvatar1234.glb","thumbnailURL": "https://digisomni-frankfurt-1.eu-central-1.linodeobjects.com/digisomni-frankfurt-1/gun"]
 *
 */

export default (app: Application): void => {
    app.use(
        'upload-asset',
        multipartMiddleware.any(),
        //multipartMiddleware.fields([{ name: 'media' }]),
        (   
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            if (req?.feathers && req.method !== 'GET') {
                req.feathers.files = (req as any).files.media
                    ? (req as any).files.media
                    : (req as any).files;
                req.feathers.args = (req as any).args;
            }
            next();
        },
        {
            create: async (data: any, params?: Params) => {
                if (params?.files && params?.files?.length > 0) {
                    if (data.type === 'user-avatar-upload') {
                        return await app.service('avatar').create(
                            {
                                // avatar: params.files[0].buffer,
                                thumbnail: params.files[0].buffer,
                                ...data,
                            },
                            params
                        );
                    } else if (data.type === 'admin-file-upload') {
                        const loginUser = extractLoggedInUserFromParams(params);
                        if (!(await isAdmin(loginUser))) return;
                        const args = JSON.parse(data.args);
                        return Promise.all(
                            params.files.map(
                                (file: any, i: any) =>
                                    addGenericAssetToS3AndStaticResources(
                                        app,
                                        file.buffer,
                                        args[i]
                                    ),
                                params
                            )
                        );
                    }
                } else {
                    throw new BadRequest(
                        messages.common_messages_asset_file_missing
                    );
                }
            },
        }
    );
    const service = app.service('upload-asset');
    (service as any).hooks(hooks);
};
