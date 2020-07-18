// Configuration
// Just returns an object that has all the parameters
// Someday integrate with 'command-line-args' or 'dotenv'
'use strict';

export default {
    'server': {
      'listen-host': '0.0.0.0',
      'listen-port': 9400,
      'static-base': '/static/'
    },
    'metaverse-server': {
    },
    'activitypub': {
      // NOTE: there shouldn't be a trailing slash
      'url-base': '/vircadia'
    },
    'debug': {
      'logLevel': 'debug'
    },
    'database': {

    }
}