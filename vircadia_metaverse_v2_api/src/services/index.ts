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
import { Application } from '../declarations';
import profiles from './profiles/profiles.service';
// Don't remove this comment. It's needed to format import lines nicely.
import users from './users/users.service';
import friends from './friends/friends.service';
import auth from './auth/auth.service';
import email from './email/email.service';
import connections from './connections/connections.service';
import accounts from './accounts/accounts.service';
import location from './location/location.service';
import domains from './domains/domains.service';
import mediaServices from './media/services';
import place from './place/place.service';
import current from './current/current.service';
import inventoryServices from './inventory/services';
import achievementItems from './achievement-items/achievement-items.service';
import achievement from './achievement/achievement.service';
import resetPassword from './reset-password/reset-password.service';
import itemHandler from './item-handler/item-handler.service';
import pickupItem from './pickup-item/pickup-item.service';
import questServices from './quest_apis/services';
import initMasterData from './init-master-data/init-master-data.service';
import resetUser from './reset-user/reset-user.service';
// import generateGoobie from './generate-goobie/generate-goobie.service';
import rewardItem from './rewards/reward.service';
import Explore from './explore/explore.service';
import domainsField from './domains/domains-fields/domains-field.service';
import placesField from './place/places-fields/place-field.service';
import accountField from './accounts/account-field/account-field.service';
import accountTokens from './accounts/account-tokens/account-tokens.service';
import statServices from './stats/services';
import accountPublickey from './accounts/account-publickey/account-publickey.service';
import domainPublicKey from './domains/domains-publickey/domains-publickey.service';
import domainTemp from './domains/domains_temp/domains-temp.service';
import sendVerifyMail from './send_verification_mail/send_verify_mail.service';
import verfifyUser from './verify_user/verify_user.service';
import userPlaces from './place/user-places/user-places.service';
import usersHeartbeat from './user_heartbeat/user_heartbeat.service';
import tokens from './tokens/tokens.service';
import oauthToken from './tokens/oauth_token/oauth-token.service';
import tokenTransfer from './token-transfer/token-transfer.service';
import ConnectionRequest from './connections_request/connections_request.service';
import tokenConfig from './tokens/token_config/token_config.service';
export default function (app: Application): void {
    app.configure(auth);
    app.configure(users);
    app.configure(friends);
    app.configure(accountTokens);
    app.configure(profiles);
    app.configure(accounts);
    app.configure(email);
    app.configure(connections);
    app.configure(location);
    app.configure(domains);
    app.configure(place);
    app.configure(current);
    mediaServices.forEach((service) => {
        app.configure(service);
    });
    inventoryServices.forEach((service) => {
        app.configure(service);
    });

    statServices.forEach((service) => {
        app.configure(service);
    });

    app.configure(achievementItems);
    app.configure(achievement);
    app.configure(resetPassword);
    app.configure(itemHandler);
    app.configure(pickupItem);

    questServices.forEach((service) => {
        app.configure(service);
    });
    app.configure(initMasterData);
    app.configure(resetUser);
    // app.configure(generateGoobie);
    app.configure(rewardItem);
    app.configure(domainsField);
    app.configure(placesField);
    app.configure(accountField);
    app.configure(Explore);
    app.configure(accountPublickey);
    app.configure(domainTemp);
    app.configure(sendVerifyMail);
    app.configure(verfifyUser);
    app.configure(domainPublicKey);
    app.configure(userPlaces);
    app.configure(usersHeartbeat);
    app.configure(tokens);
    app.configure(oauthToken);
    // app.configure(tokenTransfer);
    app.configure(ConnectionRequest);
    app.configure(tokenConfig);
}
