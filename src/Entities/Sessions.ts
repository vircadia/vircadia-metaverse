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

import { SessionEntity } from '@Entities/SessionEntity';

import { PaginationInfo } from '@Entities/EntityFilters/PaginationInfo';

import { VKeyedCollection } from '@Tools/vTypes';
import { GenUUID, genRandomString, IsNullOrEmpty } from '@Tools/Misc';
import { Logger } from '@Tools/Logging';

let _currentSessions: Map<string, SessionEntity>;

// Initialize session management.
// Sessions are kept in a list as they are referenced and updated often
//    and, if the server is restarted, re-creating sessions is OK.
// Mostly starts a periodic function that deletes expired sessions.
export function initSessions(): void {
  _currentSessions = new Map<string, SessionEntity>();

  // Expire tokens that have pased their prime
  setInterval( async () => {
    const timeoutTime = new Date(Date.now() - 1000 * 60 * Config["metaverse-server"]["session-timeout-minutes"]).valueOf();
    const toDelete: SessionEntity[] = [];
    _currentSessions.forEach( sess => {
      if (sess.timeOfLastReference.valueOf() < timeoutTime) {
        toDelete.push(sess);
      }
    });
    if (toDelete.length > 0) {
      Logger.debug(`Session.Expiration: expired ${toDelete.length} sessions`);
      toDelete.forEach( sess => {
        _currentSessions.delete(sess.senderKey);
      });
    };
  }, 1000 * 60 * 2 );
};

export const Sessions = {
  // Create a new AuthToken.
  createSession(pSenderKey?: string): SessionEntity {
    const aSession = new SessionEntity();
    aSession.sessionId = GenUUID();
    aSession.senderKey = pSenderKey;
    aSession.whenSessionCreated = new Date();
    aSession.timeOfLastReference = new Date();
    return aSession;
  },
  getSessionWithSessionId(pSessionId: string): SessionEntity {
    _currentSessions.forEach( sess => {
      if (pSessionId === sess.sessionId) {
        return sess;
      }
    });
    return null;
  },
  getSessionWithSenderKey(pSenderKey: string): SessionEntity {
    return _currentSessions.get(pSenderKey);
  },
  addSession(pSessionEntity: SessionEntity) : SessionEntity {
    _currentSessions.set(pSessionEntity.senderKey, pSessionEntity);
    return pSessionEntity;
  },
  removeSession(pSessionEntity: SessionEntity) : void {
    _currentSessions.delete(pSessionEntity.senderKey);
  },
  // touch a session to not that it has been used
  touchSession(pSession: SessionEntity): void {
    pSession.countReference++;
    pSession.timeOfLastReference = new Date();
  },
  // clear activity count to start over
  clearCounts(pSession: SessionEntity): void {
    pSession.countReference = 0;
  },
  *enumerate(pPager?: PaginationInfo): Generator<SessionEntity> {
    for (const sess of _currentSessions.values()) {
      if (pPager) {
         if (pPager.criteriaTest(sess)) {
           yield sess;
         };
      }
      else {
        yield sess;
      };
    };
  },
};


