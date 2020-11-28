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

import Config from '@Base/config';

import { Logger } from '@Tools/Logging';

export class Maturity {
  public static UNRATED: string = 'unrated';
  public static EVERYONE: string = 'everyone';
  public static TEEN: string = 'teen';
  public static MATURE: string = 'mature';
  public static ADULT: string = 'adult';

  static MaturityCategories = [ Maturity.UNRATED,
             Maturity.EVERYONE,
             Maturity.TEEN,
             Maturity.MATURE,
             Maturity.ADULT
            ];

  static KnownMaturity(pMaturity: string): boolean {
    return this.MaturityCategories.includes(pMaturity);
  };

};

