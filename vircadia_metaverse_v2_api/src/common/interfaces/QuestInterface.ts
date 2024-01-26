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

export interface QuestInterface {
    id: string; // UUID
    questId: string; //  ID of the item, this is related to a table
    ownerId: string; // ID of the user it was generated for
    createdAt: Date; // date and time it was generated on
    expiresOn: Date; // date and time the question expire
    isAccepted: boolean; // has the player accepted the quest
    isUnique: boolean; // can't delete quest if true, instead mark as complete and leave for record keeping
    npcProgress: Array<QuestProgressInterface>; // an array of NPC ID's and the kill amount required for them
    miniGameProgress: Array<QuestProgressInterface>; // an array of minigames and the amount completed required
    isCompleted: boolean; // is quest completed
    isActive: boolean; // is quest active
}

export interface QuestProgressInterface {
    itemId: string;
    qty: number;
}
