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
'use strict'

import { Config } from '@Base/config';

import { Stat } from '@Monitoring/Stat';
import { StatsOs } from '@Monitoring/StatsOs';
import { StatsMetaverse } from '@Monitoring/StatsMetaverse';
import { StatsServer } from '@Monitoring/StatsServer';

import { Logger } from '@Tools/Logging';

let _statistics: Map<string, Stat>;

// Initialize statistic management.
export function initMonitoring(): void {
  _statistics = new Map<string, Stat>();

  if (Config.monitoring.enable) {
    CreateStats();

    // Stats are called once a second so they can gather histograms
    setInterval( async () => {
      for (const stat of _statistics.values()) {
          await stat.Gather();
      };
    }, 1000 * 1 );
  };
};

export const Monitoring = {
  addStat(pStat: Stat) {
    _statistics.set(pStat.name, pStat);
  },
  getStat(pStatName: string): Stat {
    return _statistics.get(pStatName);
  },
  getStats(): IterableIterator<Stat> {
    return _statistics.values();
  },
  // Add event count to a named Stat.
  // This allows stats to be optional because the caller doesn't need to
  //     know if the stat exists.
  event(pEventName: string, pCount: number = 1): void {
    const theStat = _statistics.get(pEventName);
    if (theStat) {
        theStat.Event(pCount);
    };
  }
};

function CreateStats() {
  Monitoring.addStat(new StatsOs());
  Monitoring.addStat(new StatsMetaverse());
  Monitoring.addStat(new StatsServer());
};
