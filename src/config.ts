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
      'default-ice-server-url': ''  // if empty, set to self
    },
    'server': {
      'listen-host': '0.0.0.0',
      'listen-port': 9400,
      'static-base': '/static',
      'user-config-file': './iamus.json',
      'server-version': '1.1.1' // Updated by package.json script
    },
    'auth': {
      'domain-token-expire-hours': 8760,  // one year
      'owner-token-expire-hours': 12
    },
    'metaverse-server': {
      'http-error-on-failure': true,  // whether to include x-vircadia error header
      'error-header': 'x-vircadia-error-handle',
      'heartbeat-seconds-until-offline': 120,
      'metaverse-info-addition-file': './metaverse_info.json',
      'session-timeout-minutes': 5
    },
    'activitypub': {
      // NOTE: there shouldn't be a trailing slash
      'url-base': '/vircadia',
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
      'metaverseapi-response-detail': false
    },
    'database': {
      'db-host': 'localhost',
      'db-port': 27017,
      'db': 'tester',
      'db-user': 'metaverse',
      'db-pw': 'nooneknowsit',
      'db-authdb': 'admin',
    }
};

// Check environment variables and read in the user configuration file
//   and overlay the default values above.
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

  try {
    const userConfigFile = Config.server["user-config-file"];
    const userConfig = await readInJSON(userConfigFile);
    if (IsNotNullOrEmpty(userConfig)) {
      // this overlays all the Config values with values from the user's file
      Config = deepmerge(Config, userConfig);
      Logger.setLogLevel(Config.debug.loglevel);  // it could have changed the logLevel
      Logger.debug(`initializeConfiguration: processed configuration file ${userConfigFile}`);
    }
  }
  catch (e) {
    Logger.error('initializeConfiguration: exception adding user config: ' + e);
  }

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
  }
  return;
};

export async function readInJSON(pFilenameOrURL: string): Promise<any> {
  let configBody: string;
  if (pFilenameOrURL.startsWith('http:')) {
    Logger.debug(`initializeConfiguration: fetching with http ${pFilenameOrURL}`);
    configBody = await httpRequest(pFilenameOrURL);
  }
  else {
    if (pFilenameOrURL.startsWith('https:')) {
      Logger.debug(`initializeConfiguration: fetching with https ${pFilenameOrURL}`);
      configBody = await httpsRequest(pFilenameOrURL);
    }
    else {
      try {
        Logger.debug(`initializeConfiguration: reading configuration file ${pFilenameOrURL}`);
        configBody = fs.readFileSync(pFilenameOrURL, 'utf-8');
      }
      catch {
        Logger.debug(`initializedConfiguration: failed read of user config file ${pFilenameOrURL}`);
      };
    };
  };
  if (IsNotNullOrEmpty(configBody)) {
    return JSON.parse(configBody);
  };
  return undefined;
};

export default Config;
