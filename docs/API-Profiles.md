# MetaverseAPI - Account Profiles

## Profiles

"Profiles" is information about accounts that describes the personality
and personal information about the account.
Profiles can be fetched without logging into a metaverse-server account
thus only accounts that are marked "availability=all" are returned
as profiles.

## GET /api/v1/profiles

Get a list of account profiles.
The requestor does not need to be logged in thus only accounts that
have "availability" set to "all" are returned.

- per_page: maximum number of entries to return
- page: the group of "per_page" to return. For instance, if there are 100 users and `per_page=10` and `page=2`, the request will return entries 11 thru 20.
- status: status of user. A comma separated list of "online"
- asAdmin=true: if logged in account is administrator, list all accounts. Value is optional.

```
    {
        "status": "success",
        "data": {
            "profiles": [
                {
                    "accountId": "uniqueAccountId",
                    "username: "username",
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
                    "profile_detail": {},               // account detail information
                    "friends": [ "friendName", "friendName", ... ],
                    "connections": [ "connectionName", "connectionName", ...],
                    "when_account_created": "YYYY-MM-DDTHH:MM:SS.MMMZ",
                    "time_of_last_heartbeat": "YYYY-MM-DDTHH:MM:SS.MMMZ"
                },
                ...
            ]
        }
    }
```

## GET /api/v1/profile/{accountId}

Get the information for one account profile.

The passed "accountId" can be either the accountId (exact string as returned by
`/api/v1/profiles` or other requests) or the account's username (URI encoded string).

The information returned is the same as in the "/api/v1/profiles" but just
for one account so the information is for "account" and is not enclosed
in an array.

```
    {
        "status": "success",
        "data": {
            "profile": {
                INFORMATION AS DESCRIBED ABOVE
            }
        }
    }
```