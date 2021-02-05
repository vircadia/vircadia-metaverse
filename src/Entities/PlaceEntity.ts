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

// NOTE: this class cannot have functions in them as they are just JSON to and from the database
export class PlaceEntity implements Entity {
  public id: string;            // globally unique place identifier
  public name: string;          // Human friendly name of the place
  public description: string;   // Human friendly description of the place
  public maturity: string;      // maturity level of the place (see Sets/Maturity.ts)
  public tags: string[];        // tags defining the string content
  public domainId: string;      // domain the place is in
  public path: string;          // address within the domain: "optional-domain/x,y,z/x,y,z,x"
  public thumbnail: string;     // thumbnail for place
  public images: string[];      // images for the place

  // A Place can have a beacon that updates current state and information
  // If current information is not supplied, attendance defaults to domain's
  public currentAttendance: number    // current attendance at the Place
  public currentImages: string[]      // images at the session
  public currentInfo: string          // JSON information about the session
  public currentLastUpdateTime: Date  // time that the last session information was updated
  public currentAPIKeyTokenId: string // API key for updating the session information

  // admin stuff
  public iPAddrOfFirstContact: string; // IP address that registered this place
  public whenCreated: Date; // What the variable name says
};