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

// Initializes the `token-transfer` service on path `/token-transfer`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { TokenTransfer } from './token-transfer.class';
import hooks from './token-transfer.hooks';
import { GeneralError } from '@feathersjs/errors';
import { ethers } from 'ethers';
import processPendingTransaction from '../../middleware/processPendingTransaction';

// Add this service to the service type index
declare module '../../declarations' {
    interface ServiceTypes {
        'token-transfer': TokenTransfer & ServiceAddons<any>;
    }
}

export default function (app: Application): void {
    const privateKey =
        process.env.NODE_ENV !== 'production'
            ? //Hardhat Account 0 private key - for testing only, never use in production!
            'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
            : process.env.MINTER_PRIVATE_KEY ?? '';
    if (privateKey === undefined)
        throw new GeneralError('Please provide minter private key');

    const rpcUrl =
        process.env.NODE_ENV === 'production'
            ? process.env.ETH_RPC_URL
            : 'http://localhost:8545';

    const blockchainOptions = {
        provider: new ethers.providers.JsonRpcProvider(rpcUrl),
        minterPrivateKey: privateKey,
        chainId: process.env.NODE_ENV === 'production' ? '1' : '31337', // Either local Hardhat node or mainnet
    };

    app.use(
        '/token-transfer',
        new TokenTransfer(
            {
                paginate: app.get('paginate'),
            },
            app
        ),
        processPendingTransaction(blockchainOptions)
    );

    const service = app.service('token-transfer');

    service.hooks(hooks(blockchainOptions));
}

