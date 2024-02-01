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

'use strict';

export interface MiniGameInterface {
    id: string;
    name: string;
    giver: string;
    description: string;
    prerequisites: PrerequisitesInterface;
    attributes: AttributesInterface;
    rewards?: RewardsInterface;
    createdAt: Date; // A Date representing  MiniGame created date
    updatedAt: Date; //A Date representing  MiniGame item updatedAt date
}

export interface PrerequisitesInterface {
    minLevel: number;
    maxLevel: number;
    expireAfter: number; //Time in milliseconds seconds
    maxActive: number;
    maxSimultaneous: number; //means that you can have 5 max quests completed but unexpired, to do this quest again you will need to wait until one or more of them expire
}

export interface AttributesInterface {
    enemyId: string;
    enemyHitpoints: number;
    enemyPhysicalDamageLevel: number;
    enemyPhysicalDefenceLevel: number;
}

export interface RewardsInterface {
    items?: itemInterface[];
    xp?: number;
    goo?: number;
}
export interface itemInterface {
    itemId: string;
    qty: number;
}

