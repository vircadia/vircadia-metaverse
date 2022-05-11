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
import { buildSimpleResponse } from '../../../common/responsebuilder/responseBuilder';
import { BadRequest } from '@feathersjs/errors';

import {
    uploadAvatarStaticResource,
    getAvatarFromStaticResources,
    AvatarUploadArguments,
} from './avatar-helper';
import { messages } from '../../../utils/messages';

/**
 * Avatar.
 * @noInheritDoc
 */
export class Avatar extends DatabaseService {
    application: Application;

    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
        this.application = app;
    }

    /**
     * Returns the Avatar
     *
     * @remarks
     * This method is part of the get Avatar
     * - Request Type - GET
     * - End Point - API_URL/avatar/{avatarName}
     *
     * @param avatarName - Avatar name (Url param)
     * @returns - {"status": "success", "data":{ "avatarId":"","avatarURL":"","thumbnailURL":""}}
     *
     */
    async get(name: string, params: Params): Promise<any> {
        const result = (
            await getAvatarFromStaticResources(this.application, name)
        )[0];
        if (result) {
            return Promise.resolve(buildSimpleResponse(result));
        } else {
            throw new BadRequest(messages.common_messages_avatar_not_available);
        }
    }

    /**
     * Returns the Avatar list
     *
     * @remarks
     * This method is part of the get Avatar list
     * - Request Type - GET
     * - End Point - API_URL/avatar
     *
     * @returns - {"status": "success", "data":[{ "avatarId":"","avatarURL":"","thumbnailURL":""}]}
     *
     */
    async find(params: Params): Promise<any> {
        const result = await getAvatarFromStaticResources(this.application);
        return Promise.resolve(buildSimpleResponse(result));
    }

    /**
     * Create Avatar
     *
     * @remarks
     * This method is part of the get Avatar list
     * - Request Type - POST
     * - End Point - API_URL/avatar
     * @param userId - user id
     * @param isPublicAvatar - boolean (true or false)
     * @param avatarName - avatar Name
     * @param avatar: buffer
     * @param thumbnail: buffer
     * @returns - { "avatarURL": "https://digisomni-frankfurt-1.eu-central-1.linodeobjects.com/digisomni-frankfurt-1/avatars/21da78db-6ed6-495a-ae95-b0f67619e1f1/newAvatar1234.glb","thumbnailURL": "https://digisomni-frankfurt-1.eu-central-1.linodeobjects.com/digisomni-frankfurt-1/avatars/21da78db-6ed6-495a-ae95-b0f67619e1f1/newAvatar1234.png"}
     *
     */
    async create(data: AvatarUploadArguments, params?: Params) {
        return uploadAvatarStaticResource(this.application, data, params);
    }
}
