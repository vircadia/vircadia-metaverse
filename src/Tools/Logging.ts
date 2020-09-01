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

import * as loglevel from 'loglevel';

import { Config } from '@Base/config';
import { Options } from 'morgan';
import http from 'http';
import { VKeyValue } from './vTypes';

interface ALogger {
  info( msg: string ): void,
  warn( msg: string ): void,
  debug( msg: string ): void,
  cdebug( flag: string, msg: string ): void,
  error( msg: string ): void,
  setLogLevel( level: string ): void
};

export const Logger : ALogger = {
  info: (msg: string) => {
    loglevel.info(msg);
  },
  warn: (msg: string) => {
    loglevel.warn(msg);
  },
  debug: (msg: string) => {
    loglevel.debug(msg);
  },
  // Conditional debug. Looks for "debug.flag" in configuration.
  cdebug: (flag: string, msg: string) => {
    if ((Config.debug as any)[flag]) {
      loglevel.debug(msg);
    };
  },
  error: (msg: string) => {
    loglevel.error(msg);
  },
  setLogLevel: ( level: string) => {
    if (level) {
      switch(level.toLowerCase()) {
        case 'silent': loglevel.setLevel(loglevel.levels.SILENT); break;
        case 'info': loglevel.setLevel(loglevel.levels.INFO); break;
        case 'warn': loglevel.setLevel(loglevel.levels.WARN); break;
        case 'debug': loglevel.setLevel(loglevel.levels.DEBUG); break;
        case 'error': loglevel.setLevel(loglevel.levels.ERROR); break;
        default:
          Logger.error(`Logger.setLogLevel: unknown level name: ${level}`);
          loglevel.setLevel(loglevel.levels.DEBUG);
          break;
      };
    }
    else {
      Logger.error(`Logger.setLogLevel: false level name: ${level}`);
      loglevel.setLevel(loglevel.levels.DEBUG);
    };
  }
};

export const morganOptions: Options<http.IncomingMessage, http.ServerResponse> = {
  stream: {
    write (msg: string) {
      Logger.debug(msg);
    }
  }
};
