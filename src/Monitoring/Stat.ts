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

import { Histogram } from '@Monitoring/Histogram';
import { VKeyedCollection } from '@Tools/vTypes';

// Function that is called for a statistic when pulling its value
export type updateValueFunction = ( pStat: Stat ) => void;

export abstract class Stat {
  public name: string;      // the name of the statistic
  public category: string;  // a grouping category for the statistic
  public unit: string;      // the unit of the statistic
  public value: number;     // the value
  public pullAction: updateValueFunction; // if defined, called before using value
  // Many of the stats use Gather() to do the PullAction for histogram generation.
  //    Gather() is called once a second and this can be too often.
  //    The following can be optionally set to the number of seconds between pulls.
  //    If this is 'undefined', DoPullAction() does the pullAction every time it's called.
  public secondsBetweenPulls: number; // seconds between doing pull operation
  public pullCount: number;

  _histograms: Map<string,Histogram>;

  constructor(pName:string, pCategory: string, pUnit: string, pPullAction?: updateValueFunction) {
    this.name = pName;
    this.category = pCategory;
    this.unit = pUnit;
    this.value = 0;
    this.pullAction = pPullAction;
    this._histograms = new Map<string,Histogram>();
  };

  // Add a histogram to this value
  AddHistogram(pHistogramName: string, pHistogram: Histogram) {
    this._histograms.set(pHistogramName, pHistogram);
  };
  DoPullAction(): void {
    if (this.pullAction) {
      if (this.secondsBetweenPulls) {
        if (this.pullCount-- < 0) {
          this.pullAction(this);
          this.pullCount = this.secondsBetweenPulls;
        };
      }
      else {
        this.pullAction(this);
      };
    };
  };
  // Record one or more events
  abstract Event(pCount: number): void;
  // Called once a second to do any gathering operation
  abstract Gather(): void;
  // Return an object containing the values in this stat
  Report(): any {
    const report: VKeyedCollection = {
      'name': this.name,
      'category': this.category,
      'unit': this.unit,
      'value': this.value
    };
    if (this._histograms.size > 0) {
      const history: any = {};
      this._histograms.forEach( (histo, name) => {
        history[name] = histo.GetHistogram();
      });
      report.history = history;
    };
    return report;
  };
};

