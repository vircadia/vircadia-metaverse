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

import { HookContext } from '@feathersjs/feathers';
import { extractLoggedInUserFromParams } from '../../services/auth/auth.utils';

// TODO: Make one hook by combine this with "set-loggedin-user-in-body"
// This will attach the loggedIn user id in the query property
export default (propertyName: string) => {
    return (context: HookContext): any => {
        const loggedInUser = extractLoggedInUserFromParams(context.params);
        context.params.query = {
            ...context.params.query,
            [propertyName]: loggedInUser?.id || null,
        };

        return context;
    };
};
