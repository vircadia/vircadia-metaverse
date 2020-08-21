
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

## GET /api/v1/domains/:domainId

Get the information for a single domain.

The request returns information:

```
  {
    "domain": {
      "id": stringDomainId,
      "name": stringPlaceName,
      "ice_server_address": stringAddrIceServerBeingUsed
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
          "place_name": stringName,
          "version": stringSoftwareVersion,
          "protocol": stringProtocolVersion,
          "network_addr": stringNetworkAddress,
          "restricted": boolWhetherRestricted,
          "capacity": intMaxCapacity,
          "description": stringDescription,
          "maturity": stringMaturity,
          "restriction": string,
          "hosts": [ hostUsername1, hostUsername1, ... ],
          "tags": [ stringTag, stringTag, ... ],
          "heartbeat": {
              "num_users": intUsers,
              "anon_users": intAnonUsers
          }
      }
  }
```

## DELETE /api/v1/domains/:domainId

Delete the specified domain.

The requestor must supply an account token of an administrator.