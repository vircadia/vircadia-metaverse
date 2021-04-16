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
'use strict'

import { Config } from '@Base/config';

import crypto from 'crypto';

import { AccountEntity } from '@Entities/AccountEntity';
import { accountFields, CheckAccountFields } from '@Entities/AccountFields';

import { Domains } from '@Entities/Domains';
import { Roles } from '@Entities/Sets/Roles';
import { Places } from '@Entities/Places';
import { Tokens } from '@Entities/Tokens';
import { AuthToken } from '@Entities/AuthToken';

import { CriteriaFilter } from '@Entities/EntityFilters/CriteriaFilter';
import { GenericFilter } from '@Entities/EntityFilters/GenericFilter';

import { ValidateResponse } from '@Route-Tools/EntityFieldDefn';
import { getEntityField, setEntityField, getEntityUpdateForField } from '@Route-Tools/GetterSetter';

import { createObject, getObject, getObjects, updateObjectFields, deleteOne, noCaseCollation, countObjects } from '@Tools/Db';
import { GenUUID, genRandomString, IsNullOrEmpty, IsNotNullOrEmpty, SendVerificationEmail } from '@Tools/Misc';
import { VKeyedCollection, SArray } from '@Tools/vTypes';
import { Logger } from '@Tools/Logging';
import { Requests } from './Requests';

export let accountCollection = 'accounts';

// Initialize account management.
export function initAccounts(): void {
    // Validate the fields have been initialized
    CheckAccountFields();
};

