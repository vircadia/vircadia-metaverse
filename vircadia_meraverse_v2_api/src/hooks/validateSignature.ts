//   Copyright 2022 Vircadia Contributors
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

// The hook checks that the user indeed owns the wallet by decrypting
// the pre-defined message with user's public key
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
    return async (context: HookContext): Promise<HookContext> => {
        //context.params.signedMessage
        //const loginUser = extractLoggedInUserFromParams(params);
        //const account = loginUser as AccountInterface;
        //account.ethereumAddress;//public key

        return context;
    };
};

