import { NotFound } from '@feathersjs/errors';
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

import { DatabaseService } from '../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../common/dbservice/DatabaseServiceOptions';
import { Application } from '../../declarations';
import { Params } from '@feathersjs/feathers';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../../utils/Misc';
import { extractLoggedInUserFromParams } from '../auth/auth.utils';
import { ethers } from 'ethers';
import { messages } from '../../utils/messages';
import { BadRequest, PaymentError } from '@feathersjs/errors';
import { AccountInterface } from '../../common/interfaces/AccountInterface';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';
import config from '../../appconfig';

export interface BlockchainOptions {
    provider: ethers.providers.Provider;
    minterPrivateKey: string;
    chainId: string;
}

export const TOKEN_NAME = 'GooERC20';

export class TokenTransfer extends DatabaseService {
    /**
     *  Deposits or withdraws ERC20 tokens
     *
     * @remarks
     * - Request Type - POST
     * - End Point - API_URL/token-transfer
     *
     * @param requestBody - { action: 'withdrawal', amount: 1000 }
     * - action: deposit or withdrawal
     * - amount: amount of token to mint/burn
     * @returns - {status: 'success'} or { status: 'failure', message: 'message'}
     *
     */

    async create(data: any, params: Params): Promise<any> {
        if (IsNotNullOrEmpty(data)) {
            //TODO distinguish action
            const { action, amount } = data;
            const loggedInUser = extractLoggedInUserFromParams(
                params
            ) as AccountInterface;

            if (IsNullOrEmpty(loggedInUser.ethereumAddress))
                throw new BadRequest(
                    messages.common_messages_no_ethereum_address
                );

            const userBalance = await this.getData(
                config.dbCollections.tokenBalances,
                loggedInUser.id
            );

            if (userBalance.balance >= amount) {
                await this.patchData(
                    config.dbCollections.tokenBalances,
                    loggedInUser.id,
                    {
                        balance: userBalance.balance - amount,
                    }
                );
                const tx = await params.tokenContract.mint(
                    loggedInUser.ethereumAddress,
                    amount
                );
                return Promise.resolve(
                    buildSimpleResponse({
                        transactionHash: tx.hash,
                    })
                );
            } else {
                throw new PaymentError(
                    messages.common_messages_blockchain_transaction_insufficient_in_game_balance
                );
            }
        } else {
            throw new BadRequest(messages.common_messages_badly_formed_data);
        }
    }
}