export const Accounts = {
    async getAccountWithId(pAccountId: string): Promise<AccountEntity> {
        return IsNullOrEmpty(pAccountId) ? null : getObject(accountCollection,
                        new GenericFilter({ 'id': pAccountId }));
    },
    async getAccountWithAuthToken(pAuthToken: string): Promise<AccountEntity> {
        if (IsNotNullOrEmpty(pAuthToken)) {
            try {
                const tokenInfo = await Tokens.getTokenWithToken(pAuthToken);
                if (IsNotNullOrEmpty(tokenInfo)) {
                    return Accounts.getAccountWithId(tokenInfo.accountId);
                };
            }
            catch (err) {
                throw err;
            };
        };
        return null;
    },
    async getAccountWithUsername(pUsername: string): Promise<AccountEntity> {
        if (IsNotNullOrEmpty(pUsername)) {
            // build username query with case-insensitive Regex.
            // When indexes are added, create a 'username' case-insensitive index.
            // Need to clean the username of search characters since we're just passing it to the database
            return getObject(accountCollection,
                        new GenericFilter({ 'username': pUsername }), noCaseCollation );
                // { 'username': new RegExp(['^', pUsername.replace('[\\\*]', ''), '$'].join(''), 'i') } );
        };
        return null;
    },
    async getAccountWithNodeId(pNodeId: string): Promise<AccountEntity> {
        return IsNullOrEmpty(pNodeId) ? null : getObject(accountCollection,
                        new GenericFilter({ 'locationNodeid': pNodeId }));
    },
    async getAccountWithEmail(email: string): Promise<AccountEntity> {
        return IsNullOrEmpty(email) ? null : getObject(accountCollection,
                        new GenericFilter({ 'email': email }), noCaseCollation );
    },
    async addAccount(pAccountEntity: AccountEntity) : Promise<AccountEntity> {
        Logger.info(`Accounts: creating account ${pAccountEntity.username}, id=${pAccountEntity.id}`);
        return createObject(accountCollection, pAccountEntity);
    },
    async removeAccount(pAccountEntity: AccountEntity) : Promise<boolean> {
        Logger.info(`Accounts: removing account ${pAccountEntity.username}, id=${pAccountEntity.id}`);
        return deleteOne(accountCollection, new GenericFilter({ 'id': pAccountEntity.id }) );
    },
    async removeAccountContext(pAccountEntity: AccountEntity) : Promise<void> {
        // Friends and Connections
        Logger.info(`Accounts: removing relationships for account ${pAccountEntity.username}, id=${pAccountEntity.id}`);
        if (pAccountEntity.connections) {
            for (const aConnectionName of pAccountEntity.connections) {
                const aConnection = await Accounts.getAccountWithUsername(aConnectionName);
                if (aConnection && aConnection.connections) {
                    SArray.remove(aConnection.connections, pAccountEntity.username);
                };
            };
        };
        if (pAccountEntity.friends) {
            for (const aFriendName of pAccountEntity.friends) {
                const aFriend = await Accounts.getAccountWithUsername(aFriendName);
                if (aFriend && aFriend.friends) {
                    SArray.remove(aFriend.friends, pAccountEntity.username);
                };
            };
        };
        // The domains associated with this account are removed also
        for await (const aDomain of Domains.enumerateAsync(new GenericFilter({ 'sponsorAccountId': pAccountEntity.id }))) {
            await Domains.removeDomain(aDomain);
            await Domains.removeDomainContext(aDomain);
        };
        // Also, any places
        await Places.removeMany(new GenericFilter( { 'accountId': pAccountEntity.id }));
    },
    // The contents of this entity have been updated
    async updateEntityFields(pEntity: AccountEntity, pFields: VKeyedCollection): Promise<AccountEntity> {
        return updateObjectFields(accountCollection, new GenericFilter({ 'id': pEntity.id }), pFields);
    },
    // Get the value of a domain field with the fieldname.
    // Checks to make sure the getter has permission to get the values.
    // Returns the value. Could be 'undefined' whether the requestor doesn't have permissions or that's
    //     the actual field value.
    async getField(pAuthToken: AuthToken, pAccount: AccountEntity,
                    pField: string, pRequestingAccount?: AccountEntity): Promise<any> {
        return getEntityField(accountFields, pAuthToken, pAccount, pField, pRequestingAccount);
    },
    // Set a domain field with the fieldname and a value.
    // Checks to make sure the setter has permission to set.
    // Returns 'true' if the value was set and 'false' if the value could not be set.
    async setField(pAuthToken: AuthToken,  // authorization for making this change
              pAccount: AccountEntity,            // the account being changed
              pField: string, pVal: any,          // field being changed and the new value
              pRequestingAccount?: AccountEntity, // Account associated with pAuthToken, if known
              pUpdates?: VKeyedCollection         // where to record updates made (optional)
                      ): Promise<ValidateResponse> {
        return setEntityField(accountFields, pAuthToken, pAccount, pField, pVal, pRequestingAccount, pUpdates);
    },
    // Generate an 'update' block for the specified field or fields.
    // This is a field/value collection that can be passed to the database routines.
    // Note that this directly fetches the field value rather than using 'getter' since
    //     we want the actual value (whatever it is) to go into the database.
    // If an existing VKeyedCollection is passed, it is added to an returned.
    getUpdateForField(pAccount: AccountEntity,
                    pField: string | string[], pExisting?: VKeyedCollection): VKeyedCollection {
        return getEntityUpdateForField(accountFields, pAccount, pField, pExisting);
    },
    // Verify that the passed value is legal for the named field
    async validateFieldValue(pFieldName: string, pValue: any): Promise<ValidateResponse> {
        const defn = accountFields[pFieldName];
        if (defn) {
            return await defn.validate(defn, defn.request_field_name, pValue);
        };
        return { 'valid': false, 'reason': 'Unknown field name' };
    },
    // Return the number of accounts that match the criteria
    async accountCount(pCriteria: CriteriaFilter): Promise<number> {
        return countObjects(accountCollection, pCriteria);
    },
    createAccount(pUsername: string, pPassword: string, pEmail: string): AccountEntity {
        const newAcct = new AccountEntity();
        newAcct.id= GenUUID();
        newAcct.username = pUsername;
        newAcct.email = pEmail.toLowerCase();
        newAcct.roles = [Roles.USER];
        newAcct.friends = []
        newAcct.connections = []
        newAcct.whenCreated = new Date();

        // Remember the password
        Accounts.storePassword(newAcct, pPassword);

        return newAcct;
    },
    // When an account is created, do what is necessary to enable the account.
    // This might include verifying the email address, etc.
    enableAccount(pAccount: AccountEntity): void {
        if (Config['metaverse-server']['enable-account-email-verification']) {
            pAccount.accountEmailVerified = false;
            const verifyCode = GenUUID();
            // Create a pending request and wait for the user to check back
            const request = Requests.createEmailVerificationRequest(pAccount.id, verifyCode);
            void Requests.add(request);
            void SendVerificationEmail(pAccount, verifyCode);
        }
        else {
            // If not doing email verification, just turn on the account
            Accounts.doEnableAccount(pAccount);
        };
    },
    // The 'enableAccount' function can start a process of account enablement.
    // This function is called to actually turn on the account
    doEnableAccount(pAccount: AccountEntity): void {
        if (Config['metaverse-server']['enable-account-email-verification']) {
            pAccount.accountEmailVerified = true;
            const updates: VKeyedCollection = {
                'accountEmailVerified': true
            };
            void Accounts.updateEntityFields(pAccount, updates);
        }
        else {
            // If accounts are not verified by email, this value does not exist on the
            //     account and thus enablement is assumed to be 'true'.
            delete pAccount.accountEmailVerified;
            const updates: VKeyedCollection = {
                'accountEmailVerified': null
            };
            void Accounts.updateEntityFields(pAccount, updates);
        };
    },
    // TODO: add scope (admin) and filter criteria filtering
    //    It's push down to this routine so we could possibly use DB magic for the queries
    async *enumerateAsync(pPager: CriteriaFilter,
              pInfoer?: CriteriaFilter, pScoper?: CriteriaFilter): AsyncGenerator<AccountEntity> {
        for await (const acct of getObjects(accountCollection, pPager, pInfoer, pScoper)) {
            yield acct;
        };
        // return getObjects(accountCollection, pCriteria, pPager);
    },

    storePassword(pEntity: AccountEntity, pPassword: string) {
        pEntity.passwordSalt = genRandomString(16);
        pEntity.passwordHash = Accounts.hashPassword(pPassword, pEntity.passwordSalt);
    },
    async validatePassword(pAcct: AccountEntity, pPassword: string): Promise<boolean> {
        return Accounts.hashPassword(pPassword, pAcct.passwordSalt) === pAcct.passwordHash;
    },
    hashPassword(pPassword: string, pSalt: string): string {
        const hash = crypto.createHmac('sha512', pSalt);
        hash.update(pPassword);
        const val = hash.digest('hex');
        return val;
    },
    // Create whatever datastructure is needed to make these accounts friends
    async makeAccountsFriends(pRequestingAccount: AccountEntity, pTargetAccount: AccountEntity): Promise<void> {
        // Make sure that the requestor has the target as a connection
        if (SArray.hasNoCase(pRequestingAccount.connections, pTargetAccount.username)) {
            const adminToken = Tokens.createSpecialAdminToken();
            const updates: VKeyedCollection = {};
            await Accounts.setField(adminToken, pRequestingAccount, 'friends', { 'add': pTargetAccount.username }, pRequestingAccount, updates);
            await Accounts.updateEntityFields(pRequestingAccount, updates);
        }
    },
    // Create whatever datastructure is needed to make these accounts friends
    async makeAccountsConnected(pRequestingAccount: AccountEntity, pTargetAccount: AccountEntity): Promise<void> {
        const adminToken = Tokens.createSpecialAdminToken();
        let updates: VKeyedCollection = {};
        await Accounts.setField(adminToken, pRequestingAccount, 'connections', { 'add': pTargetAccount.username }, pRequestingAccount, updates);
        await Accounts.updateEntityFields(pRequestingAccount, updates);
        updates = {};
        await Accounts.setField(adminToken, pTargetAccount, 'connections', { 'add': pRequestingAccount.username }, pTargetAccount, updates);
        await Accounts.updateEntityFields(pTargetAccount, updates);
    },
    // Remove the named account from the list of connections. Also cleans out the other side
    async removeConnection(pAccount: AccountEntity, pConnectionName: string) {
        let updates: VKeyedCollection = {};
        const adminToken = Tokens.createSpecialAdminToken();
        await Accounts.setField(adminToken, pAccount, 'connections', { 'remove': pConnectionName }, pAccount, updates);
        await Accounts.setField(adminToken, pAccount, 'friends', { 'remove': pConnectionName }, pAccount, updates);
        await Accounts.updateEntityFields(pAccount, updates);
        const otherAccount = await Accounts.getAccountWithUsername(pConnectionName);
        if (otherAccount) {
        updates = {};
            await Accounts.setField(adminToken, otherAccount, 'connections', { 'remove': pAccount.username }, otherAccount, updates);
            await Accounts.setField(adminToken, otherAccount, 'friends', { 'remove': pAccount.username }, otherAccount, updates);
            await Accounts.updateEntityFields(otherAccount, updates);
        };
    },
    async removeFriend(pAccount: AccountEntity, pFriendName: string) {
        let updates: VKeyedCollection = {};
        const adminToken = Tokens.createSpecialAdminToken();
        await Accounts.setField(adminToken, pAccount, 'friends', { 'remove': pFriendName }, pAccount, updates);
        await Accounts.updateEntityFields(pAccount, updates);
        const otherAccount = await Accounts.getAccountWithUsername(pFriendName);
        if (otherAccount) {
            updates = {};
            await Accounts.setField(adminToken, otherAccount, 'friends', { 'remove': pAccount.username }, otherAccount, updates);
            await Accounts.updateEntityFields(otherAccount, updates);
        };
    },
    // getter property that is 'true' if the user has been heard from recently
    isOnline(pAcct: AccountEntity): boolean {
        if (pAcct && pAcct.timeOfLastHeartbeat) {
            return (Date.now().valueOf() - pAcct.timeOfLastHeartbeat.valueOf())
                < (Config["metaverse-server"]["heartbeat-seconds-until-offline"] * 1000);
        };
        return false;
    },
    // Return the ISODate when an account is considered offline
    dateWhenNotOnline(): Date {
        const whenOffline = new Date(
            Date.now()
            - (Config["metaverse-server"]["heartbeat-seconds-until-offline"] * 1000)
        );
        return whenOffline;
    },
    // getter property that is 'true' if the user is a grid administrator
    isAdmin(pAcct: AccountEntity): boolean {
        return SArray.has(pAcct.roles, Roles.ADMIN);
    }
};
