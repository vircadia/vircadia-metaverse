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

import { MongoClient } from 'mongodb';
import { Application } from './declarations';
import { IsNotNullOrEmpty } from './utils/Misc';
import config from './appconfig';

export default function (app: Application): void {
    let connection = '';
     console.log("==>>>>>Connecting");
    if (IsNotNullOrEmpty(config.database.databaseUrl)) {
        connection = config.database.databaseUrl || '';
    } else {
        //const userSpec = `${config.database.dbUserName}:${config.database.dbPassword}`;
        const hostSpec = `${config.database.host}:${config.database.port}`;
        let optionsSpec = '';
        if (config.database.authSource !== 'admin') {
            optionsSpec += `?authSource=${config.database.authSource}`;
        }

        //connection = `mongodb://${userSpec}@${hostSpec}/${optionsSpec}`; //With auth
        connection = `mongodb://${hostSpec}/${optionsSpec}`; //Without auth
    }
    const database = config.database.dbName;
    console.log("==>>>>>",connection);
    const mongoClient = MongoClient.connect(connection).then((client) =>
        client.db(database)
    );
    app.set('mongoClient', mongoClient);
}
