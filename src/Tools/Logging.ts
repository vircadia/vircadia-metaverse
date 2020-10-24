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

import fs from 'fs';

import http from 'http';
import winston, { transports } from 'winston';
import { Options } from 'morgan';

interface ALogger {
  info( msg: string ): void,
  warn( msg: string ): void,
  debug( msg: string ): void,
  cdebug( flag: string, msg: string ): void,
  error( msg: string ): void,
  setLogLevel( level: string ): void
};

// This is an initial logger that exists before configuration is complete.
// The later 'initializeLogger' will reset the logger to be to files or whatever.
export let logger = winston.createLogger( {
  'level': 'debug',
  'format': winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => { return `${info.timestamp} ${info.level} ${info.message}` })
  ),
  'transports': [
    new winston.transports.Console( {
      'level': 'debug'
    })
  ]
});

// Switch the logger from the startup console logger to the file logger.
export function initLogging() {
  // Create the logging directory if it doesn't exist
  let logDir = Config.debug["log-directory"];
  if (!fs.existsSync(logDir)) {
    try {
      fs.mkdirSync(logDir);
    }
    catch (e) {
      logger.error(`Logger: could not create log directory "${logDir}": ${e}`);
      logDir = '.';
    }
  };

  // Create the ways we're going to log. Files and/or console
  const logTransports: any[] = [];
  if (Config.debug["log-to-files"]) {
    logTransports.push(
      new winston.transports.File( {
        'level': Config.debug.loglevel,
        'filename': Config.debug['log-filename'],
        'dirname': logDir,
        'maxsize': Config.debug['log-max-size-megabytes']*1000000, // max size in bytes
        'maxFiles': Config.debug['log-max-files'],  // number of files to keep
        'tailable': Config.debug["log-tailable"],
        'zippedArchive': Config.debug["log-compress"] // ZIP the previous files
      })
    );
  };
  if (Config.debug["log-to-console"]) {
    logTransports.push(
      new winston.transports.Console( {
        'level': Config.debug.loglevel
      })
    );
  };

  // Create the Winston logger
  logger = winston.createLogger( {
    'level': Config.debug.loglevel,
    'format': winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(info => { return `${info.timestamp} ${info.level} ${info.message}` })
    ),
    'transports': logTransports,
  });
};

export const Logger : ALogger = {
  info: (msg: string) => {
    logger.log('info', msg);
  },
  warn: (msg: string) => {
    logger.log('warn', msg);
  },
  debug: (msg: string) => {
    logger.log('debug', msg);
  },
  // Conditional debug. Looks for "debug.flag" in configuration.
  cdebug: (flag: string, msg: string) => {
    if ((Config.debug as any)[flag]) {
      logger.log('debug', msg);
    };
  },
  error: (msg: string) => {
    logger.log('error', msg);
  },
  setLogLevel: ( level: string) => {
    if (level) {
      const aLevel = level.toLowerCase();
      if ([ 'info', 'warn', 'debug', 'error'].includes(aLevel)) {
        transports.File.level = aLevel;
        transports.Console.level = aLevel;
      }
      else {
        Logger.error(`Logger.setLogLevel: unknown level name: ${level}`);
        Logger.setLogLevel('info');
      };
    }
    else {
      Logger.error(`Logger.setLogLevel: false level name: ${level}`);
      transports.File.level = 'debug';
    };
  }
};

// The morgan logger for ExpressJS logs the API requests made.
// This adds a stream processor so it will log to the above configured logger.
export const morganOptions: Options<http.IncomingMessage, http.ServerResponse> = {
  stream: {
    write (msg: string) {
      Logger.debug(msg);
    }
  }
};
