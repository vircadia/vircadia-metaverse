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

'use strict';

import dotenv from 'dotenv-flow';
import appRootPath from 'app-root-path';
import { IsNullOrEmpty, getMyExternalIPAddress } from './utils/Misc';
import fs from 'fs';

if (globalThis.process?.env.APP_ENV === 'development') {
    if (
        !fs.existsSync(appRootPath.path + '/.env') &&
        !fs.existsSync(appRootPath.path + '/.env.local')
    ) {
        const fromEnvPath = appRootPath.path + '/env.default';
        const toEnvPath = appRootPath.path + '/.env';
        fs.copyFileSync(fromEnvPath, toEnvPath, fs.constants.COPYFILE_EXCL);
    }
}

dotenv.config({
    path: appRootPath.path,
    silent: true,
});

/**
 * Server
 */
const server = {
    local: process.env.LOCAL === 'true',
    hostName: process.env.SERVER_HOST,
    port: process.env.PORT ?? 3040,
    paginate: {
        default: 10,
        max: 1000,
    },
    isDevelopmentMode: (process.env.APP_ENV ?? 'development') === 'development',
    publicPath: process.env.PUBLIC_PATH ?? './public',
    version: process.env.SERVER_VERSION ?? '',
    localStorageProvider: process.env.LOCAL_STORAGE_PROVIDER || '',
    localStorageProviderPort: process.env.LOCAL_STORAGE_PROVIDER_PORT || '',
    storageProvider: process.env.STORAGE_PROVIDER || 'local',
    'key-file': '', // if supplied, do https
    'cert-file': '',
    'max-body-size': 300000, // maximum body size for input JSON bodies
    'static-base': '/static', // base of static data URL
    'user-config-file': './iamus.json', // startup config over-ride
    'server-version': {
        // overlaid with VERSION.json
        'version-tag': process.env.SERVER_VERSION ?? '',
    },
};

/*
 * Database
 */

const database = {
    databaseUrl: process.env.DATABASE_URL,
    dbName: process.env.DB_NAME ?? 'admin',
    dbUserName: process.env.DB_USER ?? 'metaverse',
    dbPassword: process.env.DB_PASSWORD ?? 'nooneknowsit',
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? '27017',
    authSource: process.env.DB_AUTHDB ?? 'admin',
};

const monitoring = {
    enable: true, // enable value monitoring
    history: true, // whether to keep value history
};
/*
 * Email
 */
const email = {
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT ?? '465'),
    secure: process.env.SMTP_SECURE === 'false' ? false : true,
    auth: {
        user: process.env.SMTP_USER ?? '',
        pass: process.env.SMTP_PASS ?? '',
    },
    email_from: process.env.SMTP_EMAIL_FROM ?? '',
};

/**
 * Metaverse Server
 */

const metaverseServer = {
    listen_host: process.env.LISTEN_HOST ?? '0.0.0.0',
    listen_port: process.env.LISTEN_PORT ?? 9400,
    metaverseInfoAdditionFile: './lib/metaverse_info.json',
    maxNameLength: 32,
    session_timeout_minutes: 5,
    heartbeat_seconds_until_offline: 5 * 60, // seconds until non-heartbeating user is offline
    domain_seconds_until_offline: 10 * 60, // seconds until non-heartbeating domain is offline
    domain_seconds_check_if_online: 2 * 60, // how often to check if a domain is online
    handshake_request_expiration_minutes: 1, // minutes that a handshake friend request is active
    connection_request_expiration_minutes: 60 * 24 * 4, // 4 days
    friend_request_expiration_minutes: 60 * 24 * 4, // 4 days
    base_admin_account: process.env.ADMIN_ACCOUNT ?? 'Metaverse',
    place_current_timeout_minutes: 5, // minutes until current place info is stale
    place_inactive_timeout_minutes: 60, // minutes until place is considered inactive
    place_check_last_activity_seconds: 3 * 60 - 5, // seconds between checks for Place lastActivity updates
    email_verification_timeout_minutes: 1440,
    enable_account_email_verification:
        process.env.ENABLE_ACCOUNT_VERIFICATION ?? 'true',
    email_verification_email_body: '../mailtemplates/verificationEmail.html',
    email_reset_password_otp_body: '../mailtemplates/resetPasswordOtp.html',
    email_verification_success_redirect:
        'METAVERSE_SERVER_URL/verificationEmailSuccess.html',
    email_verification_failure_redirect:
        'METAVERSE_SERVER_URL/verificationEmailFailure.html?r=FAILURE_REASON',
    domain_token_expire_hours: 24 * 365, // one year
    owner_token_expire_hours: 24 * 7, // one week
    reset_password_otp_length: 6,
    reset_password_expire_minutes: 1 * 60, // Minutes
    allow_temp_domain_creation: true,
    inventoryItemMasterDataFile: './master_data/inventory_items.json',
    questItemMasterDataFile: './master_data/quest_items.json',
    npcMasterDataFile: './master_data/npc.json',
    tokengen_url: '../mailtemplates/DomainTokenLogin.html',
};

