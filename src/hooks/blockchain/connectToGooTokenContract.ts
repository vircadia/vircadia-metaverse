import { TOKEN_NAME } from './../../services/token-transfer/token-transfer.class';
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

import { Hook, HookContext } from '@feathersjs/feathers';
import { ethers } from 'ethers';
import { GeneralError } from '@feathersjs/errors';
import { TDeployedHardhatContractsJson } from './../../../ethereum/dlt/interfaces/contractTypes';
import deployedContracts from './../../../ethereum/dlt/hardhat_contracts.json';
import { IsNullOrEmpty } from '../../utils/Misc';
import { VircadiaERC20 } from './../../../ethereum/dlt/typechain/VircadiaERC20'
import { BlockchainOptions } from './../../services/token-transfer/token-transfer.class';

// Connects to the deployed ERC20 token contract and passes it to service or subsequent hooks
export default (options: BlockchainOptions): Hook => {
    let wallet: ethers.Wallet;
    let gooToken: VircadiaERC20;

    if (IsNullOrEmpty(options.minterPrivateKey)) {
        throw new GeneralError('Private key cannot be empty');
    } else if (IsNullOrEmpty(options.chainId)) {
        throw new GeneralError('chainId cannot be empty');
    } else {
        wallet = new ethers.Wallet(
            options.minterPrivateKey ?? '',
            options.provider
        );
        const contracts =
            deployedContracts as unknown as TDeployedHardhatContractsJson;
        gooToken = new ethers.Contract(
            contracts[options.chainId][0].contracts[TOKEN_NAME].address,
            contracts[options.chainId][0].contracts[TOKEN_NAME]
                .abi as ethers.ContractInterface,
            wallet
        ) as VircadiaERC20;
    }

    return async (context: HookContext): Promise<HookContext> => {
        context.params.tokenContract = gooToken;

        return context;
    };
};

