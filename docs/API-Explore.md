# Metaverse API: Explore

Interface has an "Explore" dialog that lists places that a user can teleport to.
This request returns Place information that is compatible with this legacy dialog.

There are some additional fields providing new information that could be used
by future scripts.

## GET /explore.json

This request takes a number of parameters to control the list of places returned.

| QUERY     | Description |
| -------   | --------- |
| maturity  | get the places with the specified maturity level |
| tag       | get places that have specified tags (comma separated list. Any tag matches) |
| per_page | number of entries to return per request |
| page_num | which "page" of entries to return |

So, a legal request could be:

```
    GET /explore.json?per_page=20&page_num=4
    GET /explore.json?maturity=adult
    GET /explore.json?tag=friendly,kids,sandbox

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
      "Place": { place information as defined in [Places](./API-Places.md) }
    },
    ...
  ]
```