/**
 * Client / frontend
 */
const client = {
    logo: process.env.APP_LOGO || '',
    title: process.env.APP_TITLE || '',
    url:
        process.env.APP_URL ||
        (server.local
            ? 'http://' + process.env.APP_HOST + ':' + process.env.APP_PORT
            : 'https://' + process.env.APP_HOST + ':' + process.env.APP_PORT),
};

/**
 * Metaverse
 */

const metaverse = {
    metaverseName: process.env.METAVERSE_NAME ?? '',
    metaverseNickName: process.env.METAVERSE_NICK_NAME ?? '',
    metaverseServerUrl: process.env.METAVERSE_SERVER_URL ?? '', // if empty, set to self
    defaultIceServerUrl: process.env.DEFAULT_ICE_SERVER_URL ?? 'ice.vircadia.com:7337', // if empty, set to self
    dashboardUrl: process.env.DASHBOARD_URL,
};

/**
 * Debug
 */

const debug = {
    loglevel: 'debug',
    'log-directory': '/home/cadia/config/Logs',
    devel: true,
    'request-detail': false,
    'request-body': false,
    'metaverseapi-response-detail': false,
    'db-query-detail': false,
};

/**
 * Authentication
 */
const authentication = {
    entity: 'user',
    service: 'auth',
    secret: process.env.AUTH_SECRET ?? 'testing',
    authStrategies: ['jwt', 'local'],
    jwtOptions: {
        expiresIn: '336 days',
    },
    local: {
        usernameField: 'email',
        passwordField: 'password',
    },
    bearerToken: {
        numBytes: 16,
    },
    callback: {
        facebook:
            process.env.FACEBOOK_CALLBACK_URL ||
            `${client.url}/auth/oauth/facebook`,
        google:
            process.env.GOOGLE_CALLBACK_URL ||
            `${client.url}/auth/oauth/google`,
    },
    oauth: {
        google: {
            redirect_uri: `${metaverse.metaverseServerUrl}/oauth/google/callback`,
            //callback: 'http://localhost:8081',
            key: process.env.GOOGLE_CLIENT_ID,
            secret: process.env.GOOGLE_CLIENT_SECRET,
            scope: ['openid', 'email', 'profile'],
        },
        facebook: {
            redirect_uri: `${metaverse.metaverseServerUrl}/oauth/facebook/callback`,
            key: process.env.FACEBOOK_CLIENT_ID,
            secret: process.env.FACEBOOK_CLIENT_SECRET,
            scope: ['email, public_profile'],
        },
    },
};

if (
    IsNullOrEmpty(metaverse.metaverseServerUrl) ||
    IsNullOrEmpty(metaverse.defaultIceServerUrl)
) {
    getMyExternalIPAddress().then((ipAddress) => {
        if (IsNullOrEmpty(metaverse.metaverseServerUrl)) {
            const newUrl = `http://${ipAddress}:${metaverseServer.listen_port.toString()}`;
            metaverse.metaverseServerUrl = newUrl;
        }
        if (IsNullOrEmpty(metaverse.defaultIceServerUrl)) {
            metaverse.defaultIceServerUrl = ipAddress;
        }
    });
}

const dbCollections = {
    domains: 'domains',
    accounts: 'accounts',
    places: 'places',
    tokens: 'tokens',
    requests: 'requests',
    asset: 'asset',
    inventory: 'inventory',
    inventoryItem: 'inventoryItems',
    achievements: 'achievements',
    achievementItems: 'achievementItems',
    resetPassword: 'resetPassword',
    itemHandler: 'itemHandler',
    quest: 'quest',
    questItem: 'questItem',
    npc: 'npc',
    rewardItems: 'rewardItems',
    tokenBalances: 'tokenBalances',
    minigame: 'minigame',
    blockchainTransactions: 'blockchainTransactions',
};

/**
 * AWS
 */
const aws = {
    keys: {
        accessKeyId: process.env.STORAGE_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.STORAGE_AWS_ACCESS_KEY_SECRET || '',
    },
    route53: {
        hostedZoneId: process.env.ROUTE53_HOSTED_ZONE_ID || '',
        keys: {
            accessKeyId: process.env.ROUTE53_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.ROUTE53_ACCESS_KEY_SECRET || '',
        },
    },
    s3: {
        staticResourceBucket:
            process.env.STORAGE_S3_STATIC_RESOURCE_BUCKET || '',
        region: process.env.STORAGE_S3_REGION || '',
        avatarDir: process.env.STORAGE_S3_AVATAR_DIRECTORY || '',
        s3DevMode: process.env.STORAGE_S3_DEV_MODE || '',
        awsStorageProvider: process.env.AWS_STORAGE_PROVIDER || '',
    },
};

/**
 * Full config
 */

const config = {
    deployStage: process.env.DEPLOY_STAGE,
    authentication,
    server,
    metaverse,
    metaverseServer,
    dbCollections,
    email,
    aws,
    database,
    client,
    monitoring,
    debug,
};

export default config;
