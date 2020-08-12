# MetaverseAPI - Account Management

- [Accounts](#Accounts)
- [Account Tokens](#AccountTokens)
- [Domains](#Domains)


## Accounts

## GET /api/v1/accounts

Get a list of accounts. The requestor must be logged in and normally it will
return only the user's 'connections'. If the requestor
is an administrator and the URL includes the query "asAdmin", all accounts
are returned (limited by pagination).

- per_page: maximum number of entries to return
- page: the group of "per_page" to return. For instance, if there are 100 users and `per_page=10` and `page=2`, the request will return entries 11 thru 20.
- filter: select type of user. A comma separated list of "connections", "friends"
- status: status of user. A comma separated list of "online"
- search: TODO: figure this one out
- asAdmin: if logged in account is administrator, list all accounts. Value is optional.

```
    {
        "status": "success",
        "data": {
            "accounts": [
                {
                    "accountid": "uniqueAccountId",
                    "username: "username",
                    "email": "email",
                    "public_key": "usersPublicKey",
                    "images": {
                        "hero": stringUrlToImage,
                        "thumbnail": stringUrlToImage,
                        "tiny": stringUrlToImage
                    },
                    "location": {
                        "connected": false,             // whether currently active
                        "path": "/X,Y,Z/X,Y,Z,W",
                        "placeid": stringIdOfPlace,
                        "domainid": stringIdOfDomain,
                        "availability": stringWhoCanSee // one of "all", "none", "connections", "friends"
                    },
                    "friends": [ "friendName", "friendName", ... ],
                    "connections": [ "connectionName", "connectionName", ...],
                    "administator": false,
                    "when_account_created": "YYYY-MM-DDTHH:MM:SS.MMMZ",
                    "time_of_last_heartbeat": "YYYY-MM-DDTHH:MM:SS.MMMZ"
                },
                ...
            ]
        }
    }
```

## POST /api/v1/account/{accountId}

Update account information.

The requestor must be either the account being modified or an administrator account.

The POST body has the same format as the GET request. If a field is present, then that
value is modified. Most of the fields cannot be modified, though, and these are ignored.

The fields that can be changed are:

```
    {
        "accounts": {
            "username": newUsername,
            "email": newEmail,
            "public_key": newPublicKey,
            "images": {
                "hero": newHeroImageUrl,
                "thumbnail: newThumbnailImageUrl,
                "tiny": newTinyImageUrl
            }
        }
    }
```

## DELETE /api/v1/account/{accountId}

Delete an account.

The requestor must be an administrator.

## POST /api/v1/users

Request for creating an account.

The following is sent in the POST request:

```
    {
        "user": {
            "username": stringUserName,
            "password": stringPassword,
            "email": stringEmail
        }
    }
```

A successful creation, will return:

```
    {
        "status": "success"
    }
```

---

## Account Tokens

## GET /api/v1/account/{accountId}/tokens

Get the tokens held by the account. The requesting account must be
logged in and be either the account identified in "{accountId}" or
be an administrative account.

```
    {
        "status": "success",
        "data": {
            "tokens": [
                {
                    "tokenid": stringTokenIdentifier,
                    "token": stringToken,
                    "refresh_token": stringTokenForRefreshingToken,
                    "token_creation_time": "YYYY-MM-DDTHH:MM:SS.MMMZ",
                    "token_expiration_time": "YYYY-MM-DDTHH:MM:SS.MMMZ",
                    "scope": stringScope    // one of "any", "owner", "domain", "web"
                },
                ...
            ]
        }
    }
```

## DELETE /api/v1/account/{accountId}/tokens/{tokenId}

Delete a particular token held by account.

---

## Domains

## GET /api/v1/domains

Get information on the domains the metaverse-server knows about.

The requester must include an account access token in the header of the request.

Query parameters can be included to control the number of returned domains.

- per_page: maximum number of entries to return
- page: the group of "per_page" to return. For instance, if there are 100 users and `per_page=10` and `page=2`, the request will return entries 11 thru 20.

A request returns an array of domain descriptions:


```
    {
        "status": "success",
        "data": {
            "domains": [
                {
                    "domainid": stringDomainId,
                    "place_name": stringName,
                    "public_key": stringPublicKey,
                    "sponser_accountid": stringAccountIdAssociated,
                    "ice_server": stringAddrIceServerBeingUsed,
                    "version": stringSoftwareVersion,
                    "protocol_version": stringProtocolVersion,
                    "network_addr": stringNetworkAddress,
                    "networking_mode": stringMode,  // one of "full", ...
                    "restricted": boolWhetherRestricted,
                    "num_users": intCurrentLoggedInUsers,
                    "anon_users": intCurrentAnonomousUsers,
                    "total_users": intTotalUsers,
                    "capacity": intMaxCapacity,
                    "description": stringDescription,
                    "maturity": stringMaturity,
                    "restriction": string,
                    "hosts": [],
                    "tags": [ stringTag, stringTag, ... ],
                    "time_of_last_heartbeat": "YYYY-MM-DDTHH:MM:SS.MMMZ",
                    "last_sender_key": stringHostPortSourceOfLastMessage,
                    "addr_of_first_contact": stringHostPortOfDomainEntryCreation,
                    "when_domain_entry_created": "YYYY-MM-DDTHH:MM:SS.MMMZ"
                },
                ...
            ]
        }
    }
```

## DELETE /api/v1/domain/%

Delete the specified domain.

The requestor must supply an account token of an administrator.
