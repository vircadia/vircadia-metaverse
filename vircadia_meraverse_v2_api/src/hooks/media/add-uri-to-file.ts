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

import dauria from 'dauria';
import { Hook, HookContext } from '@feathersjs/feathers';
import * as path from 'path';
import _ from 'lodash';
import { extension } from 'mime-types';

export default (): Hook => {
    return async (context: HookContext): Promise<HookContext> => {
        if (!context.data.uri && context.params.file) {
            const file = context.params.file;
            const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
            context.data = { uri: uri };
        }

        if (!context.data.id && _.has(context, 'params.uploadPath')) {
            const uploadPath = _.get(context, 'params.uploadPath');
            const id = _.get(context, 'params.id');
            if (context.params.file.originalname === 'blob') {
                const fileExtenstion = String(
                    extension(context.params.file.mimetype)
                );

                if (uploadPath) {
                    context.data.id = `${
                        uploadPath as string
                    }.${fileExtenstion}`;
                } else {
                    context.data.id = `${
                        context.params.file.originalname as string
                    }.${fileExtenstion}`;
                }
            } else {
                context.data.id = uploadPath && id? path.join(uploadPath, id): uploadPath? path.join(uploadPath,context.params.file.originalname): context.params.file.originalname;
            }
        }
        return context;
    };
};
