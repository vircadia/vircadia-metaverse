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

import config from '../../appconfig';
import { Hook, HookContext } from '@feathersjs/feathers';

export default (): Hook => {
    return async (context: HookContext): Promise<HookContext> => {
        if (context.data.uri) {
            delete context.data.uri;
        }

        delete context.result.uri;
        let domain =
            config.server.storageProvider === 'aws'
                ? config.aws.s3.awsStorageProvider
                : config.server.localStorageProvider;
        if (!domain.endsWith('/')) {
            domain = domain.substring(0, domain.length - 1);
        }
        const url = `https://${domain}/${context.result.id || context.data.id}`;

        context.data.url = url;

        return context;
    };
};
