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
import { AvatarProps } from '../../../common/interfaces/AvatarInterface';
import { CommonKnownContentTypes } from '../../../utils/CommonKnownContentTypes';
import fs from 'fs';
import path from 'path';
import { addGenericAssetToS3AndStaticResources } from '../../media/upload-media/upload-asset.service';

export type AvatarUploadArguments = {
    avatar: Buffer;
    thumbnail: Buffer;
    avatarName: string;
    isPublicAvatar?: boolean;
    userId?: string;
};

export const installAvatarsFromProject = async (
    app: Application,
    avatarsFolder: string
) => {
    const avatarsToInstall = fs
        .readdirSync(avatarsFolder, { withFileTypes: true })
        .filter((dirent) => dirent.name.split('.').pop() === 'glb')
        .map((dirent) => {
            const avatarName = dirent.name.replace(/\..+$/, ''); // remove extension
            const thumbnail = fs.existsSync(
                path.join(avatarsFolder, avatarName + '.png')
            )
                ? fs.readFileSync(path.join(avatarsFolder, avatarName + '.png'))
                : Buffer.from([]);
            return {
                avatar: fs.readFileSync(path.join(avatarsFolder, dirent.name)),
                thumbnail,
                avatarName,
                isPublicAvatar: true,
            };
        });
    const promises: Promise<any>[] = [];
    for (const avatar of avatarsToInstall) {
        promises.push(uploadAvatarStaticResource(app, avatar));
    }
    await Promise.all(promises);
};

export const uploadAvatarStaticResource = async (
    app: Application,
    data: AvatarUploadArguments,
    params?: Params
) => {
    const key = `avatars/${data.userId ?? 'public'}/${data.avatarName}`;

    const name =
        data.avatarName ?? 'Avatar-' + Math.round(Math.random() * 10000);

    // const modelPromise = addGenericAssetToS3AndStaticResources(
    //     app,
    //     data.avatar,
    //     {
    //         userId: data.userId,
    //         key: `${key}.glb`,
    //         staticResourceType: 'avatar',
    //         contentType: CommonKnownContentTypes.glb,
    //         name,
    //     }
    // );

    const thumbnailPromise = addGenericAssetToS3AndStaticResources(
        app,
        data.thumbnail,
        {
            userId: data.userId,
            key: `${key}.png`,
            staticResourceType: 'user-thumbnail',
            contentType: CommonKnownContentTypes.png,
            name,
        }
    );

    const [thumbnailURL] = await Promise.all([
        // modelPromise,
        thumbnailPromise,
    ]);

    //console.log('Successfully uploaded avatar!', avatarURL);

    return {
        // avatarURL,
        thumbnailURL,
    };
};

export const getAvatarFromStaticResources = async (
    app: Application,
    name?: string
) => {
    const nameQuery = name ? { name } : {};
    const avatarQueryResult = await app.service('static-resource').find({
        paginate: false,
        query: {
            $select: ['id', 'name', 'url', 'staticResourceType'],
            ...nameQuery,
            staticResourceType: {
                $in: ['user-thumbnail', 'avatar'],
            },
        },
        isInternal: true,
    });
    const avatars = avatarQueryResult.reduce((acc: any, curr: any) => {
        const val = acc[curr.name];
        const key =
            curr.staticResourceType === 'avatar' ? 'avatarURL' : 'thumbnailURL';
        return {
            ...acc,
            [curr.name]: {
                ...val,
                avatarId: curr.name,
                [key]: curr.url,
            },
        };
    }, {});
    return Object.values(avatars) as AvatarProps[];
};
