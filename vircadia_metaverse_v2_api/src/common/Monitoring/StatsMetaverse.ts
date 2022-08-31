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

import config from '../../appconfig';

import { dateWhenNotOnline, dateWhenNotActive } from '../../utils/Utils';
import { Monitoring } from './Monitoring';
import { Stat } from './Stat';
import { ValueStat } from './ValueStat';
import { ValueHistogram } from './ValueHistogram';
import { DatabaseService } from '../dbservice/DatabaseService';
import app from '../../app';
// All the OS statistics
export class StatsMetaverse extends Stat {
    constructor() {
        super('metaverse', 'metaverse', '');

        // Count of all accounts that are sending heartbeats
        const totalOnline = new ValueStat(
            'totalOnline',
            'metaverse',
            'count',
            async (stat) => {
                const dbservice = new DatabaseService({}, app);

                const numOnline = await dbservice.findDataToArray(
                    config.dbCollections.accounts,
                    {
                        query: {
                            timeOfLastHeartbeat: { $gte: dateWhenNotOnline() },
                        },
                    }
                );
                stat.Event(numOnline.length);
            }
        );
        if (config.monitoring.history) {
            totalOnline.AddHistogram(
                'perDay',
                new ValueHistogram(24 * 12, 5 * 60 * 1000)
            ); // one day's worth of 5 minute buckets
            totalOnline.AddHistogram(
                'perWeek',
                new ValueHistogram(24 * 7, 60 * 60 * 1000)
            ); // one week per hour
        }
        Monitoring.addStat(totalOnline);

        // Sum of all users reported by domains.
        // NOTE: this also sets the value for the anon user stat to save the extra DB query
        const domainTotalUsers = new ValueStat(
            'domainTotalUsers',
            'metaverse',
            'count',
            async (stat) => {
                let totalUsers = 0;
                let anonUsers = 0;
                const dbservice = new DatabaseService({}, app);

                const domains = await dbservice.findDataToArray(
                    config.dbCollections.domains,
                    {
                        query: {
                            $or: [
                                { numUsers: { $gt: 0 } },
                                { anonUsers: { $gt: 0 } },
                            ],
                        },
                    }
                );

                for await (const aDomain of domains) {
                    totalUsers += aDomain.numUsers;
                    anonUsers += aDomain.anonUsers;
                }
                stat.Event(totalUsers);
                Monitoring.getStat('domainAnonUsers')?.Event(anonUsers);
            }
        );
        if (config.monitoring.history) {
            domainTotalUsers.AddHistogram(
                'perDay',
                new ValueHistogram(24 * 12, 5 * 60 * 1000)
            ); // one day's worth of 5 minute buckets
            domainTotalUsers.AddHistogram(
                'perWeek',
                new ValueHistogram(24 * 7, 60 * 60 * 1000)
            ); // one week per hour
        }
        Monitoring.addStat(domainTotalUsers);

        // Sum of all anon users reported by domains.
        // NOTE: value is set by domainTotalUsers
        const domainAnonUsers = new ValueStat(
            'domainAnonUsers',
            'metaverse',
            'count'
        );
        if (config.monitoring.history) {
            domainAnonUsers.AddHistogram(
                'perDay',
                new ValueHistogram(24 * 12, 5 * 60 * 1000)
            ); // one day's worth of 5 minute buckets
            domainAnonUsers.AddHistogram(
                'perWeek',
                new ValueHistogram(24 * 7, 60 * 60 * 1000)
            ); // one week per hour
        }
        Monitoring.addStat(domainAnonUsers);

        // Number of domains that are sending heartbeats
        const activeDomains = new ValueStat(
            'activeDomains',
            'metaverse',
            'count',
            async (stat) => {
                const dbservice = new DatabaseService({}, app);

                const numDomains = await dbservice.findDataToArray(
                    config.dbCollections.domains,
                    {
                        query: {
                            timeOfLastHeartbeat: { $gte: dateWhenNotActive() },
                        },
                    }
                );

                stat.Event(numDomains.length);
            }
        );
        if (config.monitoring.history) {
            activeDomains.AddHistogram(
                'perDay',
                new ValueHistogram(24 * 12, 5 * 60 * 1000)
            ); // one day's worth of 5 minute buckets
            activeDomains.AddHistogram(
                'perWeek',
                new ValueHistogram(24 * 7, 60 * 60 * 1000)
            ); // one week per hour
        }
        Monitoring.addStat(activeDomains);
    }

    Event(pCount: number): void {
        throw new Error('Method not implemented.');
    }
    async Gather(): Promise<void> {
        return;
    }
    Report(pReturnHistogram = true): any {
        return {
            totalOnline:
                Monitoring.getStat('totalOnline')?.Report(pReturnHistogram),
            domainTotalUsers:
                Monitoring.getStat('domainTotalUsers')?.Report(
                    pReturnHistogram
                ),
            domainAnonUsers:
                Monitoring.getStat('domainAnonUsers')?.Report(pReturnHistogram),
            activeDomains:
                Monitoring.getStat('activeDomains')?.Report(pReturnHistogram),
        };
    }
}
