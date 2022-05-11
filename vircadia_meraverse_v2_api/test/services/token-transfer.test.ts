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

import app from '../../src/app';
import config from '../../src/appconfig';
import assert from 'assert';
import { Db, InsertOneResult } from 'mongodb';
import { BigNumber, ethers } from 'ethers';
import { GooERC20 } from '../../blockchain/typechain/GooERC20.d';
import deployedContracts from '../../blockchain/hardhat_contracts.json';
import { TDeployedHardhatContractsJson } from '../../blockchain/interfaces/contractTypes';
import processPendingTransaction from '../../src/middleware/processPendingTransaction';
import { TOKEN_NAME } from './../../src/services/token-transfer/token-transfer.class';

describe('\'token-transfer\' service', () => {
    let insertedBalance: InsertOneResult;
    const HARDHAT_CHAIN_ID = '31337';
    const HARDHAT_PRIVATE_KEY =
        'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

    let wallet: ethers.Wallet;
    let provider: ethers.providers.Provider;
    let gooToken: GooERC20;

    let db: Db;

    beforeAll((done) => {
        provider = new ethers.providers.JsonRpcProvider(
            'http://localhost:8545'
        );
        wallet = new ethers.Wallet(HARDHAT_PRIVATE_KEY, provider);

        const contracts =
            deployedContracts as unknown as TDeployedHardhatContractsJson;
        gooToken = new ethers.Contract(
            contracts[HARDHAT_CHAIN_ID][0].contracts[TOKEN_NAME].address,
            contracts[HARDHAT_CHAIN_ID][0].contracts[TOKEN_NAME]
                .abi as ethers.ContractInterface,
            wallet
        ) as GooERC20;

        app.get('mongoClient').then((database) => {
            db = database;
            db.collection(config.dbCollections.tokenBalances).insertOne(
                {
                    balance: 1000,
                },
                function (err, res) {
                    if (err) throw err;
                    insertedBalance = res;
                    done();
                }
            );
        });
    });

    afterAll((done) => {
        app.get('mongoClient').then((database) => {
            db = database;
            db.collection(config.dbCollections.tokenBalances)
                .drop()
                .then(() => {
                    db.collection(config.dbCollections.blockchainTransactions)
                        .drop()
                        .then(() => done());
                });
        });
    });

    it('registered the service', () => {
        const service = app.service('token-transfer');
        expect(service).toBeTruthy();
    });

    it('fails on requesting wrong user balance', async () => {
        const params = {
            user: {
                id: 'nonexistinguserbalance',
                //2nd Hardhat account
                ethereumAddress: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
            },
        };

        const requestBody = { action: 'withdrawal', amount: 999 };
        const response = await app
            .service('token-transfer')
            .create(requestBody, params);

        // Verify successful minting
        assert.equal(response.status, 'failure');
        assert.equal(
            response.message,
            'No record found for id \'nonexistinguserbalance\''
        );
    });

    it('fails on empty Ethereum address', async () => {
        const params = {
            user: {
                id: 'nonexistinguserbalance',
                //2nd Hardhat account
                ethereumAddress: '',
            },
        };

        const requestBody = { action: 'withdrawal', amount: 999 };
        const response = await app
            .service('token-transfer')
            .create(requestBody, params);

        // Verify successful minting
        assert.equal(response.status, 'failure');
        assert.equal(
            response.message,
            'The user does not have Ethereum address associated'
        );
    });

    it('mints tokens upon withdrawal', async () => {
        const params = {
            user: {
                id: insertedBalance.insertedId,
                //2nd Hardhat account
                ethereumAddress: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
            },
        };

        const requestBody = { action: 'withdrawal', amount: 999 };
        const response = await app
            .service('token-transfer')
            .create(requestBody, params);

        const postMintBalance = await db
            .collection(config.dbCollections.tokenBalances)
            .findOne(insertedBalance.insertedId);
        // Verify balance
        assert.equal(postMintBalance.balance, 1);

        // Verify successful minting
        assert.equal(response.status, 'success');

        const filter = gooToken.filters.Transfer(
            ethers.constants.AddressZero,
            '0x70997970c51812dc3a010c7d01b50e0d17dc79c8'
        );

        const events = await gooToken.queryFilter(filter);

        assert.equal(
            response.data.transactionHash,
            events[events.length - 1].transactionHash
        );

        const processPendingTransactionMiddleware = processPendingTransaction({
            provider: provider,
            minterPrivateKey: HARDHAT_PRIVATE_KEY,
            chainId: HARDHAT_CHAIN_ID,
        });

        return new Promise((resolve) => {
            processPendingTransactionMiddleware(
                { body: requestBody },
                { hook: { params: params, app: app }, data: response },
                async function next() {
                    //Wait for the blockchain transaction to be mined and DB record to be patched
                    await new Promise((r) => setTimeout(r, 500));
                    const query = {
                        txHash: events[events.length - 1].transactionHash,
                    };
                    const blockchainTransaction = await db
                        .collection(config.dbCollections.blockchainTransactions)
                        .find(query)
                        .toArray();
                    //Verify transaction recorded
                    assert.equal(blockchainTransaction[0].status, 'success');
                    assert.equal(
                        blockchainTransaction[0].userId.id.toString(),
                        insertedBalance.insertedId.id.toString()
                    );
                    assert.equal(blockchainTransaction[0].action, 'withdrawal');
                    resolve(true);
                }
            );
        });
    });

    it('fails to mint tokens if amount exceeds available balance', async () => {
        const params = {
            user: {
                id: insertedBalance.insertedId,
                //2nd Hardhat account
                ethereumAddress: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
            },
        };
        const query = {
            _id: insertedBalance.insertedId,
        };
        //Reset balance
        await db
            .collection(config.dbCollections.tokenBalances)
            .updateOne(query, { $set: { balance: 1000 } });
        const response = await app
            .service('token-transfer')
            .create({ action: 'withdrawal', amount: 99999 }, params);

        // Verify failure
        assert.equal(response.status, 'failure');
        assert.equal(
            response.message,
            'The amount exceeds available game balance'
        );
        const postMintBalance = await db
            .collection(config.dbCollections.tokenBalances)
            .findOne(insertedBalance.insertedId);
        // Verify balance didn't change
        assert.equal(postMintBalance.balance, 1000);
    });

    it('rolls back balance upon unsuccessful transaction', async () => {
        const params = {
            user: {
                id: insertedBalance.insertedId,
                //2nd Hardhat account
                ethereumAddress: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
            },
        };

        const requestBody = { action: 'withdrawal', amount: 999 };
        const response = await app
            .service('token-transfer')
            .create(requestBody, params);

        const postMintBalance = await db
            .collection(config.dbCollections.tokenBalances)
            .findOne(insertedBalance.insertedId);
        // Verify balance
        assert.equal(postMintBalance.balance, 1);

        // Verify that minting transaction was successfully sent
        assert.equal(response.status, 'success');

        const filter = gooToken.filters.Transfer(
            ethers.constants.AddressZero,
            '0x70997970c51812dc3a010c7d01b50e0d17dc79c8'
        );

        const events = await gooToken.queryFilter(filter);

        assert.equal(
            response.data.transactionHash,
            events[events.length - 1].transactionHash
        );

        const tx = await provider.getTransaction(response.data.transactionHash);
        //Mock provider
        const spyOnProvider = jest
            .spyOn(provider, 'getTransaction')
            .mockImplementation(
                () =>
                    new Promise((resolve) => {
                        //Mock transaction
                        const spyOnTransaction = jest
                            .spyOn(tx, 'wait')
                            .mockImplementation(
                                //Mock failed transaction
                                () =>
                                    new Promise((resolve) => {
                                        resolve({
                                            to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
                                            from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                                            contractAddress: null,
                                            transactionIndex: 0,
                                            gasUsed: BigNumber.from(0),
                                            logsBloom:
                                                '0x00000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000840020000000000000000000800000000000000000000000010000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000042000000000000000000000000000000000000000000000000000020000000000000000000000000000000000001000000000000000000000000000000',
                                            blockHash:
                                                '0xed7514556483989787c541a2825c55ed334a389c5270e8b3b2e6d4ec73c47ccb',
                                            transactionHash:
                                                '0x3ea8c3411f6ce3459c855a3ec4e5326decfa572f23d5dcb8eb77940643cb129e',
                                            logs: [],
                                            blockNumber: 30,
                                            confirmations: 1,
                                            cumulativeGasUsed:
                                                BigNumber.from(0),
                                            effectiveGasPrice:
                                                BigNumber.from(0),
                                            //Returning 0 to indicate a failed transaction
                                            status: 0,
                                            type: 2,
                                            byzantium: true,
                                        });
                                    })
                            );
                        resolve(tx);
                    })
            );

        const processPendingTransactionMiddleware = processPendingTransaction({
            provider: provider,
            minterPrivateKey: HARDHAT_PRIVATE_KEY,
            chainId: HARDHAT_CHAIN_ID,
        });

        return new Promise((resolve) => {
            processPendingTransactionMiddleware(
                { body: requestBody },
                { hook: { params: params, app: app }, data: response },
                async function next() {
                    //Wait for the blockchain transaction to be mined and DB record to be patched
                    await new Promise((r) => setTimeout(r, 500));
                    const query = {
                        txHash: events[events.length - 1].transactionHash,
                    };
                    const blockchainTransaction = await db
                        .collection(config.dbCollections.blockchainTransactions)
                        .find(query)
                        .toArray();
                    //Verify transaction recorded
                    assert.equal(blockchainTransaction[0].status, 'failure');
                    assert.equal(
                        blockchainTransaction[0].userId.id.toString(),
                        insertedBalance.insertedId.id.toString()
                    );
                    assert.equal(blockchainTransaction[0].action, 'withdrawal');
                    const postMiddlewareBalance = await db
                        .collection(config.dbCollections.tokenBalances)
                        .findOne(insertedBalance.insertedId);
                    // Verify balance restored
                    assert.equal(postMiddlewareBalance.balance, 1000);
                    spyOnProvider.mockReset();
                    spyOnProvider.mockRestore();
                    resolve(true);
                }
            );
        });
    });
});

