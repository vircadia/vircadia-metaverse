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

import { DatabaseService } from './../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from './../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import config from '../../appconfig';
import { messages } from '../../utils/messages';
import { IsNotNullOrEmpty } from '../../utils/Misc';
import { VKeyedCollection } from '../../utils/vTypes';
import { getUtcDate } from '../../utils/Utils';
import { BadRequest } from '@feathersjs/errors';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';
import { buildPlaceInfo } from '../../common/responsebuilder/placesBuilder';

/**
 * Current.
 * @noInheritDoc
 */
export class Current extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * POST Current Place
     *
     * @remarks
     * This method is part of the POST current place
     * - Request Type - POST
     * - End Point - API_URL/current
     *
     * @requires current -placeId and current_api_key
     * @param requestBody - {"placeId": "","current_api_key": "","current_attendance": "","current_images": "","current_info": ""}
     * @returns - {status: 'success'} or { status: 'failure', message: 'message'}
     *
     */

    async create(data: any): Promise<any> {
        const placeData = await this.getData(
            config.dbCollections.places,
            data.placeId
        );
        if (
            IsNotNullOrEmpty(placeData) &&
            IsNotNullOrEmpty(placeData.currentAPIKeyTokenId)
        ) {
            const tokenData = await this.getData(
                config.dbCollections.tokens,
                placeData.currentAPIKeyTokenId
            );
            if (IsNotNullOrEmpty(tokenData.token)) {
                if (tokenData.token === data.current_api_key) {
                    const updates: VKeyedCollection = {};
                    if (IsNotNullOrEmpty(data.current_attendance)) {
                        updates.current_attendance = data.current_attendance;
                    }
                    if (IsNotNullOrEmpty(data.current_images)) {
                        updates.current_images = data.current_images;
                    }
                    if (IsNotNullOrEmpty(data.current_info)) {
                        updates.current_info = data.current_info;
                    }
                    updates.currentLastUpdateTime = getUtcDate();
                    const result = await this.patchData(
                        config.dbCollections.places,
                        data.placeId,
                        updates
                    );
                    const placeResult = await buildPlaceInfo(this, result);
                    return Promise.resolve(buildSimpleResponse(placeResult));
                } else {
                    throw new BadRequest(
                        messages.common_messages_current_api_key_not_match_place_key
                    );
                }
            } else {
                throw new BadRequest(
                    messages.common_messages_place_apikey_lookup_fail
                );
            }
        } else {
            throw new BadRequest(messages.common_messages_no_place_by_placeId);
        }
    }
}
