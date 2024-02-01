//   Copyright 2020 Vircadia Contributors
//   Copyright 2022 DigiSomni LLC.
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
import { NullableId } from '@feathersjs/feathers';
import config from '../../../appconfig';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../../declarations';
import { messages } from '../../../utils/messages';
import { IsNotNullOrEmpty } from '../../../utils/Misc';

export class MiniGameQuest extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * Edit minigameProgress in quest
     *
     * @remarks
     * This method is part of the edit minigame
     * - Request Type - PATCH
     * - End Point - API_URL/minigame/{:questId}
     *
     * @requires - authentication
     * @requires @param questId - pass questId as a url param
     * @param requestBody - {
     *               "miniGameId": "boss-1",
     *               "score":200
     *           }
     * @returns - {
     *              status: 'success',
     *
     *           } or  { status: 'failure', message: 'message'}
     *
     */
    async patch(id: NullableId, data: any): Promise<any> {
        if (id === null) {
            throw new BadRequest(messages.common_messages_id_missing);
        }

        const questData = await this.findDataToArray(
            config.dbCollections.quest,
            { query: { id: id } }
        );

        if (IsNotNullOrEmpty(questData)) {
            if (IsNotNullOrEmpty(questData[0].miniGameProgress)) {
                if (
                    questData[0].miniGameProgress.miniGameId == data.miniGameId
                ) {
                    const miniGameProgress = {
                        miniGameProgress: data,
                    };
                    await this.app
                        ?.service('quest')
                        ?.patch(id, miniGameProgress);
                } else {
                    throw new BadRequest(
                        messages.common_messages_minigame_not_associated
                    );
                }
            } else {
                const questItem = await this.findDataToArray(
                    config.dbCollections.questItem,
                    {
                        query: {
                            id: questData[0].questId,
                        },
                    }
                );

                if (IsNotNullOrEmpty(questItem)) {
                    if (
                        IsNotNullOrEmpty(questItem[0].miniGameRequirements) &&
                        questItem[0].miniGameRequirements.miniGameId ==
                            data.miniGameId
                    ) {
                        const miniGameProgress = {
                            miniGameProgress: data,
                        };
                        await this.app
                            ?.service('quest')
                            ?.patch(id, miniGameProgress);
                    } else {
                        throw new BadRequest(
                            messages.common_messages_minigame_not_associated_questItem
                        );
                    }
                } else {
                    throw new BadRequest(
                        messages.common_messages_quest_item_not_found
                    );
                }
            }

            return Promise.resolve({});
        } else {
            throw new BadRequest(messages.common_messages_quest_not_found);
        }
    }
}

