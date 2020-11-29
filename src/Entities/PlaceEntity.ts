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

import { Entity } from '@Entities/Entity';
import { AccountEntity } from '@Entities/AccountEntity';
import { AuthToken } from '@Entities/AuthToken';

import { placeFields } from '@Entities/PlaceFields';

import { getEntityField, setEntityField, getEntityUpdateForField } from '@Route-Tools/GetterSetter';

import { VKeyedCollection } from '@Tools/vTypes';

import { Logger } from '@Tools/Logging';

// NOTE: this class cannot have functions in them as they are just JSON to and from the database
export class PlaceEntity implements Entity {
  public id: string;            // globally unique place identifier
  public name: string;          // Human friendly name of the place
  public description: string;   // Human friendly description of the place
  public maturity: string;        // tags defining the string content
  public tags: string[];        // tags defining the string content
  public domainId: string;      // domain the place is in
  public address: string;       // Address within the domain
  public thumbnail: string;     // thumbnail for place
  public images: string[];      // images for the place

  // admin stuff
  public iPAddrOfFirstContact: string; // IP address that registered this place
  public whenCreated: Date; // What the variable name says
};