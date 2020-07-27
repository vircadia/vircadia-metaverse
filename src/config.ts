// Configuration
// Just returns an object that has all the parameters
// Someday integrate with 'command-line-args' or 'dotenv'
'use strict';

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
      'static-base': '/static/',
      'server-version': '1.0.1' // Updated by package.json script
    },
    'metaverse-server': {
      'http-error-on-failure': true,  // whether to include x-vircadia error header
      'error-header': 'x-vircadia-error-handle',
      'heartbeat-seconds-until-offline': 120
    },
    'activitypub': {
      // NOTE: there shouldn't be a trailing slash
      'url-base': '/vircadia',
      'external-hostname': 'localhost'
    },
    'debug': {
      'logLevel': 'debug',
      'devel': true,
      // output the received request info when received
      'request-detail': true,
      // output the response sent back from MetaverseAPI requests
      'metaverseapi-response-detail': true
    },
    'database': {

    }
};

// Tweek some of the values based on environment variables
const envLogLevel = process.env.IAMUS_LOGLEVEL;
if (envLogLevel) Config.debug.logLevel = envLogLevel;

const envHost = process.env.IAMUS_LISTEN_HOST;
if (envHost) Config.server['listen-host'] = envHost;

const envPort = process.env.IAMUS_LISTEN_PORT;
if (envPort) Config.server['listen-port'] = Number(envPort);

const envExternalHostname = process.env.IAMUS_EXTERNAL_HOSTNAME;
if (envExternalHostname) Config.activitypub['external-hostname'] = envExternalHostname;

export default Config;
