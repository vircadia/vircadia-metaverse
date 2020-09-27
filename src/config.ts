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

export let Config = {
    'metaverse': {
      'metaverse-name': 'Vircadia noobie',
      'metaverse-nick-name': 'Noobie',
      'metaverse-server-url': '',   // if empty, set to self
      'default-ice-server-url': '', // if empty, set to self
      'dashboard-url': 'https://dashboard.vircadia.com'
    },
    'server': {
      'listen-host': '0.0.0.0',
      'listen-port': 9400,
      'key-file': '',           // if supplied, do https
      'cert-file': '',
      'static-base': '/static', // base of static data URL
      'user-config-file': './iamus.json', // startup config over-ride
      'server-version': {       // overlaid with VERSION.json
        'version-tag': '1.1.1-20200101-abcdefg'
      }
    },
    'auth': {
      'domain-token-expire-hours': 8760,  // one year
      'owner-token-expire-hours': 12
    },
    'metaverse-server': {
      'http-error-on-failure': true,  // whether to include x-vircadia error header
      'error-header': 'x-vircadia-error-handle',
      'heartbeat-seconds-until-offline': 300,
      'metaverse-info-addition-file': './metaverse_info.json',
      'session-timeout-minutes': 5,
      'connection-request-expiration-minutes': 1,
      'friend-request-expiration-minutes': 60 * 24 * 4,
      // redirection URL used for initial domain token generation
      'tokengen_url': '/static/DomainTokenLogin.html',
      // When account of this name is created, add 'admin' role to it
      'base-admin-account': 'adminer'
    },
    'database': {
      'db-host': 'localhost',
      'db-port': 27017,
      'db': 'tester',
      'db-user': 'metaverse',
      'db-pw': 'nooneknowsit',
      'db-authdb': 'admin',
      'db-connection': ''   // connection string replaces above if supplied
    },
    'activitypub': {
      // NOTE: there shouldn't be a trailing slash
      'url-base': '/v',
      // This becomes the base of all object permanent URLs
      'external-hostname': 'localhost'
    },
    'debug': {
      'loglevel': 'info',
      'devel': false,
      // output the received request info when received
      'request-detail': false,
      // output the received request body when received
      'request-body': false,
      // output the response sent back from MetaverseAPI requests
      'metaverseapi-response-detail': false,
      // outputs details when selecting query parameters
      'query-detail': false,
      // outputs details about DB queries
      'db-query-detail': false,
      // Details of entity field getting and setting
      'field-setting': false
    }
};

// Check environment variables that overlay the defaults above.
// Also read the configuration file and overlay the values.
export async function initializeConfiguration(): Promise<void> {

  // Tweek some of the values based on environment variables
  const envLogLevel = process.env.IAMUS_LOGLEVEL;
  if (IsNotNullOrEmpty(envLogLevel)) Config.debug.loglevel = envLogLevel;
  Logger.setLogLevel(Config.debug.loglevel);

  const envHost = process.env.IAMUS_LISTEN_HOST;
  if (IsNotNullOrEmpty(envHost)) Config.server['listen-host'] = envHost;

  const envPort = process.env.IAMUS_LISTEN_PORT;
  if (IsNotNullOrEmpty(envPort)) Config.server['listen-port'] = Number(envPort);

  const envExternalHostname = process.env.IAMUS_EXTERNAL_HOSTNAME;
  if (IsNotNullOrEmpty(envExternalHostname)) Config.activitypub['external-hostname'] = envExternalHostname;

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
        Logger.setLogLevel(Config.debug.loglevel);  // it could have changed the logLevel
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
