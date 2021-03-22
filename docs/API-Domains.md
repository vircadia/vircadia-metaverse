
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
                  "domainId": stringDomainId,
                  "id": stringDomainId,
                  "name": stringName,
                  "visibility": string,   // one of 'open', 'friends', 'connections', 'private'
                  "label": stringName,
                  "public_key": stringPublicKey,
                  "sponsor_account_id": stringAccountIdAssociated,
                  "ice_server_address": stringAddrIceServerBeingUsed,
                  "version": stringSoftwareVersion,
                  "protocol_version": stringProtocolVersion,
                  "network_address": stringNetworkAddress,
                  "automatic_networking": stringMode,  // one of "full", "ip", or "disabled"
                  "restricted": boolWhetherRestricted,
                  "num_users": intCurrentLoggedInUsers,
                  "anon_users": intCurrentAnonomousUsers,
                  "total_users": intTotalUsers,
                  "capacity": intMaxCapacity,
                  "description": stringDescription,
                  "maturity": stringMaturity,
                  "restriction": string,
                  "managers": [ username, username, ... ],
                  "tags": [ stringTag, stringTag, ... ],
                  "owner_places": [ placeInfo, placeInfo, ... ],
                  "meta": {
                        "capacity": intMaxCapacity,
                        "contact_info": string,
                        "description": stringDescription,
                        "images": [ imageURL, imageURL, ... ],
                        "thumbnail": imageURL,
                        "managers": [ hostname, hostname, ... ],
                        "restriction": string,
                        "tags": [ stringTag, stringTag, ... ],
                        "world_name": stringName
                  },
                  "users": {
                        "num_users": intCurrentLoggedInUsers,
                        "anon_users": intCurrentAnonomousUsers,
                        "user_hostnames": [];
                  },
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

The "placeInfo" returned in the "owner_places" array is the fields returned by [/api/v1/places](./API-Places.md#GET-apiv1places)
but without the "domain" information.

## GET /api/v1/domains/:domainId

Get the information for a single domain.

The request returns information:

```
  {
      "status": "success",
      "data": {
            "domain": {
                SAME INFORMATION AS ABOVE
           }
      }
  }
```

## PUT /api/v1/domains/:domainId

Sets values for the specified domain. The requestor must be either
the domain "manager" or an account with "admin" role.

The request has the following form. All fields are optional and, if
not included, the value is not set.

```
  {
      "domain": {
          "name": stringName,
          "version": stringSoftwareVersion,
          "protocol": stringProtocolVersion,
          "network_address": stringNetworkAddress,
          "restricted": boolWhetherRestricted,
          "capacity": intMaxCapacity,
          "description": stringDescription,
          "maturity": stringMaturity,
          "restriction": string,
          "managers": [ hostUsername1, hostUsername1, ... ],
          "tags": [ stringTag, stringTag, ... ],
          "heartbeat": {
              "num_users": intUsers,
              "anon_users": intAnonUsers
          }
      }
  }
```

## GET /api/v1/domains/{domainId}/field/{fieldname}

Get the value of an domain field. The result returned is just the value of
that field.

This request is the opposite of the POST request that sets the values.

There are per-field permissions and value verification.
So the below table lists the permissions needed for doing a GET
of the field and the permissions to change the field value.

The domain fields that can be fetched:

| FIELDNAME     | GET PERM | SET PERM   | TYPE |
| ---------     | -------- | --------   | ---- |
| domainId      |    all   | noone      |string |
| name          |    all   | domain sponsor admin | string |
| visibility    |    all   | domain sponsor admin | string |
| public_key    |    all   | domain     | string |
| sponsor_account_id | all | domain sponsor admin | string |
| version       |    all   | domain     | string |
| protocol      |    all   | domain     | string |
| network_address |  all   | domain     | string |
| automatic_networking |  all   | domain     | string |
| num_users     |    all   | domain     | string |
| num_anon_users |   all   | domain     | string |
| restricted    |    all   | domain sponsor admin | string |
| capacity      |    all   | domain sponsor admin | string |
| description   |    all   | domain sponsor admin | string |
| contact_info  |    all   | domain sponsor admin | string |
| maturity      |    all   | domain sponsor admin | string |
| restriction   |    all   | domain sponsor admin | string |
| managers      |    all   | domain sponsor admin | stringArray |
| tags          |    all   | domain sponsor admin | stringArray |
| thumbnail     |    all   | domain sponsor admin | string |
| images        |    all   | domain sponsor admin | stringArray |
| addr_of_first_contact    | all   | noone | string |
| when_domain_entry_created | all  | noone | ISODateString |
| time_of_last_heartbeat   | all   | noone | ISODateString |
| last_sender_key | all    | noone | string |

The JSON structure returned looks like the regular REST response
with the "data" object being the value requests.

```
GET /api/v1/domains/f7e2bac9-ba02-4db7-bfd0-473286a502c6/field/email
```
returns

```
    {
        "status": "success",
        "data": "someperson@example.com"
    }
```

```
GET /api/v1/domains/f7e2bac9-ba02-4db7-bfd0-473286a502c6/field/friends
```

returns:

```
    {
        "status": "success",
        "data": [ "fred", "barney", "MrRumble" ]
    }
```

## POST /api/v1/domains/{domainId}/field/{fieldname}

This request sets the value of an account field.
See the table under GET for the possible fields and the permissions
required to change account values.

The request to set a value POST's a JSON structure that gives
the value to set. So,

```
POST /api/v1/domains/f7e2bac9-ba02-4db7-bfd0-473286a502c6/field/images_hero
    {
        "set": "http://mysite.example.com/buff-images/smiling.jpg"
    }
```

Note that the "set" element gives the value to set in the value.

For setting string arrays, one must send an array item manipulator
so:

```
POST /api/v1/domains/f7e2bac9-ba02-4db7-bfd0-473286a502c6/field/friends
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
## DELETE /api/v1/domains/:domainId

Delete the specified domain.

The requestor must supply an account token of either an administrator or the sponsor
account for the domain.
