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

import { Hook, HookContext } from '@feathersjs/feathers';
import getBasicMimetype from '../../utils/get-basic-mimetype';

export default (): Hook => {
    return async (context: HookContext): Promise<HookContext> => {
        const { data, params } = context;
        const body = params.body || {};

        const resourceData = {
            name: data.name || body.name || context.params.file.originalname,
            description: data.description || body.description,
            url: data.uri || data.url,
            mimeType: data.mimeType || params.mimeType,
            metadata: data.metadata || body.metadata,
            staticResourceType: 'data',
            userId: data.userId || body.userId || params.userId || null,
        };
        resourceData.staticResourceType =
            data.type === 'user-thumbnail' || body.type === 'user-thumbnail'
                ? 'user-thumbnail'
                : getBasicMimetype(resourceData.mimeType);
        if (context.params.skipResourceCreation === true) {
            context.result = await context.app.service('static-resource').patch(
                context.params.patchId,
                {
                    url: resourceData.url,
                    metadata: resourceData.metadata,
                    staticResourceType: resourceData.staticResourceType,
                },
                params
            );
        } else {
            if (context.params.parentResourceId) {
                (resourceData as any).parentResourceId =
                    context.params.parentResourceId;
            }
            if (
                context.params.uuid &&
                context.params.parentResourceId == null
            ) {
                (resourceData as any).id = context.params.uuid;
            }

            if (resourceData.staticResourceType === 'user-thumbnail') {
                const existingThumbnails = await context.app
                    .service('static-resource')
                    .find(
                        {
                            query: {
                                userId: body.userId,
                                staticResourceType: 'user-thumbnail',
                            },
                        },
                        params
                    );

                await Promise.all(
                    existingThumbnails.data.map(async (item: any) => {
                        return context.app
                            .service('static-resource')
                            .remove(item.id, params);
                    })
                );
                (resourceData as any).userId = body.userId;
            }
            context.result = await context.app
                .service('static-resource')
                .create(resourceData, params);
        }

        return context;
    };
};
