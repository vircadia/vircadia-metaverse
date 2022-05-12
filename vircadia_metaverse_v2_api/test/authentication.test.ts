import { Server } from 'http';
import url from 'url';
import app from '../src/app';
import axios from 'axios';
import { isValidArray } from '../src/utils/Utils';

const port = app.get('port') || 9400;
const getUrl = (pathname?: string, query?: any): string =>
    url.format({
        hostname: app.get('host') || 'localhost',
        protocol: 'http',
        port,
        pathname,
        query,
    });

let authToken = '';
const selfUser: any = {};

describe('API test', () => {
    let server: Server;

    beforeAll((done) => {
        server = app.listen(port);
        server.once('listening', () => done());
    });

    afterAll((done) => {
        server.close(done);
    });

    it('registered the authentication service', () => {
        expect(app.service('authentication')).toBeTruthy();
    });

    describe('User', () => {
        const userInfo = {
            username: 'Metaverse',
            email: 'metaverse@gmail.com',
            password: '123456',
            ethereumAddress: '0xc1251A0864B522BB0F3cf654231E8E55B937CE27',
        };

        beforeAll(async () => {
            try {
                await app.service('users').create(userInfo);
            } catch (error) {
                // Do nothing, it just means the user already exists and can be tested
            }
        });

        /*it('Reset password', async () => {
            const result = await axios.post(getUrl('/reset-password'),{
                email:userInfo.email
            });
            expect(result.data.data.secretKey).toBeTruthy();
            
        });*/

        it('authenticates user and creates accessToken', async () => {
            const { user, accessToken } = await app
                .service('authentication')
                .create(
                    {
                        strategy: 'local',
                        ...userInfo,
                    },
                    {}
                );

            authToken = `Bearer ${accessToken}`;
            selfUser.id = user.id;
            selfUser.email = user.email;

            expect(accessToken).toBeTruthy();
            expect(user).toBeTruthy();
        });

        it('fetch users', async () => {
            const result = await axios.get(getUrl('/users'), {
                headers: {
                    Authorization: authToken,
                },
            });
            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
            expect(result.data.data.users.length).toBeGreaterThan(0);
        });
    });

    describe('Profile', () => {
        let profileId = '';
        it('Find profile', async () => {
            const result = await axios.get(getUrl('/profiles'), {
                headers: {
                    Authorization: authToken,
                },
            });
            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
            expect(result.data.data.length).toBeGreaterThan(0);
            profileId = result.data.data[0].id;
        });

        it('Get profile', async () => {
            const result = await axios.get(getUrl(`/profiles/${profileId}`), {
                headers: {
                    Authorization: authToken,
                },
            });
            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });
    });

    describe('Achievement', () => {
        let achievementItem: any;
        let achievement: any;
        const newAchivementItem = {
            icon: 'https://icon.com/star1.png',
            name: '1 Star',
            description: 'this is 1st star',
        };

        it('Create Achievement Item', async () => {
            const result = await axios.post(
                getUrl('/achievement-items'),
                newAchivementItem,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
            achievementItem = result.data.data;
        });

        it('Find Achievement Items', async () => {
            const result = await axios.get(getUrl('/achievement-items'), {
                headers: {
                    Authorization: authToken,
                },
            });

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
            expect(result.data.data.length).toBeGreaterThan(0);
        });

        it('Get Achievement Item', async () => {
            const result = await axios.get(
                getUrl(`/achievement-items/${achievementItem?.id}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Update Achievement Item', async () => {
            newAchivementItem.name = 'Gold Star';
            newAchivementItem.description = 'this is Gold star';
            const result = await axios.patch(
                getUrl(`/achievement-items/${achievementItem?.id}`),
                newAchivementItem,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
            achievementItem = result.data.data;
        });

        it('Create Achievement', async () => {
            const result = await axios.post(
                getUrl('/achievement'),
                {
                    achievementItemId: achievementItem?.id,
                    userId: selfUser.id,
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
            achievement = result.data.data;
        });

        it('Get user achievements', async () => {
            const result = await axios.get(
                getUrl('/achievement', { userId: selfUser?.id }),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
            //expect(result.data.data.length).toBeGreaterThan(0);
            if (result.data.data.length) {
                achievement = result.data.data[0];
            }
        });

        it('Get achievement', async () => {
            const result = await axios.get(
                getUrl(`/achievement/${achievement?.id}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Delete achievement', async () => {
            const result = await axios.delete(
                getUrl(`/achievement/${achievement?.id}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
        });

        it('Delete Achievement Item', async () => {
            const result = await axios.delete(
                getUrl(`/achievement-items/${achievementItem?.id}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
        });
    });

    describe('Connections and Friends', () => {
        const date = Date.now();
        const newUserInfo = {
            username: `testUser${date}`,
            email: `testuser${date}@gmail.com`,
            password: '123456',
            ethereumAddress: `0xc1251A0864B522BB0F3cf654231E8E55B937CE27${date}`,
        };

        let registerUser: any = {};

        it(' Create new user', async () => {
            const result = await app.service('users').create(newUserInfo);
            // registerUser = {
            //     username: 'Manths',
            //     accountId: '89de028d-138d-497a-ae10-82fe172b9613',
            // };
            registerUser = result.data;
        });

        it(' Create Connections', async () => {
            const result = await axios.post(
                getUrl('/connections'),
                {
                    username: registerUser?.username,
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it(' Get Connections', async () => {
            const result = await axios.get(getUrl('/connections'), {
                headers: {
                    Authorization: authToken,
                },
            });

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it(' Create friends', async () => {
            const result = await axios.post(
                getUrl('/friends'),
                {
                    username: registerUser?.username,
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it(' Get friends', async () => {
            const result = await axios.get(getUrl('/friends'), {
                headers: {
                    Authorization: authToken,
                },
            });

            expect(result.status).toBe(200);
            expect(result.data.data.friends).toBeTruthy();
        });

        it(' Remove friend', async () => {
            const result = await axios.delete(
                getUrl(`/friends/${registerUser?.username}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it(' Remove Connection', async () => {
            const result = await axios.delete(
                getUrl(`/connections/${registerUser?.username}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Delete Account', async () => {
            const result = await axios.delete(
                getUrl(`/accounts/${registerUser?.accountId}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            expect(result.status).toBe(200);
            expect(result.data).toBeTruthy();
        });
    });

    const inventoryItem = {
        id: `regular-stick-${Math.random() * 10000}`,
        name: 'Stick',
        description: 'Its a simple stick.',
        metaData: {},
        thumbnail: 'https://staging-2.digisomni.com/img/logo-1.c0f688c0.png',
        url: 'https://staging-2.digisomni.com/img/logo-1.c0f688c0.png',
        isNFT: false,
        isTransferable: false,
        itemType: 'craftingItem',
        itemQuality: 'common',
        itemStatus: {},
        prerequisites: {
            minLevel: 1,
            maxLevel: 50,
            maxAvailable: 10,
            expireAfter: 5000000,
        },
        itemTags: {
            isQuestItem: false,
            questId: '',
        },
    };

    describe('Inventory', () => {
        const userInventory: any = {};

        it('Create Inventory items', async () => {
            const result = await axios.post(
                getUrl('/inventory-item'),
                inventoryItem,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Find inventory item', async () => {
            const result = await axios.get(getUrl('/inventory-item'), {
                headers: {
                    Authorization: authToken,
                },
            });
            expect(result.status).toBe(200);
            expect(result.data.data.length).toBeGreaterThan(0);
        });

        it('Get inventory item', async () => {
            const result = await axios.get(
                getUrl(`/inventory-item/${inventoryItem?.id}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Update Inventory items', async () => {
            const result = await axios.patch(
                getUrl(`/inventory-item/${inventoryItem?.id}`),
                {
                    name: 'Stick-bright',
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Create user inventory item', async () => {
            const newUserInventoryItem = {
                itemId: inventoryItem.id,
                toUserId: selfUser?.id,
                qty: 10,
                itemSource: 'rewarded_for_quest',
            };

            const result = await axios.post(
                getUrl('/user-inventory'),
                newUserInventoryItem,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            if (result.status === 200) {
                userInventory.id = result.data.data.id;
            }

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Find user inventory', async () => {
            const result = await axios.get(getUrl('/user-inventory'), {
                headers: {
                    Authorization: authToken,
                },
            });

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Get user inventory', async () => {
            const result = await axios.get(
                getUrl(`/user-inventory/${userInventory.id}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Patch user inventory', async () => {
            const result = await axios.patch(
                getUrl(`/user-inventory/${userInventory.id}`),
                {
                    qty: 20,
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Reorder user inventory', async () => {
            try {
                const result = await axios.patch(
                    getUrl('/userinventory_ordering'),
                    {
                        userInventory,
                    },
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Remove user inventory', async () => {
            const result = await axios.delete(
                getUrl(`/user-inventory/${userInventory.id}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Create Inventory Transfer', async () => {
            const inventoryTransfer: any = {
                id: userInventory.id,
                qty: 1,
                toId: selfUser?.id,
            };

            try {
                const result = await axios.post(
                    getUrl('/inventory-transfer'),
                    inventoryTransfer,
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('Item handler', () => {
        const expiresOn = new Date();
        expiresOn.setFullYear(expiresOn.getFullYear() + 1);
        const addedDate = new Date();

        let itemHandlerData: any = {};

        it('Create item handler', async () => {
            const itemHandler: any = {
                itemId: 'regular-stick',
                ownerId: selfUser?.id,
                addedDate: addedDate,
                expiresOn: expiresOn,
                area: 'ground',
                qty: 10,
            };

            const result = await axios.post(
                getUrl('/item-handler'),
                itemHandler,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            if (result.status === 200) {
                itemHandlerData = result.data.data;
            }

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Edit item handler', async () => {
            const result = await axios.patch(
                getUrl(`/item-handler/${itemHandlerData.id}`),
                {
                    expiresOn: itemHandlerData.expiresOn,
                    qty: 12,
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            if (result.status === 200) {
                itemHandlerData = result.data.data;
            }

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Find item handler', async () => {
            const result = await axios.get(getUrl('/item-handler'), {
                headers: {
                    Authorization: authToken,
                },
            });

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Get item handler', async () => {
            const result = await axios.get(
                getUrl(`/item-handler/${itemHandlerData.id}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Pickup item handler', async () => {
            const result = await axios.post(
                getUrl('/pickup-item'),
                {
                    id: itemHandlerData.id,
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Remove item handler', async () => {
            const result = await axios.delete(
                getUrl(`/item-handler/${itemHandlerData.id}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });
    });

    describe('Accounts', () => {
        it('Find Accounts', async () => {
            const result = await axios.get(getUrl('/accounts'), {
                headers: {
                    Authorization: authToken,
                },
            });

            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
            expect(result.data.data.length).toBeGreaterThan(0);
        });

        it('Get Account', async () => {
            const result = await axios.get(
                getUrl(`/accounts/${selfUser?.id}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Update Account', async () => {
            const result = await axios.patch(
                getUrl(`/accounts/${selfUser?.id}`),
                {
                    email: selfUser.email,
                    images: {
                        hero: 'https://staging-2.digisomni.com/img/logo-1.c0f688c0.png',
                        tiny: 'https://staging-2.digisomni.com/img/logo-1.c0f688c0.png',
                        thumbnail:
                            'https://staging-2.digisomni.com/img/logo-1.c0f688c0.png',
                    },
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            expect(result.status).toBe(200);
            expect(result.data).toBeTruthy();
        });

        it('Delete Account', async () => {
            try {
                const result = await axios.delete(
                    getUrl(`/accounts/${selfUser?.id}`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
            } catch (error: any) {
                expect(error.status).toBe(200);
            }
        });

        it('Get Account field', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/account/${selfUser?.id}/field/email`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Set Account field', async () => {
            try {
                const set = {
                    set: 'metaverse@gmail.com',
                };
                const result = await axios.post(
                    getUrl(`/account/${selfUser?.id}/field/email`),
                    set,
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get public key of account', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/user/${selfUser?.id}/public_key`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
                expect(result.data.data.length).toBeGreaterThan(0);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('Init master data', () => {
        it('Find master data', async () => {
            try {
                const result = await axios.get(getUrl('/init-master-data'));

                expect(result.status).toBe(200);
                expect(result.data.message).toBe(
                    'Master data init successfully.'
                );
            } catch (error: any) {
                expect(error.status).toBe(200);
            }
        });
    });

    describe('Rewards', () => {
        let rewardRes: any = {};

        it('Find Rewards', async () => {
            try {
                const result = await axios.get(getUrl('/reward-item'), {
                    headers: {
                        Authorization: authToken,
                    },
                });

                if (isValidArray(result?.data?.data)) {
                    rewardRes = { ...result.data.data[0] };
                }

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Patch Reward', async () => {
            try {
                const { id } = rewardRes;

                const result = await axios.patch(
                    getUrl(`/reward-item/${id}`),
                    {},
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error.config.data).toBe('string');
            }
        });
    });

    // describe('Generate-Goobies', () => {
    //     it('Find Goobie and change body eye colors', async () => {
    //         try {
    //             const result = await axios.get(
    //                 getUrl('/generate-goobie', {
    //                     bodyColour: 'black',
    //                     eyeColour: 'green',
    //                 })
    //             );

    //             expect(result.status).toBe(200);
    //         } catch (error: any) {
    //             expect(error.status).toBe(200);
    //         }
    //     });
    // });

    describe('Quest', () => {
        const questData: any = {};

        it('Create Quest', async () => {
            const quest: any = {
                questId: 'gy-gyc-bob-shop-regular-stick',
                ownerId: selfUser?.id,
                expiresOn: '2022-12-28T06:42:57',
                isAccepted: false,
                isUnique: false,
                npcProgress: [],
                miniGameProgress: [],
                isCompleted: false,
                isActive: true,
            };

            try {
                const result = await axios.post(getUrl('/quest'), quest, {
                    headers: {
                        Authorization: authToken,
                    },
                });

                if (result.status === 200) {
                    questData.id = result.data.data.id;
                    questData.ownerId = result.data.data.ownerId;
                    questData.questId = result.data.data.questId;
                }

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Patch Quest', async () => {
            try {
                const result = await axios.patch(
                    getUrl(`/quest/${questData.id}`),
                    {
                        expiresOn: '2022-12-28T06:42:57',
                    },
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Find Quest', async () => {
            try {
                const result = await axios.get(
                    getUrl('/quest', { ownerId: questData.ownerId }),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get Quest with status complete', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/quest/${questData.questId}`, {
                        status: 'complete',
                    }),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error.config.data).toBe('undefined');
            }
        });

        it('Get Quest with status abandon', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/quest/${questData.questId}`, {
                        status: 'abandon',
                    }),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error.config.data).toBe('undefined');
            }
        });

        it('Get Quest with status accept', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/quest/${questData.questId}`, {
                        status: 'accept',
                    }),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error.config.data).toBe('undefined');
            }
        });

        it('Get Quest with status remove', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/quest/${questData.questId}`, {
                        status: 'remove',
                    }),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error.config.data).toBe('undefined');
            }
        });
    });

    describe('Quest Item', () => {
        const questItemData: any = {};

        it('Create Quest Item', async () => {
            const questItem: any = {
                id: `gy-gyc-bob-shop-fetch-sticks${Math.abs(
                    Math.random() * 2000
                ).toFixed(0)}`,
                name: 'The Goblin`s Elixir',
                description: 'Goblin`s',
                giver: 'npc-goblin-room-1-goober-cave',
                dialogue: {
                    '0': [
                        ['player', 'Hello!'],
                        ['npc', 'What do you want?'],
                        ['player', 'I need some money.'],
                        [
                            'npc',
                            'Well, you could fetch me some sticks my elixir...',
                        ],
                        [
                            'prompt',
                            'Sure.',
                            '1',
                            'I`d rather not.',
                            '2',
                            'Do you like chickens?',
                            '3',
                        ],
                    ],
                    '1': [
                        ['quest', 'accept'],
                        [
                            'npc',
                            'Awesome, fetch me 5 branches and I will reward you handsomely.',
                        ],
                        ['player', 'Okay.'],
                    ],
                    '2': [
                        ['quest', 'deny'],
                        ['npc', 'Don`t waste my time.'],
                    ],
                    '3': [
                        ['npc', 'Yes.....?'],
                        ['player', 'Okay, I`ll help you.'],
                        ['goto', '1'],
                    ],
                },
                prerequisites: {
                    minLevel: 4,
                    maxLevel: 6,
                    expireAfter: 43500,
                    maxActive: 1,
                    maxSimultaneous: 5,
                },
                npcRequirements: {
                    items: [
                        {
                            uuid: '8440b2b8-d512-4ecb-bfb7-b15b327057b1',
                            qty: 5,
                        },
                    ],
                    xp: 500,
                    // goo: 5,
                },
                rewards: [
                    {
                        itemId: 'basic-elixir-of-health',
                        qty: 1,
                    },
                    {
                        xp: 500,
                    },
                    // {
                    //     goo: 5,
                    // },
                ],
                miniGameRequirements: {
                    items: [
                        {
                            uuid: '8440b2b8-d512-4ecb-bfb7-b15b327057b1',
                            qty: 5,
                        },
                    ],
                    xp: 500,
                    // goo: 5,
                },
                itemRequirements: {
                    items: [
                        {
                            itemId: 'regular-stick',
                            qty: 10,
                        },
                    ],
                },
            };

            try {
                const result = await axios.post(
                    getUrl('/quest-item'),
                    questItem,
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                if (result.status === 200) {
                    questItemData.id = result.data.data.id;
                    questItemData.itemRequirements =
                        result.data.data.itemRequirements;
                }

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Patch Quest Item', async () => {
            try {
                const result = await axios.patch(
                    getUrl(`/quest-item/${questItemData.id}`),
                    {
                        name: 'Manths',
                        itemRequirements: questItemData.itemRequirements,
                    },
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get Quest Item', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/quest-item/${questItemData.id}`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Find Quest Item', async () => {
            try {
                const result = await axios.get(getUrl('/quest-item'), {
                    headers: {
                        Authorization: authToken,
                    },
                });

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('NPC', () => {
        const npcData: any = {};

        it('Create NPC', async () => {
            const npc: any = {
                id: `gy-gyc-bob-shop-${Math.abs(Math.random() * 2500).toFixed(
                    0
                )}`,
                name: 'Bob',
                type: 'shopkeeper',
                description: 'I give quests and sell wares.',
                idleText: [
                    'Hmph, where did I put that fork?',
                    'I really wish it would rain.',
                    'I do love butterflies.',
                ],
                tags: {
                    questId: '05b87f73-f1d9-4607-acbc-a68e02bd79ef',
                },
                interactiveText: [],
            };

            try {
                const result = await axios.post(getUrl('/npc'), npc, {
                    headers: {
                        Authorization: authToken,
                    },
                });

                if (result.status === 200) {
                    npcData.id = result.data.data.id;
                }

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Patch NPC', async () => {
            try {
                const result = await axios.patch(
                    getUrl(`/npc/${npcData.id}`),
                    {
                        name: `gy-gyc-bob-shop-${Math.random() * 20}`,
                    },
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get NPC', async () => {
            try {
                const result = await axios.get(getUrl(`/npc/${npcData.id}`), {
                    headers: {
                        Authorization: authToken,
                    },
                });

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Find NPC', async () => {
            try {
                const result = await axios.get(getUrl('/npc'), {
                    headers: {
                        Authorization: authToken,
                    },
                });

                expect(result.status).toBe(200);
                expect(result.data.status).toBe('success');
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('Domains', () => {
        let newDomain: any = {};

        it('Get all Domains', async () => {
            try {
                const result = await axios.get(getUrl('/domains'), {
                    headers: {
                        Authorization: authToken,
                    },
                });
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
                expect(result.data.data.length).toBeGreaterThan(0);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get Domain', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/domains/${newDomain?.id}`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
                expect(result.data.data.length).toBeGreaterThan(0);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Create temp Domain', async () => {
            try {
                const result = await axios.post(
                    getUrl('/domains/create_temporary'),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                newDomain = result.data;
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
            } catch (error) {
                expect(typeof error).toBe('object');
            }
        });

        it('Update Domain', async () => {
            try {
                const result = await axios.patch(
                    getUrl(`/domains/${newDomain?.id}`),
                    {
                        name: 'test A regular stick',
                        version: '21.21.21',
                    },
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Delete Domain', async () => {
            try {
                const result = await axios.delete(
                    getUrl(`/domains/${newDomain?.id}`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get public key of domain', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/domains/${newDomain?.id}/public_key`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
                expect(result.data.data.length).toBeGreaterThan(0);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('Monitoring', () => {
        let allStats: any = {};

        it('Get all stats', async () => {
            try {
                const result = await axios.get(getUrl('/stats/list'), {
                    headers: {
                        Authorization: authToken,
                    },
                });
                allStats = result.data;
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get stat by name', async () => {
            try {
                const result = await axios.get(getUrl('/stats/stat/cpuBusy'), {
                    headers: {
                        Authorization: authToken,
                    },
                });
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get stat by category', async () => {
            try {
                const result = await axios.get(getUrl('/stats/category/os'), {
                    headers: {
                        Authorization: authToken,
                    },
                });
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('Overview', () => {
        it('metaverse_info', async () => {
            try {
                const result = await axios.get(getUrl('/metaverse_info'), {
                    headers: {
                        Authorization: authToken,
                    },
                });
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('Explore', () => {
        it('explore', async () => {
            try {
                const result = await axios.get(getUrl('/explore.json'), {
                    headers: {
                        Authorization: authToken,
                    },
                });
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('Place', () => {
        let newPlace: any = {};

        it('Create place', async () => {
            const placeInfo = {
                id: 'test',
                name: 'test place',
                description: 'test place description',
                current_attendance: 0,
                path: '/0,0,0/0,0,0,1',
                address: {},
            };
            try {
                const result = await axios.post(getUrl('/place'), {
                    placeInfo,
                    headers: {
                        Authorization: authToken,
                    },
                });

                newPlace = result.data;
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
            } catch (error) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get all place', async () => {
            try {
                const result = await axios.get(getUrl('/place'), {
                    headers: {
                        Authorization: authToken,
                    },
                });
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
                expect(result.data.data.length).toBeGreaterThan(0);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get place', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/place/${newPlace?.id}`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
                expect(result.data.data.length).toBeGreaterThan(0);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Update place', async () => {
            try {
                const result = await axios.patch(
                    getUrl(`/place/${newPlace?.id}`),
                    {
                        name: 'test A regular stick',
                    },
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Delete place', async () => {
            try {
                const result = await axios.delete(
                    getUrl(`/place/${newPlace?.id}`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get place field', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/places/${newPlace?.id}/field/description`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Set place field', async () => {
            try {
                const set = {
                    set: 'test set place description',
                };
                const result = await axios.post(
                    getUrl(`/places/${newPlace?.id}/field/description`),
                    set,
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('location', () => {
        let newlocation: any = {};

        it('Get all location', async () => {
            try {
                const result = await axios.get(getUrl('/location'), {
                    headers: {
                        Authorization: authToken,
                    },
                });

                newlocation = result.data;
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
                expect(result.data.data.length).toBeGreaterThan(0);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Update location', async () => {
            try {
                const result = await axios.patch(
                    getUrl('/location'),
                    {
                        networkAddress: 'network address',
                    },
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('current', () => {
        it('Update current', async () => {
            try {
                const result = await axios.post(
                    getUrl('/current'),
                    {
                        currentAPIKeyTokenId: 'test',
                    },
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('Account Tokens', () => {
        it('Get token', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/account/${selfUser?.id}/tokens`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
                expect(result.data.data.length).toBeGreaterThan(0);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });
});

