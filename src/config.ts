// Configuration
// Just returns an object that has all the parameters
// Someday integrate with 'command-line-args' or 'dotenv'

// This includes all the parameters used by the server and the default values.
// Do no change this file but instead create a 'server.user-config-file' (default
// name of "iamus.json") whos values overlay these default values.

'use strict';

import fs from 'fs';

import deepmerge from 'deepmerge';

import { IsNullOrEmpty, IsNotNullOrEmpty, getMyExternalIPAddress } from '@Tools/Misc';
import { httpRequest, httpsRequest } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

// All the possible configuration parameters.
// This sets defaults values and is over-written by environment variables and
//     supplied configuration file contents.
export let Config = {
    // The metaverse identity
    'metaverse': {
        'metaverse-name': 'Vircadia noobie',
        'metaverse-nick-name': 'Noobie',
        'metaverse-server-url': '',   // if empty, set to self
        'default-ice-server-url': '', // if empty, set to self
        'dashboard-url': 'https://dashboard.vircadia.com'
    },
    // Server network parameters
    'server': {
        'listen-host': '0.0.0.0',
        'listen-port': 9400,
        'key-file': '',           // if supplied, do https
        'cert-file': '',
        'max-body-size': 300000,  // maximum body size for input JSON bodies
        'static-base': '/static', // base of static data URL
        'user-config-file': './iamus.json', // startup config over-ride
        'server-version': {       // overlaid with VERSION.json
            'version-tag': '1.1.1-20200101-abcdefg'
        }
    },
    // Authorization token parameters
    'auth': {
        'domain-token-expire-hours': 24 * 365,  // one year
        'owner-token-expire-hours': 24 * 7      // one week
    },
    // Control of the metaverse operations
    'metaverse-server': {
        'http-error-on-failure': true,  // whether to include x-vircadia error header
        'error-header': 'x-vircadia-error-handle',

        'heartbeat-seconds-until-offline': 5 * 60,  // five minutes
        'domain-seconds-until-offline': 10 * 60,    // ten minutes
        'metaverse-info-addition-file': './metaverse_info.json',
        'session-timeout-minutes': 5,

        'handshake-request-expiration-minutes': 1,            // one minute handshake
        'connection-request-expiration-minutes': 60 * 24 * 4, // 4 days
        'friend-request-expiration-minutes': 60 * 24 * 4,     // 4 days

        'place-current-timeout-minutes': 60,  // minutes until current place info is stale
        // redirection URL used for initial domain token generation,
        //   "METAVERSE_SERVER_URL" is replaced (from Config.metaverse.metaverse-server-url)
        //   "DASHBOARD_URL" is replaced (from Config.metaverse.dashboard-url)
        'tokengen_url': 'METAVERSE_SERVER_URL/static/DomainTokenLogin.html',
        // 'tokengen_url': 'DASHBOARD_URL?metaverse=METAVERSE_SERVER_URL&page=domain',

        // When account of this name is created, add 'admin' role to it
        'base-admin-account': 'adminer',

        // If to assume domain network_address if on is not set
        'fix-domain-network-address': true,
        // Whether allowing temp domain name creation
        'allow-temp-domain-creation': false,

        // Email verification on account creation
        'enable-account-email-verification': false,
        'email-verification-timeout-minutes': 1440, // minutes to wait for email verification (1440=one day)
        // default is in 'static' dir. If you put in 'config' dir, use 'config/verificationEmail.html'.
        //   "METAVERSE_NAME" is replaced (from Config.metaverse.metaverse-name)
        //   "SHORT_METAVERSE_NAME" is replaced (from Config.metaverse.metaverse-nick-name)
        'email-verification-email-body': 'dist/static/verificationEmail.html',  // file to send
        'email-verification-from': '', // who the email is From
        // When user follows the verification URL, they are redirected to one of these two URLs
        //   "METAVERSE_SERVER_URL" is replaced (from Config.metaverse.metaverse-server-url)
        //   "DASHBOARD_URL" is replaced (from Config.metaverse.dashboard-url)
        //   "ACCOUNT_ID" is replaced with the verifying account id
        //   "FAILURE_REASON" is replaced with the reason for verification failure (url encoded)
        'email-verification-success-redirect': 'METAVERSE_SERVER_URL/static/verificationEmailSuccess.html',
        'email-verification-failure-redirect': 'METAVERSE_SERVER_URL/static/verificationEmailFailure.html?r=FAILURE_REASON'
    },
    // SMTP mail parameters for out-bound email
    // This is the structure that is passed to NodeMailer's SMTP transport.
    // Check out the documentation at https://nodemailer.com/smtp/
    // For SMTP outbound, setup your email account on your service and
    //     update SMTP-HOSTNAME, SMTP-USER, and SMTP-PASSWORD with your info.
    'nodemailer-transport-config': {
        'host': 'SMTP-HOSTNAME',
        'port': 465,    // 587 if secure=false
        'secure': true,
        'auth': {
            'user': 'SMTP-USER',
            'pass': 'SMTP-PASSWORD'
        }
    },
    'monitoring': {
        'enable': true,           // enable value monitoring
        'history': true           // whether to keep value history
    },
    // Setup for MongoDB access
    'database': {
        'db-host': 'localhost',
        'db-port': 27017,
        'db': 'tester',
        'db-user': 'metaverse',
        'db-pw': 'nooneknowsit',
        'db-authdb': 'admin',
        'db-connection': ''   // connection string replaces above if supplied
    },
    // MongoDB account configured for database backup script
    'backup': {
        "backup-user": "backuper",  // database backup user account (for BackupDb.sh)
        "backup-pw": "nooneknowsit", // database backup user password (for BackupDb.sh)
        "backup-dir": "directoryName", // Backup file directory. Optional. Defaults to "./DatabaseBackup"
        "authenticationDatabase": "databaseName" // auth db for backup user. Optional. Defaults to "admin"
    },
    'debug': {
        'loglevel': 'info',

        // Winston logging configuration
        'log-to-files': true,         // if to log to files
        'log-filename': 'iamus.log',  // filename for log files
        'log-directory': './logs',    // directory to place logs
        'log-max-size-megabytes': 100,// max mega-bytes per log file
        'log-max-files': 10,          // number of log files to create
        'log-tailable': true,         // if to always output to main named log file
        'log-compress': false,        // if to compress old log files

        'log-to-console': false,      // if to additionally log to the console

        'devel': false,

        // Control of what debug information is logged
        'request-detail': false,  // output the received request info when received
        'request-body': false,    // output the received request body when received
        'metaverseapi-response-detail': false, // output the response sent back from MetaverseAPI requests
        'query-detail': false,    // outputs details when selecting query parameters
        'db-query-detail': false, // outputs details about DB queries
        'field-setting': false    // Details of entity field getting and setting
    }
};

