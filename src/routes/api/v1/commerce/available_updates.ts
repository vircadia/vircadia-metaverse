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

// GET /api/v1/commerce/available_updates?per_page=10
const procGetCommerceAvailableUpdates: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vRestResp) {
        req.vRestResp.Data = {
        };
    }
    next();
};

export const name = "/api/v1/commerce/available_updates";

export const router = Router();

router.get("/api/v1/commerce/available_updates", [
    setupMetaverseAPI,
    procGetCommerceAvailableUpdates,
    finishMetaverseAPI
]);
