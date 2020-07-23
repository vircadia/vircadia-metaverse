//   Copyright 2020 Robert Adams
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

import Config from '../config';

// import loglevel, { getLogger, LogLevelDesc } from 'loglevel';
import * as loglevel from 'loglevel';

import { Options } from 'morgan';
import http from 'http';

interface ALogger {
  info( msg: string ): void,
  warn( msg: string ): void,
  debug( msg: string ): void,
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
  error: (msg: string) => {
    loglevel.error(msg);
  },
  setLogLevel: ( level: string) => {
    switch(level.toLowerCase()) {
      case 'silent': loglevel.setLevel(loglevel.levels.SILENT); break;
      case 'info': loglevel.setLevel(loglevel.levels.INFO); break;
      case 'warn': loglevel.setLevel(loglevel.levels.WARN); break;
      case 'debug': loglevel.setLevel(loglevel.levels.DEBUG); break;
      case 'error': loglevel.setLevel(loglevel.levels.ERROR); break;
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
