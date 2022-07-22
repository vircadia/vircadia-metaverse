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

export enum ItemSource {
    PICKUP = 'pickup',
    LOOTING = 'looting',
    PURCHASE_FROM_MERCHANT = 'purchase_from_merchant',
    REWARDED_FOR_QUEST = 'rewarded_for_quest',
    REWARDED_FOR_MINIGAME = 'rewarded_for_minigame',
    DAILY_REWARD = 'daily_reward',
    GROUND_SPAWN = 'ground_spawn',
    WINNING_AUCTION = 'winning_auction',
    TRADING_WITH_OTHER_PLAYER = 'trading_with_other_player',
}
