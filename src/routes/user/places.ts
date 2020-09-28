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

import { Config } from '@Base/config';

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI, param1FromParams } from '@Route-Tools/middleware';
import { HTTPStatusCode } from '@Route-Tools/RESTResponse';

// When a user gots to "METAVERSE_URL/user/places", redirect to
//        "https://dashboard.vircadia.com?metaverse=MEAVERSE_URL&page=places"
const procGetPlaces: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  const dashboardURL = Config.metaverse["dashboard-url"];
  const metaverseURL = encodeURIComponent(Config.metaverse["metaverse-server-url"]);
  const redirectionURL = `${dashboardURL}?metaverse=${metaverseURL}&page=places`;
  resp.statusCode = HTTPStatusCode.Found;
  resp.setHeader('Location', redirectionURL),
  resp.setHeader('content-type', 'text/html');
  resp.send();
};

export const name = '/user/places';

export const router = Router();

router.get( '/user/places', [ setupMetaverseAPI,    // req.vRESTResp
                              procGetPlaces,
                              finishMetaverseAPI ] );