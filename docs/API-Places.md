# MetaverseAPI - Place Management

Requests that create and manage Place entries.

Places are basicly location "bookmarks" that are created by a domain owner
to denote locations of interest in a domain.

Places are created by a domain "owner" using
[POST /api/v1/user/places](./API-Places.md#post-apiv1userplaces).
The domain "owner" is the account that is associated with the 
domain (the account that registered the domain with the metaverse-server).

## GET /api/v1/places

Get the list of places. Returns all the places.

This request takes a number of parameters to control the list of places returned.

| QUERY     | Description |
| -------   | --------- |
| per_page | number of entries to return per request |
| page_num | which group of entries to return |
| order    | comma separated list of 'ascending', 'decending', 'num_users', 'name' |

So, a legal request could be:

```
    GET /api/v1/places?per_page=20&page_num=4&order=ascending,num_users
```

This request return JSON formatted as:

```
    {
        "status": "success",
        "data": {
            "places": [
                {
                    "placeId": string,
                    "name": string,
                    "address": string,
                    "description": string,
                    "domain": {
                        "id": domainId,
                        "name": domainName,
                        "network_address": string,
                        "ice_server_address": string,
                        "time_of_last_heartbeat": ISOStringDate,
                        "num_users": integer
                    },
                    "accountId": string,
                    "thumbnail": URL,
                    "images": [ URL, URL, ... ]
                },
                ...
            ]
        }
    }
```

## GET /api/v1/user/places

Get the list of places.

This only returns the places the requestor "owns". That is, the places for
domains the requestor is the associated account of.


```
    {
        "status": "success",
        "data": {
            "places": [
                {
                    "placeId": string,
                    "name": string,
                    "address": string,
                    "description": string,
                    "domain": {
                        "id": domainId,
                        "name": domainName,
                        "network_address": string,
                        "ice_server_address": string,
                        "time_of_last_heartbeat": ISOStringDate,
                        "num_users": integer
                    },
                    "accountId": string,
                    "thumbnail": URL,
                    "images": [ URL, URL, ... ]
                },
                ...
            ]
        }
    }
```

## GET /api/v1/user/places/{placeId}

Get the place information for one place.

```
    {
        "status": "success",
        "data": {
            "place": {
                SAME INFORMATION AS RETURNED ABOVE
            }
        }
    }
```

## POST /api/v1/user/places

Create a place entry. A place points to a domain so creation information
contains a domainId of the domain the place points to.

To create a place, one must either be an admin account or
the account that is associated with  the domain.

The address is formatted as "/x,y,z/x,y,z,w".

```
    {
        "place": {
            "name": placeName,
            "description": descriptionText,
            "address": addressString,
            "domainId": domainId
        }
    }
```

The response for a successful creation looks like the
response for the one place entry GET operation.

## DELETE /api/v1/user/places/{placeId}

Delete the place entry.

The requestor must be either an admin account or the
account associated with the domain.
