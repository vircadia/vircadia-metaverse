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


import { Router, RequestHandler, Request, Response, NextFunction } from "express";
import { setupMetaverseAPI, finishMetaverseAPI } from "@Route-Tools/middleware";
import { accountFromAuthToken } from "@Route-Tools/middleware";

import { Logger } from "@Tools/Logging";

// PUT /api/v1/commerce/htc_account
const procPutCommerceHfcAccount: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vAuthAccount) {
        Logger.debug("procPutCommerceHfcAccount");
    } else {
        req.vRestResp.respondFailure(req.vAccountError ?? "Not logged in");
    }
    next();
};

export const name = "/api/v1/commerce/hfc_account";

export const router = Router();

router.put("/api/v1/commerce/hfc_account", [
    setupMetaverseAPI,
    accountFromAuthToken,
    procPutCommerceHfcAccount,
    finishMetaverseAPI
]);
