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

import { BadRequest } from '@feathersjs/errors';
import {
    AVATAR_FILE_ALLOWED_EXTENSIONS,
    MIN_AVATAR_FILE_SIZE,
    MAX_AVATAR_FILE_SIZE,
    MIN_THUMBNAIL_FILE_SIZE,
    MAX_THUMBNAIL_FILE_SIZE,
} from '../../utils/constants';
import { HookContext } from '@feathersjs/feathers';
import { messages } from '../../utils/messages';

export const validateGet = async (
    context: HookContext
): Promise<HookContext> => {
    const query = context.params.query;
    if (query) {
        switch (query.type) {
            case 'user-thumbnail':
                if (
                    query.fileSize < MIN_THUMBNAIL_FILE_SIZE ||
                    query.fileSize > MAX_THUMBNAIL_FILE_SIZE
                )
                    throw new BadRequest(
                        messages.common_messages_thumbnail_size_exceeded
                    );
                break;
            case 'avatar':
                if (
                    query.fileSize < MIN_AVATAR_FILE_SIZE ||
                    query.fileSize > MAX_AVATAR_FILE_SIZE
                )
                    throw new BadRequest(
                        messages.common_messages_avatar_size_exceeded
                    );

                const allowedExtenstions =
                    AVATAR_FILE_ALLOWED_EXTENSIONS.split(',');
                if (
                    !allowedExtenstions.includes(
                        query.fileName.substring(
                            query.fileName.lastIndexOf('.')
                        )
                    )
                )
                    throw new BadRequest(
                        messages.common_messages_avatar_invalid_file_type
                    );
                break;
            default:
                break;
        }
    }
    return context;
};

export const checkDefaultResources = async (
    context: HookContext
): Promise<HookContext> => {
    const q = context.params?.query?.keys || [];

    const defaultResources = await context.app.service('static-resource').find(
        {
            query: {
                key: {
                    $in: q,
                },
                userId: null,
            },
        },
        context.params
    );

    if (defaultResources.total > 0)
        // eslint-disable-next-line quotes
        throw new BadRequest(
            messages.common_messages_error_delete_default_resources
        );
    return context;
};

