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

import config from '../appconfig';
import { extractLoggedInUserFromParams } from '../services/auth/auth.utils';
import { DatabaseService } from '../common/dbservice/DatabaseService';
import { BlockchainOptions } from './../services/token-transfer/token-transfer.class';

export default (blockchainOptions: BlockchainOptions) => {
    return async function (req: any, res: any, next: any) {
        next();
        const params = res.hook.params;
        const dbService = new DatabaseService({}, res.hook.app, undefined);

        const loggedInUser = extractLoggedInUserFromParams(params);

        const dbTx = await dbService.createData(
            config.dbCollections.blockchainTransactions,
            {
                userId: loggedInUser.id,
                amount: req.body.amount,
                txHash: res.data.data.transactionHash,
                action: req.body.action,
                status: 'pending',
            }
        );
        const tx = await blockchainOptions.provider.getTransaction(
            res.data.data.transactionHash
        );
        const txResult = await tx.wait();
        if (txResult.status) {
            dbTx.status = 'success';
        } else {
            dbTx.status = 'failure';
            const userBalance = await dbService.getData(
                config.dbCollections.tokenBalances,
                loggedInUser.id
            );
            userBalance.balance += req.body.amount;
            await dbService.patchData(
                config.dbCollections.tokenBalances,
                loggedInUser.id,
                userBalance
            );
        }
        await dbService.patchData(
            config.dbCollections.blockchainTransactions,
            dbTx._id,
            dbTx
        );
    };
};

