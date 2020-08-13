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

import { Router, RequestHandler, Request, Response, NextFunction } from 'express';
import { setupMetaverseAPI, finishMetaverseAPI } from '@Route-Tools/middleware';

import { Config, readInJSON } from '@Base/config';

import { Logger } from '@Tools/Logging';
import { IsNotNullOrEmpty } from '@Tools/Misc';

import deepmerge from 'deepmerge';

const procMetaverseInfo: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
  let data:any = {
    'metaverse_name': Config.metaverse["metaverse-name"],
    'metaverse_nick_name': Config.metaverse["metaverse-nick-name"],
    'metaverse_url': Config.metaverse["metaverse-server-url"],
    'ice_server_url': Config.metaverse["default-ice-server-url"],
    'metaverse_server_version': JSON.stringify(Config.server["server-version"]),
  };

  // If the additional information file exists, read and include the contents
  const additionUrl: string = Config["metaverse-server"]["metaverse-info-addition-file"];
  try {
    if (IsNotNullOrEmpty(additionUrl)) {
      const additional = await readInJSON(additionUrl);
      if (IsNotNullOrEmpty(additional)) {
        data = deepmerge(data, additional);
      };
    };
  }
  catch (err) {
    Logger.error(`procMetaverseInfo: exception reading additional info file: ${err}`);
  };

  req.vRestResp.Data = data;
  next();
};

export const name = "/api/v1/metaverse_info";

export const router = Router();

router.get( '/api/metaverse_info',    [ setupMetaverseAPI,
                                        procMetaverseInfo,
                                        finishMetaverseAPI ] );
router.get( '/api/v1/metaverse_info', [ setupMetaverseAPI,
                                        procMetaverseInfo,
                                        finishMetaverseAPI ] );