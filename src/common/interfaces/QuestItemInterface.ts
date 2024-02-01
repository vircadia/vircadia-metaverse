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

export interface QuestItemInterface {
    id: string; // Quest Id
    name: string; // Quest item name
    giver: string; // Quest Giver
    description: string; //Quest Description
    dialogue: any;
    prerequisites: PrerequisitesInterface;
    itemRequirements: RequirementItemInterface; //an array of Item ID's and the required amount
    npcRequirements: any; //  NPC ID's and the kill amount required for them
    miniGameRequirements: any; // Minigames and the amount completed required
    rewards: Array<RewardItemInterface | XpRewardInterface>;
    createdAt: Date; // A Date representing  Quest item created date
    updatedAt: Date; //A Date representing  Quest item updatedAt date
}

export interface RequirementItemInterface {
    items: RequirementsItemInterface[];
}

export interface RequirementsItemInterface {
    itemId: string;
    qty: number;
}

export interface RewardItemInterface {
    itemId: string;
    qty: number;
}

export interface XpRewardInterface {
    xp: number;
}

// export interface GooRewardInterface {
//     goo: number;
// }

export interface PrerequisitesInterface {
    minLevel: number;
    maxLevel: number;
    expireAfter: number; //Time in milliseconds seconds
    maxActive: number;
    maxSimultaneous: number; //means that you can have 5 max quests completed but unexpired, to do this quest again you will need to wait until one or more of them expire
}