// Check environment variables that overlay the defaults above.
// Also read the configuration file and overlay the values.
export async function initializeConfiguration(): Promise<void> {

    // Tweek some of the values based on environment variables
    const envLogLevel = process.env.IAMUS_LOGLEVEL;
    if (IsNotNullOrEmpty(envLogLevel)) Config.debug.loglevel = envLogLevel;

    const envHost = process.env.IAMUS_LISTEN_HOST;
    if (IsNotNullOrEmpty(envHost)) Config.server['listen-host'] = envHost;

    const envPort = process.env.IAMUS_LISTEN_PORT;
    if (IsNotNullOrEmpty(envPort)) Config.server['listen-port'] = Number(envPort);

    const envConfigFile = process.env.IAMUS_CONFIG_FILE;
    if (IsNotNullOrEmpty(envConfigFile)) Config.server["user-config-file"] = envConfigFile;

    // Read in the configuration file if it exists and overlay the values.
    try {
        const userConfigFile = Config.server["user-config-file"];
        if (fs.existsSync(userConfigFile)) {
            Logger.debug(`initializeConfiguration: reading configuration file ${userConfigFile}`);
            const userConfig = await readInJSON(userConfigFile);
            if (IsNotNullOrEmpty(userConfig)) {
                // this overlays all the Config values with values from the user's file
                Config = deepmerge(Config, userConfig);
                // Logger.debug(`initializeConfiguration: processed configuration file ${userConfigFile}`);
            };
        };
    }
    catch (e) {
        Logger.error('initializeConfiguration: exception adding user config: ' + e);
    }

    // Read in version info from distribution version file
    try {
        let versionInfo: any;
        // depending on how built, version file might be in different places
        for (const versionFile of [ './VERSION.json' , './dist/VERSION.json' ]) {
            if (fs.existsSync(versionFile)) {
                versionInfo = await readInJSON(versionFile);
                break;
            };
        };
        if (IsNullOrEmpty(versionInfo)) {
            versionInfo = {
                'version-tab': 'unknown'
            };
        };
        Config.server["server-version"] = versionInfo;
        Logger.debug(`initializeConfiguration: version info: ${JSON.stringify(versionInfo, null, 4)}`);
    }
    catch (e) {
        Logger.error('initializeConfiguration: exception reading version info: ' + e);
    };

    // If no ice server address is specified, assume ours
    if (IsNullOrEmpty(Config.metaverse["default-ice-server-url"])) {
        const myAddr = await getMyExternalIPAddress();
        Logger.debug(`initializeConfiguration: made ice server addr of ${myAddr}`);
        Config.metaverse["default-ice-server-url"] = myAddr;
    };
    // If no external metaverse server url is specified, make one from our address
    if (IsNullOrEmpty(Config.metaverse["metaverse-server-url"])) {
        const myAddr = await getMyExternalIPAddress();
        const newUrl = `http://${myAddr}:${Config.server["listen-port"].toString()}/`;
        Logger.debug(`initializeConfiguration: built metaverse url of ${newUrl}`);
        Config.metaverse["metaverse-server-url"] = newUrl;
    };

    // Make sure the metaverse-server-url does not end in a slash.
    // There is a bunch of code that expects to add the "/api/v1/..." to this variable.
    let msu: string = Config.metaverse["metaverse-server-url"];
    while (msu.endsWith('/')) {
        msu = msu.slice(0, -1);
    };
    Config.metaverse["metaverse-server-url"] = msu;

    // Write a subset of the built configuration information into the 'static' directory
    //    so the static pages will know our configuration.
    const configSubset: any = {};
    configSubset.metaverse = Config.metaverse;
    configSubset.server = Config.server;
    configSubset.debug = Config.debug;

    // Depending on how started, the static dir can be in different places
    const staticBase: string = Config.server['static-base'];
    for (const staticDir of [ '.' + staticBase, './dist' + staticBase ]) {
        if (fs.existsSync(staticDir)) {
            const configSubsetFilename = staticDir + '/config.json';
            try {
                fs.writeFileSync(configSubsetFilename, JSON.stringify(configSubset));
                Logger.info(`initializeConfiguration: wrote static config subset to ${configSubsetFilename}`);
            }
            catch (err) {
                Logger.error(`initializeConfiguration: error writing ${configSubsetFilename}: ${err}`);
            };
            break;
        };
    };

    // Logger.debug(`initializeConfiguration: debug setting: ${JSON.stringify(Config.debug)}`);
    return;
};

// Utility routine that reads in JSON content from either an URL or a filename.
// Returns the parsed JSON object or 'undefined' if any errors.
export async function readInJSON(pFilenameOrURL: string): Promise<any> {
    let configBody: string;
    if (pFilenameOrURL.startsWith('http:')) {
        configBody = await httpRequest(pFilenameOrURL);
    }
    else {
        if (pFilenameOrURL.startsWith('https:')) {
            configBody = await httpsRequest(pFilenameOrURL);
        }
        else {
            try {
                configBody = fs.readFileSync(pFilenameOrURL, 'utf-8');
            }
            catch (err) {
                Logger.debug(`readInJSON: failed read of user config file ${pFilenameOrURL}: ${err}`);
            };
        };
    };
    if (IsNotNullOrEmpty(configBody)) {
        return JSON.parse(configBody);
    };
    return undefined;
};

export default Config;
