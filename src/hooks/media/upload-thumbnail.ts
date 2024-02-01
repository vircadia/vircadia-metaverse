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

import { Hook, HookContext } from '@feathersjs/feathers';

export default (): Hook => {
    return async (context: HookContext): Promise<HookContext> => {
        const { app } = context;
        if (context.params.thumbnail) {
            context.params.file = context.params.thumbnail;
            context.params.mimeType = context.params.file.mimetype;
            context.params.parentResourceId = context.result.id;
            context.data.metadata = context.data.metadata
                ? context.data.metadata
                : {};
            delete context.params.thumbnail;

            await app.services.upload.create(context.data, context.params);

            return context;
        } else {
            return context;
        }
    };
};
