
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
                  "ice_server_address": stringAddrIceServerBeingUsed,
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
                  "meta": JSONdomainMetadata,
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
      "domainid": stringDomainId,
      "id": stringDomainId,       // added for backward compatibility
      "place_name": stringName,
      "name": stringPlaceName,    // added for backward compatibility
      "public_key": stringPublicKey,
      "sponser_accountid": stringAccountIdAssociated,
      "ice_server_address": stringAddrIceServerBeingUsed,
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
      "meta": JSONdomainMetadata,
      "hosts": [],
      "tags": [ stringTag, stringTag, ... ],
      "time_of_last_heartbeat": "YYYY-MM-DDTHH:MM:SS.MMMZ",
      "last_sender_key": stringHostPortSourceOfLastMessage,
      "addr_of_first_contact": stringHostPortOfDomainEntryCreation,
      "when_domain_entry_created": "YYYY-MM-DDTHH:MM:SS.MMMZ"
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
          },
          "meta": JSONmetadata
      }
  }
```

The 'meta' field is arbitrary JSON encoded information to be added
to the domain's information. This information is not processed by
the metaverse-server but is stored and returned for the domain.
When PUT, the new value is "deep merged" with any existing data.
That is, fields in the PUT data, no matter how deep in the JSON
structure, will overlay existing values.
Future feature: Values can be removed
from the stored meta-data structure by passing the JSON "null"
as the label's value (i.e., any label with the value "null" will
be removed).

## DELETE /api/v1/domains/:domainId

Delete the specified domain.

The requestor must supply an account token of an administrator.