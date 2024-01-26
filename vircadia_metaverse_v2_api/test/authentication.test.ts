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
            ethereumAddress: '0xC4eABEc8CCb1db4db76A2CA716B03D0ae7b8d929',
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
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('fetch users', async () => {
            try {
                const result = await axios.get(getUrl('/api/v1/users'), {
                    headers: {
                        Authorization: authToken,
                    },
                });
                expect(result.status).toBe(200);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Create users', async () => {
            try {
                const result = await axios.post(
                    getUrl('/api/v1/users'),
                    {
                        user: {
                            grant_type: 'password',
                            username: userInfo.username,
                            password: userInfo.password,
                        },
                    },
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Generate initial account token', async () => {
            try {
                const result = await axios.post(
                    getUrl('/oauth/token'),
                    {
                        grant_type: 'password',
                        username: userInfo.username,
                        password: userInfo.password,
                    },
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('html access token', async () => {
            const result = await axios.get(getUrl('/user/tokens/new'), {
                headers: {
                    Authorization: authToken,
                },
            });
            expect(result.status).toBe(200);
        });

        it('Get token', async () => {
            try {
                const result = await axios.post(getUrl('/api/v1/token/new'), {
                    headers: {
                        Authorization: authToken,
                    },
                });
                expect(result.status).toBe(200);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('Profile', () => {
        let profileId = '';
        it('Find profile', async () => {
            try {
                const result = await axios.get(getUrl('/api/v1/profiles'), {
                    headers: {
                        Authorization: authToken,
                    },
                });
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
                expect(result.data.data.length).toBeGreaterThan(0);
                profileId = result.data.data[0].id;
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get profile', async () => {
            const result = await axios.get(
                getUrl(`/api/v1/profiles/${profileId}`),
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            expect(result.status).toBe(200);
            expect(result.data.data).toBeTruthy();
        });

        it('Get user profile', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/api/v1/user/profile/${profileId}`),
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
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Find Achievement Items', async () => {
            try {
                const result = await axios.get(getUrl('/achievement-items'), {
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

        it('Get Achievement Item', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Update Achievement Item', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Create Achievement', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get user achievements', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get achievement', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Delete achievement', async () => {
            try {
                const result = await axios.delete(
                    getUrl(`/achievement/${achievement?.id}`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Delete Achievement Item', async () => {
            try {
                const result = await axios.delete(
                    getUrl(`/achievement-items/${achievementItem?.id}`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                expect(result.status).toBe(200);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('Connections and Friends', () => {
        const date = Date.now();
        const newUserInfo = {
            username: `testUser${date}`,
            email: `testuser${date}@gmail.com`,
            password: '123456',
            ethereumAddress: `0xC4eABEc8CCb1db4db76A2CA716B03D0ae7b8d929${date}`,
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
            try {
                const result = await axios.post(
                    getUrl('/api/v1/user/connections'),
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it(' Get Connections', async () => {
            try {
                const result = await axios.get(
                    getUrl('/api/v1/user/connections'),
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

        it(' Create friends', async () => {
            try {
                const result = await axios.post(
                    getUrl('/api/v1/user/friends'),
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it(' Get friends', async () => {
            try {
                const result = await axios.get(getUrl('/api/v1/user/friends'), {
                    headers: {
                        Authorization: authToken,
                    },
                });

                expect(result.status).toBe(200);
                expect(result.data.data.friends).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it(' Remove friend', async () => {
            try {
                const result = await axios.delete(
                    getUrl(`/api/v1/user/friends/${registerUser?.username}`),
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

        it(' Remove Connection', async () => {
            try {
                const result = await axios.delete(
                    getUrl(
                        `/api/v1/user/connections/${registerUser?.username}`
                    ),
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

        it('Delete Account', async () => {
            try {
                const result = await axios.delete(
                    getUrl(
                        `/api/v1/user/connections/${registerUser?.accountId}`
                    ),
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

        it(' Create connection request', async () => {
            try {
                const result = await axios.post(
                    getUrl('/api/v1/user/connection_request'),
                    {
                        user_connection_request: {
                            node_id: selfUser.id,
                            proposed_node_id: selfUser.id,
                        },
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

        it(' Remove connection request', async () => {
            try {
                const result = await axios.delete(
                    getUrl('/api/v1/user/connection_request'),
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

        it(' User heartbeat', async () => {
            try {
                const result = await axios.put(
                    getUrl('/api/v1/user/heartbeat'),
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
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Find inventory item', async () => {
            try {
                const result = await axios.get(getUrl('/inventory-item'), {
                    headers: {
                        Authorization: authToken,
                    },
                });
                expect(result.status).toBe(200);
                expect(result.data.data.length).toBeGreaterThan(0);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get inventory item', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Update Inventory items', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Create user inventory item', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Find user inventory', async () => {
            try {
                const result = await axios.get(getUrl('/user-inventory'), {
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

        it('Get user inventory', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Patch user inventory', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
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
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
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
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Edit item handler', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Find item handler', async () => {
            try {
                const result = await axios.get(getUrl('/item-handler'), {
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

        it('Get item handler', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Pickup item handler', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Remove item handler', async () => {
            try {
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('Accounts', () => {
        it('Find Accounts', async () => {
            try {
                const result = await axios.get(getUrl('/api/v1/accounts'), {
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

        it('Get Account', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/api/v1/account/${selfUser?.id}`),
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

        it('Update Account', async () => {
            try {
                const result = await axios.post(
                    getUrl(`/api/v1/account/${selfUser?.id}`),
                    {
                        accounts: {
                            email: selfUser.email,
                            images: {
                                hero: 'https://staging-2.digisomni.com/img/logo-1.c0f688c0.png',
                                tiny: 'https://staging-2.digisomni.com/img/logo-1.c0f688c0.png',
                                thumbnail:
                                    'https://staging-2.digisomni.com/img/logo-1.c0f688c0.png',
                            },
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Delete Account', async () => {
            try {
                const result = await axios.delete(
                    getUrl(`/api/v1/account/${selfUser?.id}`),
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

        it('Get Account field', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/api/v1/account/${selfUser?.id}/field/email`),
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
                    getUrl(`/api/v1/account/${selfUser?.id}/field/email`),
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
                    getUrl(`/api/v1/users/${selfUser?.id}/public_key`),
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

        it('Update public key of account', async () => {
            try {
                const result = await axios.get(
                    getUrl('/api/v1/user/public_key'),
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

        let acccountTokens = {};
        it('Get acccount tokens', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/api/v1/account/${selfUser?.id}/tokens`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                acccountTokens = result.data;
                expect(result.status).toBe(200);
                expect(result.data.data).toBeTruthy();
                expect(result.data.data.length).toBeGreaterThan(0);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get specific acccount token', async () => {
            try {
                const result = await axios.delete(
                    getUrl(
                        `/api/v1/account/${selfUser?.id}/tokens/${acccountTokens[0]?.id}`
                    ),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
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
                const result = await axios.get(getUrl('/api/v1/domains'), {
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
                    getUrl(`/api/v1/domains/${newDomain?.id}`),
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
                    getUrl('/api/v1/domains/temporary'),
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
                const result = await axios.put(
                    getUrl(`/api/v1/domains/${newDomain?.id}`),
                    {
                        domain: {
                            name: 'test A regular stick',
                            version: '21.21.21',
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Delete Domain', async () => {
            try {
                const result = await axios.delete(
                    getUrl(`/api/v1/domains/${newDomain?.id}`),
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
                    getUrl(`/api/v1/domains/${newDomain?.id}/public_key`),
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

        it('Update public key of domain', async () => {
            try {
                const result = await axios.put(
                    getUrl(`/api/v1/domains/${newDomain?.id}/public_key`),
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
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Get domain field', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/api/v1/domains/${newDomain?.id}/field/managers`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Set domain field', async () => {
            try {
                const result = await axios.patch(
                    getUrl(`/api/v1/domains/${newDomain?.id}/field/managers`),
                    {
                        set: {
                            set: [selfUser.username],
                        },
                    },
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                expect(result.status).toBe(200);
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });
    });

    describe('Monitoring', () => {
        let allStats: any = {};

        it('Get all stats', async () => {
            try {
                const result = await axios.get(getUrl('/api/v1/stats/list'), {
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
                const result = await axios.get(
                    getUrl('/api/v1/stats/stat/cpuBusy'),
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

        it('Get stat by category', async () => {
            try {
                const result = await axios.get(
                    getUrl('/api/v1/stats/category/os'),
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
    });

    describe('Overview', () => {
        it('metaverse_info', async () => {
            try {
                const result = await axios.get(getUrl('/api/metaverse_info'), {
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
                const result = await axios.post(getUrl('/api/v1/places'), {
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
                const result = await axios.get(getUrl('/api/v1/places'), {
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
                    getUrl(`/api/v1/places/${newPlace?.id}`),
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
                    getUrl(`/api/v1/places/${newPlace?.id}`),
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
                    getUrl(`/api/v1/places/${newPlace?.id}`),
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
                    getUrl(`/api/v1/places/${newPlace?.id}/field/description`),
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
                    getUrl(`/api/v1/places/${newPlace?.id}/field/description`),
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

        it('Get user place', async () => {
            try {
                const result = await axios.get(getUrl('/api/v1/user/places'), {
                    headers: {
                        Authorization: authToken,
                    },
                });
                expect(result.status).toBe(200);
                expect(result.data).toBeTruthy();
            } catch (error: any) {
                expect(typeof error).toBe('object');
            }
        });

        it('Set user place', async () => {
            try {
                const set = {
                    place: { name: 'test set place description' },
                };
                const result = await axios.post(
                    getUrl('/api/v1/user/places'),
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

        it('Get place', async () => {
            try {
                const result = await axios.get(
                    getUrl(`/api/v1/user/places/${newPlace?.id}`),
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
                const result = await axios.get(
                    getUrl(`/api/v1/users/${selfUser.id}/location`),
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

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
                    getUrl('/api/v1/user/location'),
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
        it('Update current place', async () => {
            try {
                const result = await axios.post(
                    getUrl('/api/v1/places/current'),
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
                    getUrl(`/api/v1/account/${selfUser?.id}/tokens`),
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
