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

'use strict';

import express from 'express';

import APICORS        from './routes/CORS';
import APIActivities  from './routes/user_activities';
import APIUser        from './routes/users';
import APIAccounts    from './routes/accounts';
import APIDomain      from './routes/domains';
import APICommerce    from './routes/commerce';

const app = express();

app.use(APICORS);
app.use(APIActivities);
app.use(APIUser);
app.use(APIAccounts);
app.use(APIDomain);
app.use(APICommerce);

export default app;