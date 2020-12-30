# Vircadia Metaverse API

Vircadia's Iamus metaverse-server presents a REST API
for the services for a metaverse.

A "metaverse" is defined as a group of virtual world spaces (provided
by domain-servers) that share a common set of users and interest groups.
The metaverse-server handles the common operations between the world spaces
by managing the user accounts, the relationships between the users
(friends and connections), and the interest groups.
Additionally, the metaverse server coordinates services between the
world spaces -- services like audio and chat.

In general, requests are REST requests made to an URL. The 'Authorization:'
HTTP header field contains an access token for the requestor.
The operations possible and the data returned depends on the access
afforded by the passed access token. For instance, an access token
for a particular user will fetch user location information for other
accounts that are that account's friends and connections.

Refer to the [API Overview](./API-Overview.md) for general API design
(request and response format and usage conventions).
Documentation referenced below is available for the
[Accounts](./API-Accounts.md),
[Domains](./API-Domains.md),
[Places](./API-Places.md),
[Tokens](./API-Tokens.md),
[User](./API-Users.md),
[Profiles](./API-Profiles.md),
and
[Monitoring](./API-Monitoring.md),
categories.

The API requests to the metaverse-server are:

| OP     | URL | DESCRIPTION |
| ------ | --- | ----------- |
| GET    | /api/v1/accounts                  | [doc](./API-Accounts.md#get-apiv1accounts) fetch list of account information |
| POST   | /api/v1/account/:accountId        | [doc](./API-Accounts.md#post-apiv1accountaccountid) update account parameters |
| DELETE | /api/v1/account/:accountId        | [doc](./API-Accounts.md#delete-apiv1accountaccountid) delete account |
| GET    | /api/v1/account/:accountId/field/:fieldname | [doc](./API-Accounts.md#get-apiv1accountaccountidfieldfieldname) fetch specific account parameter |
| POST   | /api/v1/account/:accountId/field/:fieldname | [doc](./API-Accounts.md#post-apiv1accountaccountidfieldfieldname) update specific account parameter |
| GET    | /api/v1/account/:accountId/tokens | [doc](./API-Accounts.md#get-apiv1accountaccountidtokens) fetch tokens associated with account |
| DELETE | /api/v1/account/:accountId/tokens/:tokenId | [doc](./API-Accounts.md#delete-apiv1accountaccountidtokenstokenid) delete accounts token |
| GET    | /api/v1/commerce/available_updates | legacy request |
| GET    | /api/v1/commerce/hfc_accounts      | legacy request |
| GET    | /api/v1/commerce/history           | legacy request |
| GET    | /api/v1/commerce/marketplace_key   | legacy request |
| GET    | /api/v1/domains                    | [doc](./API-Domains.md#) fetch list of domain information |
| GET    | /api/v1/domains/:domainId          | [doc](./API-Domains.md#get-apiv1domainsdomainid) fetch information for a domain |
| PUT    | /api/v1/domains/:domainId          | [doc](./API-Domains.md#put-apiv1domainsdomainid) update domain parameters |
| DELETE | /api/v1/domains/:domainId          | [doc](./API-Domains.md#delete-apiv1domainsdomainid) delete a domain entry |
| GET    | /api/v1/domains/:domainId/field/:fieldname  | [doc](./API-Domains.md#get-apiv1domainsdomainidfieldfieldname) fetch specific account parameter |
| POST   | /api/v1/domains/:domainId/field/:fieldname  | [doc](./API-Domains.md#post-apiv1domainsdomainidfieldfieldname) update specific account parameter |
| PUT    | /api/v1/domains/:domainId/ice_server_address  | [doc](./API-Domains.md#put-apiv1domainsdomainidiceserveraddress) set the ice-server used by domain |
| GET    | /api/v1/domains/:domainId/public_key | [doc](./API-Domains.md#get-apiv1domainsdomainidpublic_key) get the public key for a domain |
| PUT    | /api/v1/domains/:domainId/public_key | [doc](./API-Domains.md#put-apiv1domainsdomainidpublic_key) update public key used by domain |
| POST   | /api/v1/domains/temporary            | [doc](./API-Domains.md#post-apiv1domainstemporary) create a domain temporary name/entry |
| GET    | /api/v1/places                  | [doc](./API-Places.md#get-apiv1places) get list of visitable places |
| GET    | /api/v1/tokens                  | [doc](./API-Tokens.md#get-apiv1tokens) fetch list of created tokens |
| POST   | /api/v1/token/new               | [doc](./API-Tokens.md#post-apiv1tokennew) create a new token for account/domain |
| POST   | /api/v1/user/connection_request | [doc](./API-Users.md#post-apiv1userconnection_request) request friend/connection |
| GET    | /api/v1/user/friends            | [doc](./API-Users.md#get-apiv1userfriends) fetch list of friends |
| POST   | /api/v1/user/friends            | [doc](./API-Users.md#post-apiv1userfriends) update list of friends |
| DELETE | /api/v1/user/friends            | [doc](./API-Users.md#delete-apiv1userfriends) delete a friend from list of friends |
| PUT    | /api/v1/user/heartbeat          | [doc](./API-Users.md#put-apiv1userheartbeat) update user location/login information |
| PUT    | /api/v1/user/location           | [doc](./API-Users.md#put-apiv1userlocation) update user location information |
| GET    | /api/v1/user/location           | [doc](./API-Users.md#get-apiv1userlocker) fetch per-user parameters |
| POST   | /api/v1/user/location           | [doc](./API-Users.md#post-apiv1userlocker) update per-user parameters |
| GET    | /api/v1/user/location           | [doc](./API-Users.md#get-apiv1userprofile) get this user's profile |
| GET    | /api/v1/user/places/            | [doc](./API-places.md#get-apiv1userplaces) fetch requesting user's places |
| POST   | /api/v1/user/places/            | [doc](./API-places.md#post-apiv1userplaces) create a place |
| GET    | /api/v1/user/places/:placeId    | [doc](./API-places.md#get-apiv1userplacesplaceId) get information on specific place |
| DELETE | /api/v1/user/places/:placeId    | [doc](./API-places.md#delete-apiv1userplacesplaceId) delete a place |
| GET    | /api/v1/user/places/:placeId/field/:fieldname  | [doc](./API-places.md#get-apiv1userplacesplaceidfieldfieldname) fetch specific place parameter |
| POST   | /api/v1/user/places/:placeId/field/:fieldname  | [doc](./API-places.md#post-apiv1userplacesplaceidfieldfieldname) set specific place parameter |
| PUT    | /api/v1/user/public_key         | [doc](./API-Users.md#put-apiv1userpublic_key) update this user's public key |
| GET    | /api/v1/users                   | [doc](./API-Users.md#get-apiv1users) fetch list of user information |
| POST   | /api/v1/users                   | [doc](./API-Users.md#post-apiv1users) create account |
| GET    | /api/v1/users/:username/location  | [doc](./API-Users.md#) fetch a particular user's location |
| GET    | /api/v1/users/:username/public_key | [doc](./API-Users.md#) fetch a particular user's public_key |
| GET    | /api/v1/profiles                | [doc](./API-Profiles.md#) fetch account profiles |
| GET    | /api/v1/profile/:accountId      | [doc](./API-Profiles.md#get-apiv1profileaccountId) fetch specific account profile |
| POST   | /api/v1/user_activities         | update the user activitiy state |
| GET    | /api/v1/user_stories            | fetch stories |
| POST   | /oauth/token                    | [doc](./API-Tokens.md#post-oauthtoken) OAUTH2 login |
| GET    | /user/tokens/new                | [doc](./API-Tokens.md#get-usertokensnew) legacy initial token request |
