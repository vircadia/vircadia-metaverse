import { MongoClient } from "mongodb";

import { AccountEntity } from "../../src/Entities/AccountEntity";
import { Accounts } from "../../src/Entities/Accounts";
import { setDB } from "../../src/Tools/Db";

async function testDatab() {
    const connectUrl = process.env.CONNECT_URL;
    const dbName = process.env.DB_NAME;

    const baseClient = await MongoClient.connect(connectUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    setDB(baseClient.db(dbName));
}

function mockAccount(user: string): AccountEntity {
    return {
        id: "id",
        username: user,
        email: user + "@test.com",
        accountSettings: null,
        imagesHero: null,
        imagesThumbnail: null,
        imagesTiny: null,

        locationConnected: null,
        locationPath: null,
        locationPlaceId: null,
        locationDomainId: null,
        locationNetworkAddress: null,
        locationNetworkPort: null,
        locationNodeId: null,
        availability: null,

        connections: null,
        friends: null,
        locker: null,
        profileDetail: null,

        passwordHash: null,
        passwordSalt: null,
        sessionPublicKey: null,
        accountEmailVerified: true,

        xmppPassword: null,
        discourseApiKey: null,
        walletId: null,

        roles: null,
        IPAddrOfCreator: null,
        whenCreated: null,
        timeOfLastHeartbeat: null

    };
}

describe("Entities/Accounts - unit tests", () => {
    test("getAccountWithId returns null with invalid input", () => {
        testDatab()
            .then(() => {
                return Accounts.getAccountWithId("").then((resp) => {
                    expect(resp).toBeNull();
                });
            });
    });

    test("getAccountWithId returns null with no inserted accounts", () => {
        testDatab()
            .then(() => {
                return Accounts.getAccountWithId("id").then((resp) => {
                    expect(resp).toBeNull();
                });
            });
    });

    test("addAccount, then geting it by ID, then removing it", () => {
        testDatab()
            .then(() => {
                const accExpected = mockAccount("test3");
                Accounts.addAccount(accExpected)
                    .then((acc) => {
                        Accounts.getAccountWithId(acc.id)
                            .then((fetched) => {
                                expect(fetched.username).toBe(accExpected.username);
                                expect(fetched.email).toBe(accExpected.email);

                                return Accounts.removeAccount(fetched).then((resp) => {
                                    expect(resp).toBe(true);
                                });
                            });
                    });
            });
    });
});
