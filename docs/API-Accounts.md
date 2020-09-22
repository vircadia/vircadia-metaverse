# MetaverseAPI - Account Management

- [Accounts](#Accounts)
- [Account Tokens](#AccountTokens)

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
- asAdmin=true: if logged in account is administrator, list all accounts. Value is optional.

```
    {
        "status": "success",
        "data": {
            "accounts": [
                {
                    "accountId": "uniqueAccountId",
                    "username: "username",
                    "email": "email",
                    "public_key": "usersPublicKey",     // stripped PEM public key
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
                    "administator": false,              // 'true' if has "admin" role
                    "roles": [ "role", "role", ... ],   // roles of "user", "admin", ...
                    "when_account_created": "YYYY-MM-DDTHH:MM:SS.MMMZ",
                    "time_of_last_heartbeat": "YYYY-MM-DDTHH:MM:SS.MMMZ"
                },
                ...
            ]
        }
    }
```

## GET /api/v1/account/{accountId}

Get the information for one account. The requestor must either be the
account owner or an admin account.

The information returned is the same as in the "/api/v1/accounts" but just
for one account so the information is for "account" and is not enclosed
in an array.

```
    {
        "status": "success",
        "data": {
            "account": {
                INFORMATION AS DESCRIBED ABOVE
            }
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

## GET /api/v1/account/{accountId}/field/{fieldname}

Get the value of an account field. The result returned is just the value of
that field.

This request is the opposite of the POST request that sets the values.

There are per-field permissions and value verification.
So the below table lists the permissions needed for doing a GET
of the field and the permissions to change the field value.

The account fields that can be fetched:

| FIELDNAME   | GET PERM | SET PERM    | TYPE |
| ---------   | -------- | --------    | ---- |
| accountId   |   all    | noone        |   string |
| username    |   all    | owner admin |   string |
| email       |   all    | owner admin |   string |
| account_settings | all | owner admin |   string |
|images_hero  |   all    | owner admin |   string |
|images_tiny  |   all    | owner admin |   string |
|images_thumbnail |  all | owner admin |   string |
|availability |   all    | owner admin |   stringArray |
|connections  | owner admin friend connection |   owner admin |   stringArray |
|friends      | owner admin friend connection |   owner admin |   stringArray |
|locker       | owner admin | owner admin |   string |
|password     |   none   | owner admin |   string |
|public_key   |   all    | owner admin |   string |
|xmpp_password | owner   | owner admin |   string |
|discourse_api_key | owner | owner admin |   string |
|wallet_id    |  owner   | owner admin |   string |
|roles        |   all    | admin       |   stringArray |
|ip_addr_of_creator | all | noone       |   string |
|when_account_created | all | noone     |   ISODateString |
|time_of_last_heartbeat | all | noone   |   ISODateString |

The JSON structure returned looks like the regular REST response
with the "data" object being the value requests.

```
GET /api/v1/account/f7e2bac9-ba02-4db7-bfd0-473286a502c6/field/email
```
returns

```
    {
        "status": "success",
        "data": "someperson@example.com"
    }
```

```
GET /api/v1/account/f7e2bac9-ba02-4db7-bfd0-473286a502c6/field/friends
```

returns:

```
    {
        "status": "success",
        "data": [ "fred", "barney", "MrRumble" ]
    }
```

## POST /api/v1/account/{accountId}/field/{fieldname}

This request sets the value of an account field.
See the table under GET for the possible fields and the permissions
required to change account values.

The request to set a value POST's a JSON structure that gives
the value to set. So,

```
POST /api/v1/account/f7e2bac9-ba02-4db7-bfd0-473286a502c6/field/images_hero
    {
        "set": "http://mysite.example.com/buff-images/smiling.jpg"
    }
```

Note that the "set" element gives the value to set in the value.

For setting string arrays, one must send an array item manipulator
so:

```
POST /api/v1/account/f7e2bac9-ba02-4db7-bfd0-473286a502c6/field/friends
    {
        "set": {
            "set": [ "friend1", "friend2" ],
            "add": [ "friend3" ],
            "remove": [ "friend2" ]
        }
    }
```

This will set the "friends" field to the "set" value, then add the "add" value
then remove the "remove" value. Of course, each of these manipulation fields
are optional so, if you wanted to add a new friend, just having "add" will add
that friend to the list.

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
                    "scope": [ "scope1", "scope2", ... ]  // one of "any", "owner", "domain", "web"
                },
                ...
            ]
        }
    }
```

## DELETE /api/v1/account/{accountId}/tokens/{tokenId}

Delete a particular token held by account.

---
