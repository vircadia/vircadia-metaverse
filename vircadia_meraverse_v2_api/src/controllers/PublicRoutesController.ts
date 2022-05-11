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

import { MetaverseInfoInterface } from '../common/interfaces/MetaverseInfo';
import config from '../appconfig';
import { IsNotNullOrEmpty, readInJSON } from '../utils/Misc';

export const PublicRoutesController = () => {
    const metaverseInfo = async (req: any, res: any) => {
        const response: MetaverseInfoInterface = {
            metaverse_name: config.metaverse.metaverseName,
            metaverse_nick_name: config.metaverse.metaverseNickName,
            ice_server_url: config.metaverse.defaultIceServerUrl,
            metaverse_url: config.metaverse.metaverseServerUrl,
            metaverse_server_version: {
                version_tag: config.server.version,
            },
        };
        try {
            const additionUrl: string =
                config.metaverseServer.metaverseInfoAdditionFile;
            if (IsNotNullOrEmpty(additionUrl)) {
                const additional = await readInJSON(additionUrl);
                if (IsNotNullOrEmpty(additional)) {
                    response.metaverse_server_version = additional;
                }
            }
        } catch (err) {
            console.error(
                `procMetaverseInfo: exception reading additional info file: ${err}`
            );
        }
        res.status(200).json(response);
    };
    return { metaverseInfo };
};
