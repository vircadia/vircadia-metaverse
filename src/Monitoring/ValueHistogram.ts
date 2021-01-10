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

interface BucketValue {
  values: number[];
  average?: number;
  mean?: number;
  mode?: number;
};

// Create histogram of averages of values.
// This is for like creating a histogram of CPU percent, for instance.
//    The caller sets the CPU percentage as the Event value and the
//    histogram returns the average of the values in that bucket interval.
export class ValueHistogram extends Histogram {

  _timeBase: number;
  _numBuckets: number;
  _bucketMilliseconds: number;
  _lastBucket: number;
  _totalHistogramMilliseconds: number;
  _histogram: BucketValue[];

  constructor(pNumberOfBuckets: number, pMillisecondsPerBucket: number) {
    super();
    this._numBuckets = pNumberOfBuckets;
    this._bucketMilliseconds = pMillisecondsPerBucket;
    this._totalHistogramMilliseconds = this._numBuckets * this._bucketMilliseconds;

    this.Zero();
    this._lastBucket = 0
    this._timeBase = Date.now().valueOf();
  };

  // Add some events to the histogram.
  Event(pNewValue: number) {
    const bucketTime = Date.now().valueOf() - this._timeBase;

    // from the base of the array, where could this item go
    let bucket = Math.floor(bucketTime / this._bucketMilliseconds);

    // Advance _lastBucket to the new bucket. Zero any buckets skipped over
    while (bucket !== this._lastBucket) {
      if (this._lastBucket === this._numBuckets) {
        this._lastBucket = 0;
        bucket -= this._numBuckets;
        this._timeBase += this._totalHistogramMilliseconds;
      }
      else {
        this._lastBucket++;
      }
      this._histogram[this._lastBucket] = { 'values': [] };
    };
    this._histogram[this._lastBucket].values.push(pNewValue);
    this._histogram[this._lastBucket].average = undefined;
  };

  // Returns an object with all the information about the histogram
  GetHistogram(): any {
    const values: number[] = [];
    let idx = this._lastBucket;
    for (let ii=0; ii < this._numBuckets; ii++) {
      if (++idx >= this._numBuckets) {
        idx = 0;
      };
      const bucketInfo = this._histogram[idx];
      let average = this._histogram[idx].average;
      if (typeof(average) === 'undefined') {
        if (bucketInfo.values.length > 0) {
          const sum = bucketInfo.values.reduce( (a,b) => a + b );
          average = sum / bucketInfo.values.length;
        }
        else {
          average = 0;
        };
        this._histogram[idx].average = average;
      }
      values.push(average);
    };

    return {
      "buckets": this._numBuckets,
      "bucketMilliseconds": this._bucketMilliseconds,
      "totalMilliseconds": this._totalHistogramMilliseconds,
      "timeBase": this._timeBase - (this._bucketMilliseconds * (this._numBuckets - this._lastBucket)),
      "baseNumber": Math.floor((this._timeBase / this._bucketMilliseconds)) + this._lastBucket + 1,
      "type": "average",
      "values": values
    };
  };

  // Zero out the current histogram
  Zero(): void {
    this._histogram = [];
    this._histogram.length = this._numBuckets;
    for (let ii=0; ii < this._numBuckets; ii++) {
      this._histogram[ii] = { 'values': [] };
    };
  };
};