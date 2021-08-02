# Metaverse API: Explore

Interface has an "Explore" dialog that lists places that a user can teleport to.
This request returns Place information that is compatible with this legacy dialog.

There are some additional fields providing new information that could be used
by future scripts.

Since this mimics the legacy 'Explore' request, the returned Place data gives
the name of the listed Place as "Domain name". 
The "Domain name" field will have the same value as "Place.name".
The "DomainId", though, is the ID of the domain that Place is in and additional
Domain information is given under "Place.

## GET /explore.json

This request takes a number of parameters to control the list of places returned.

| QUERY     | Description |
| -------   | --------- |
| maturity  | get the places with the specified maturity level |
| tag       | get places that have specified tags (comma separated list. Any tag matches) |
| per_page | number of entries to return per request |
| page_num | which "page" of entries to return |
| order    | comma separated list of 'ascending', 'decending', 'num_users', 'name' |
| search   | search on the place name. ( "search=fred" will return all Places whos name includes "fred") |
| status   | comma separated list of 'online' (domain is heartbeating), 'active' (has attendees) |

So, a legal request could be:

```
    GET /explore.json?per_page=20&page_num=4
    GET /explore.json?maturity=adult
    GET /explore.json?order=ascending,num_users&maturity=unrated
    GET /explore.json?tag=friendly,kids,sandbox
```

The response is a JSON array of Place descriptions.

```
  [
    {
        "Domain name": "place name",
        "Address": "domain-network-address/float,float,float/float,float,float,float",
        "Visit": "hifi://domain-network-address/float,float,float/float,float,float,float",
        "DomainId": "domainId",
        "Network Address": "domain network address",
        "Network Port": "domain network port",
        "Owner": "account name of domain owner",
        "People": number,
        "Place": {
            "placeId': string,
            "id': string,
            "name': "place name",
            "visibility': string,   // one of "open", "friends", "connections", "private"
            "path": "/float,float,float/float,float,float,float",
            "address": "domain-network-address/float,float,float/float,float,float,float",
            "description': "place description",
            "maturity': string,     // one of "everyone", "teen", "mature", "adult", "unrated"
            "tags': string[],
            "thumbnail': stringURL,
            "images': stringURLS[],
            // The following fields can be updated in realtime by a script at the Place
            "current_attendance': number,   // reported attendance at place
            "current_images': stringURLS[],
            "current_info': string,
            "current_last_update_time': "ISODateString",
            "current_last_update_time_s': integerUnixTimeSeconds
        },
    },
    ...
  ]
```