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

import { Requests, RequestType } from "@Entities/Requests";
import { RequestEntity } from "@Entities/RequestEntity";

import { Accounts } from "@Entities/Accounts";
import { accountFromAuthToken, usernameFromParams } from "@Route-Tools/middleware";

import { IsNullOrEmpty, IsNotNullOrEmpty } from "@Tools/Misc";
import { Logger } from "@Tools/Logging";

const procPostUserConnectionRequest: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vAuthAccount) {
        // The client script looks for two types of 'connection' responses.
        // If is sees data.connection == "pending", it trys again and eventually times out
        // If data.connection has an object, it uses 'new_connection' and 'username'

        if (req.body.user_connection_request) {
            const thisNode = req.body.user_connection_request.node_id;
            const otherNode = req.body.user_connection_request.proposed_node_id;

            // BEGIN sanity check DEBUG DEBUG

            // Connections use node id's to identify the two avatars, I guess because, the
            //    world does not have access to the account identity.
            // This debugging code prints out whether the passed nodeIds match the loction
            //    nodeIds that we have to verify that the connection nodeIds are really the
            //    same ones as passed in the location.
            // All this debugging output can go away once nodeId usage is understood.
            if (req.vAuthAccount.locationNodeId) {
                if (req.vAuthAccount.locationNodeId === thisNode) {
                    Logger.debug(`procPostUserConnectionRequest: request from ${req.vAuthAccount.username} and locationNodeid matches main node`);
                } else if (req.vAuthAccount.locationNodeId === otherNode) {
                    Logger.debug(`procPostUserConnectionRequest: request from ${req.vAuthAccount.username} and locationNodeid matches proposed node`);
                } else {
                    Logger.debug(`procPostUserConnectionRequest: request from ${req.vAuthAccount.username} and locationNodeid does not match either node`);
                }
            } else {
                Logger.debug(`procPostUserConnectionRequest: request from ${req.vAuthAccount.username} and no nodeID info`);
            }
            // END sanity check DEBUG DEBUG

            let pending = true;   // assume request is still pending

            // Find if there is another requests between these two nodes
            // Note: this is not the accountID but the session nodeId of the avatars
            const previousAsk = await Requests.getWithRequestBetween(thisNode, otherNode,
                RequestType.HANDSHAKE,
                "requesterNodeId", "targetNodeId");
            if (IsNotNullOrEmpty(previousAsk)) {
                Logger.debug(`procPostUserConnectionRequest: previous ask. by=${req.vAuthAccount.id}, this=${thisNode}, other=${otherNode}`);
                // There is an existing connection request
                if (previousAsk.requesterNodeId === thisNode) {
                    // This is a request that I've made. See if the other side has accepted
                    if (previousAsk.targetAccepted) {
                        Logger.debug(`procPostUserConnectionRequest: was accepted. by=${req.vAuthAccount.id}, this=${thisNode}, other=${otherNode}`);
                        // They have accepted! We have a connection!
                        await BuildNewConnection(previousAsk);
                        await BuildConnectionResponse(req, previousAsk.targetAccountId);
                        pending = false;
                        // The request itself will timeout and expire
                    } else {
                        Logger.debug(`procPostUserConnectionRequest: other hasn't accepted. by=${req.vAuthAccount.id}, this=${thisNode}, other=${otherNode}`);
                    }
                } else {
                    Logger.debug(`procPostUserConnectionRequest: I accept. by=${req.vAuthAccount.id}, this=${thisNode}, other=${otherNode}`);
                    // There is an existing request to me.
                    // Since I'm making the same request, we are mutually involved
                    previousAsk.targetAccepted = true;
                    previousAsk.targetAccountId = req.vAuthAccount.id;
                    Requests.update(previousAsk, { "targetAccepted": true,
                        "targetAccountId": req.vAuthAccount.id });

                    const areConnected = await BuildNewConnection(previousAsk);
                    if (areConnected) {
                        await BuildConnectionResponse(req, previousAsk.requestingAccountId);
                        pending = false;
                    } else {
                        Logger.error(`procPostUserConnectionRequest: BuildNewConnection failed. by=${req.vAuthAccount.id}, this=${thisNode}, other=${otherNode}`);
                        req.vRestResp.respondFailure("error making connection");
                    }
                    // The request itself will timeout and expire
                }
            } else {
                // There is not a pending request between us. Create one
                Logger.debug(`procPostUserConnectionRequest: new request. by=${req.vAuthAccount.id}, this=${thisNode}, other=${otherNode}`);
                const newRequest = await Requests.createHandshakeRequest(thisNode, otherNode);
                newRequest.requesterAccepted = true;
                newRequest.requestingAccountId = req.vAuthAccount.id;
                await Requests.add(newRequest);
            }

            if (pending) {
                // The above didn't create a response so we're just waiting
                req.vRestResp.Data = {
                    "connection": "pending"
                };
            }
        } else {
            req.vRestResp.respondFailure("badly formed request");
        }
    } else {
        req.vRestResp.respondFailure(req.vAccountError ?? "Not logged in");
    }
    next();
};

// Build a new Connection based on the request
async function BuildNewConnection(pRequest: RequestEntity): Promise<boolean> {
    let wasConnected = false;
    const requestingAccount = await Accounts.getAccountWithId(pRequest.requestingAccountId);
    const targetAccount = await Accounts.getAccountWithId(pRequest.targetAccountId);
    if (requestingAccount && targetAccount) {
        await Accounts.makeAccountsConnected(requestingAccount, targetAccount);
        wasConnected = true;
    } else {
        Logger.error(`connection_request: acceptance for connection but accounts not found`);
        Logger.error(`connection_request:   reqAccId=${pRequest.requestingAccountId}, tgtAccId=${pRequest.targetAccountId}`);
    }
    return wasConnected;
}

// Build the response that says a connection has been made
async function BuildConnectionResponse(req: Request, pOtherAccountId: string): Promise<void> {
    const otherAccount = await Accounts.getAccountWithId(pOtherAccountId);
    req.vRestResp.Data = {
        "connection": {
            "new_connection": true,
            "username": otherAccount ? otherAccount.username : "UNKNOWN"
        }
    };
}

// A user is asking for all it's handshake requests to be removed
const procDeleteUserConnectionRequest: RequestHandler = async (req: Request, resp: Response, next: NextFunction) => {
    if (req.vAuthAccount) {
        Logger.debug(`procDeleteUserConnectionRequest: deleting for ${req.vAuthAccount.id}`);
        await Requests.removeAllMyRequests(req.vAuthAccount.id, RequestType.HANDSHAKE);
    } else {
        req.vRestResp.respondFailure(req.vAccountError ?? "Not logged in");
    }
    next();
};

export const name = "/api/v1/user/connection_request";

export const router = Router();

router.post("/api/v1/user/connection_request", [
    setupMetaverseAPI,
    accountFromAuthToken,
    procPostUserConnectionRequest,
    finishMetaverseAPI
]);
router["delete"]("/api/v1/user/connection_request", [
    setupMetaverseAPI,
    accountFromAuthToken,
    procDeleteUserConnectionRequest,
    finishMetaverseAPI
]);
