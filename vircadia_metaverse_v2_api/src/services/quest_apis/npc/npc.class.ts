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
import { Id, NullableId, Params } from '@feathersjs/feathers';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../../declarations';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../../../utils/Misc';
import { getUtcDate } from '../../../utils/Utils';
import config from '../../../appconfig';
import {
    buildSimpleResponse,
    buildPaginationResponse,
} from '../../../common/responsebuilder/responseBuilder';
import { buildNpcInfo } from '../../../common/responsebuilder/npcBuilder';
import { messages } from '../../../utils/messages';
import { BadRequest } from '@feathersjs/errors';
import { NpcInterface } from './../../../common/interfaces/npcInterface';

export class Npc extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Npc Item
     *
     * @remarks
     * This method is part of the Create Npc
     * - Request Type - POST
     * - Access - Admin
     * - End Point - API_URL/npc
     *
     * @requires - authentication
     * @param requestBody - {
     *               "id": "gy-gyc-bob-shop",
     *               "name": "Bob",
     *               "type": "shopkeeper",
     *               "description": "I give quests and sell wares.",
     *               "idleText": [
     *                   "Hmph, where did I put that fork?",
     *                   "I really wish it would rain.",
     *                   "I do love butterflies."
     *               ],
     *               "interactiveText": [],
     *               "tags": {
     *                   "questId": "gy-gyc-bob-shop-fetch-sticks"
     *               }
     *           }
     * @returns - {
     *              status: 'success',
     *              data:{
     *               "id": "gy-gyc-bob-shop",
     *               "name": "Bob",
     *               "type": "shopkeeper",
     *               "description": "I give quests and sell wares.",
     *               "idleText": [
     *                   "Hmph, where did I put that fork?",
     *                   "I really wish it would rain.",
     *                   "I do love butterflies."
     *               ],
     *               "interactiveText": [],
     *               "tags": {
     *                   "questId": "gy-gyc-bob-shop-fetch-sticks"
     *               }
     *           }  or  { status: 'failure', message: 'message'}
     *
     */
    async create(data: any): Promise<any> {
        const ncpList = await this.findDataToArray(config.dbCollections.npc, {
            query: { $limit: 1, id: data.id },
        });

        if (ncpList.length > 0) {
            throw new BadRequest(messages.common_messages_npc_id_already_exist);
        }

        data.createdAt = getUtcDate();
        data.updatedAt = getUtcDate();
        try {
            if (
                IsNotNullOrEmpty(data.npcTags?.questId) &&
                IsNullOrEmpty(
                    await super.getData(
                        config.dbCollections.questItem,
                        data.npcTags.questId
                    )
                )
            ) {
                throw new BadRequest(
                    messages.common_messages_quest_item_not_found
                );
            }
        } catch (e) {
            throw new BadRequest(messages.common_messages_quest_item_not_found);
        }

        const result = await this.createData(config.dbCollections.npc, data);
        return Promise.resolve(buildSimpleResponse(buildNpcInfo(result)));
    }

    /**
     * Edit Ncp
     *
     * @remarks
     * This method is part of the edit Ncp
     * - Request Type - PATCH
     * - Access - Admin
     * - End Point - API_URL/ncp/{:ncpId}
     *
     * @requires - authentication
     * @requires @param ncpId - pass ncpId as a url param
     * @param requestBody - {
     *               "name": "Bob",
     *               "type": "shopkeeper",
     *               "description": "I give quests and sell wares.",
     *               "idleText": [
     *                   "Hmph, where did I put that fork?",
     *                   "I really wish it would rain.",
     *                   "I do love butterflies."
     *               ],
     *               "interactiveText": [],
     *               "tags": {
     *                   "questId": "gy-gyc-bob-shop-fetch-sticks"
     *               }
     *           }
     * @returns - {
     *              status: 'success',
     *              data:{
     *               "id": "gy-gyc-bob-shop",
     *               "name": "Bob",
     *               "type": "shopkeeper",
     *               "description": "I give quests and sell wares.",
     *               "idleText": [
     *                   "Hmph, where did I put that fork?",
     *                   "I really wish it would rain.",
     *                   "I do love butterflies."
     *               ],
     *               "interactiveText": [],
     *               "tags": {
     *                   "questId": "gy-gyc-bob-shop-fetch-sticks"
     *               }
     *           }  or  { status: 'failure', message: 'message'}
     *
     */
    async patch(id: NullableId, data: any): Promise<any> {
        if (id === null) {
            throw new BadRequest(messages.common_messages_id_missing);
        }
        try {
            data.updatedAt = getUtcDate();
            const result = await this.patchData(
                config.dbCollections.npc,
                id,
                data
            );
            return Promise.resolve(buildSimpleResponse(buildNpcInfo(result)));
        } catch (e) {
            throw new BadRequest(messages.common_messages_ncp_not_found);
        }
    }

    /**
     * Get Npc
     *
     * @remarks
     * This method is part of the get Npc
     * - Request Type - GET
     * - Access - Admin
     * - End Point - API_URL/npc/{:npcId}
     *
     * @requires - authentication
     * @requires @param npcId - pass npcId as a url param
     * @returns - {
     *              status: 'success',
     *              data:{
     *                            "id": "gy-gyc-bob-shop",
     *               "name": "Bob",
     *               "type": "shopkeeper",
     *               "description": "I give quests and sell wares.",
     *               "idleText": [
     *                   "Hmph, where did I put that fork?",
     *                   "I really wish it would rain.",
     *                   "I do love butterflies."
     *               ],
     *               "interactiveText": [],
     *               "tags": {
     *                   "questId": "gy-gyc-bob-shop-fetch-sticks"
     *               }
     *           }  or  { status: 'failure', message: 'message'}
     *
     */

    async get(id: Id): Promise<any> {
        try {
            const result = await this.getData(config.dbCollections.npc, id);
            return Promise.resolve(buildSimpleResponse(buildNpcInfo(result)));
        } catch (e) {
            throw new BadRequest(messages.common_messages_ncp_not_found);
        }
    }

    /**
     * Returns the Npc list
     *
     * @remarks
     * This method is part of the get list of Npc
     * - Request Type - GET
     * - Access - Admin
     * - End Point - API_URL/npc?per_page=10&page=1
     *
     * @param per_page - page size
     * @param page - page number
     * @returns - Paginated Quest item list { data:[{...},{...}],current_page:1,per_page:10,total_pages:1,total_entries:5}
     *
     */
    async find(params?: Params): Promise<any> {
        const perPage = parseInt(params?.query?.per_page) || 10;
        const page = parseInt(params?.query?.page) || 1;
        const skip = (page - 1) * perPage;
        const npcData = await this.findData(config.dbCollections.npc, {
            query: {
                $skip: skip,
                $limit: perPage,
            },
        });
        const responseData: Array<any> = [];

        (npcData.data as Array<NpcInterface>)?.forEach(async (item) => {
            responseData.push(buildNpcInfo(item));
        });
        return Promise.resolve(
            buildPaginationResponse(
                responseData,
                page,
                perPage,
                Math.ceil(npcData.total / perPage),
                npcData.total
            )
        );
    }
}
