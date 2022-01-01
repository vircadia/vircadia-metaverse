import { MongoClient, Db } from "mongodb";

import { AccountEntity } from "../../src/Entities/AccountEntity";
import { Accounts } from "../../src/Entities/Accounts";
import { Datab, setDB } from "../../src/Tools/Db";
import { Config, initializeConfiguration} from "../../src/config";

async function testDatab() {
    let connectUrl = process.env.CONNECT_URL;
    let dbName = process.env.DB_NAME;

    let baseClient = await MongoClient.connect(connectUrl, {
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
        timeOfLastHeartbeat: null,

    }
}

describe("Entities/Accounts - unit tests", () => {
    test("getAccountWithId returns null with invalid input", () => {
        testDatab()
        .then(() => {
            initializeConfiguration();
            return Accounts.getAccountWithId("").then(resp => {
                expect(resp).toBeNull();
            });
        });
    });

    test("getAccountWithId returns null with no inserted accounts", () => {
        testDatab()
        .then(() => {
            initializeConfiguration();
            return Accounts.getAccountWithId("id").then(resp => {
                expect(resp).toBeNull();
            });
        });
    });

    test("addAccount, then geting it by ID, then removing it", () => {
        testDatab()
        .then(() => {
            let acc_expected = mockAccount("test3");
            Accounts.addAccount(acc_expected)
            .then((acc) => {
                Accounts.getAccountWithId(acc.id)
                .then((fetched) => {
                    expect(fetched.username).toBe(acc_expected.username);
                    expect(fetched.email).toBe(acc_expected.email);

                    return Accounts.removeAccount(fetched).then(resp => {
                        expect(resp).toBe(true);
                    });
                })
            });
        });
    });
});
