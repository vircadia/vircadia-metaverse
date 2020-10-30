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

import os from 'os';

import { Monitoring } from '@Monitoring/Monitoring';
import { Stat } from '@Monitoring/Stat';
import { ValueStat } from '@Monitoring/ValueStat';
import { ValueHistogram } from '@Monitoring/ValueHistogram';
import { Logger } from '@Tools/Logging';

// All the OS statistics
export class StatsOs extends Stat {

  constructor() {
    super('os', 'os', '');

    // Stat that collects the percent of CPU busy
    const cpuBusy = new ValueStat('cpuBusy', 'os', 'percent', (stat) => {
      const cpuInfo = os.cpus();
      let totalBusy = 0;
      let totalIdle = 0;
      cpuInfo.forEach(element => {
        totalIdle += element.times.idle;
        totalBusy += element.times.user + element.times.nice + element.times.sys + element.times.irq;
      });
      stat.Event( totalBusy / (totalIdle + totalBusy) * 100);
    });
    if (Config.monitoring.history) {
      cpuBusy.AddHistogram('5mins', new ValueHistogram(60, 5 * 1000));    // 60 five second buckets
      cpuBusy.AddHistogram('perHour', new ValueHistogram(60, 60*1000));   // 60 one minute buckets
      cpuBusy.AddHistogram('perDay', new ValueHistogram(24*12, 5*60*1000));// one day's worth of 5 minute buckets
    };
    Monitoring.addStat(cpuBusy);

    // Stat that collects the percent of memory used
    const memUsage = new ValueStat('memUsage', 'os', 'percent', (stat) => {
      stat.Event( os.freemem() / os.totalmem() * 100 );
    });
    if (Config.monitoring.history) {
      memUsage.AddHistogram('perDay', new ValueHistogram(24*12, 5*60*1000));// one day's worth of 5 minute buckets
      memUsage.AddHistogram('perWeek', new ValueHistogram(7*24, 60*60*1000));// one weeks's worth of hour buckets
    };
    Monitoring.addStat(memUsage);
  };

  Event(pCount: number): void {
    throw new Error('Method not implemented.');
  }
  Gather(): void {
    return;
  }
  Report(pReturnHistogram: boolean = true): any {
    return {
      'cpus': os.cpus(),
      'freemem': os.freemem(),
      'totalmem': os.totalmem(),
      'loadavg': os.loadavg(),
      'uptime': os.uptime(),
      'cpuBusy': Monitoring.getStat('cpuBusy')?.Report(pReturnHistogram),
      'memUsage': Monitoring.getStat('memUsage')?.Report(pReturnHistogram)
    };
  }
};
