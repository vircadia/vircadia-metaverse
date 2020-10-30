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

import { Stat, updateValueFunction } from '@Monitoring/Stat';

export class CounterStat extends Stat {

  constructor(pName: string, pCatagory: string, pUnit: string, pPullAction?: updateValueFunction) {
    super(pName, pCatagory, pUnit, pPullAction);
  };

  // Record an event has happened
  Event(pCount: number = 1): void {
    this.value += pCount;
    this._histograms.forEach( (histo) => {
      histo.Event(pCount);
    });
  };
  Gather(): void {
    this.DoPullAction();
    return;
  };

  Report(pReturnHistogram: boolean = true): any {
    const report = super.Report(pReturnHistogram);
    return report;
  };
}