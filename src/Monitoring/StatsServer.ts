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
import { CounterStat } from '@Monitoring/CounterStat';
import { EventHistogram } from '@Monitoring/EventHistogram';

// All the OS statistics
export class StatsServer extends Stat {
    constructor() {
        super('server', 'server', '');

        // Number of API requests
        const apiStat = new CounterStat('apiRequests', 'server', 'request');
        if (Config.monitoring.history) {
            apiStat.AddHistogram('perHour', new EventHistogram(60, 60*1000));   // 60 one minute buckets
            apiStat.AddHistogram('perDay', new EventHistogram(24*12, 5*60*1000));// one day's worth of 5 minute buckets
            apiStat.AddHistogram('perWeek', new EventHistogram(7*24, 60*60*1000));// one weeks worth of one hour buckets
        };
        Monitoring.addStat(apiStat);

        // Number of requests that generated errors
        const apiErrors = new CounterStat('apiErrors', 'server', 'request');
        if (Config.monitoring.history) {
            apiStat.AddHistogram('perHour', new EventHistogram(60, 60*1000));   // 60 one minute buckets
            apiStat.AddHistogram('perDay', new EventHistogram(24*12, 5*60*1000));// one day's worth of 5 minute buckets
        };
        Monitoring.addStat(apiErrors);
    };

    Event(pCount: number): void {
        throw new Error('Method not implemented.');
    }
    Gather(): void {
        return;
    }
    Report(pReturnHistogram: boolean = true) {
        return {
            'apiRequests': Monitoring.getStat('apiRequests')?.Report(pReturnHistogram),
            'apiErrors': Monitoring.getStat('apiErrors')?.Report(pReturnHistogram),
        };
    }
};