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
| maturity  | get the places with the specified maturity level |
| tags      | get places that have specified tags (comma separated list. Any tag matches) |
| per_page | number of entries to return per request |
| page_num | which group of entries to return |
| order    | comma separated list of 'ascending', 'decending', 'num_users', 'name' |

So, a legal request could be:

```
    GET /api/v1/places?per_page=20&page_num=4&order=ascending,num_users
    GET /api/v1/places?maturity=adult
    GET /api/v1/places?tags=friendly,kids,sandbox
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
                    "maturity": string,     // one of 'unrated', 'everyone', 'teen', 'mature', 'adult'
                    "tags": string[],       // tags describing place categories
                    "domain": {
                        "id": domainId,
                        "name": domainName,
                        "sponsorAccountId": string,
                        "network_address": string,
                        "ice_server_address": string,
                        "time_of_last_heartbeat": ISOStringDate,
                        "num_users": integer
                    },
                    "thumbnail": URL,
                    "images": [ URL, URL, ... ]
                },
                ...
            ],
            "maturity-categories": string[] // maturity categories for the grid
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
                    "maturity": string,     // one of 'unrated', 'everyone', 'teen', 'mature', 'adult'
                    "tags": string[],       // tags describing place categories
                    "domain": {
                        "id": domainId,
                        "name": domainName,
                        "sponsorAccountId": string,
                        "network_address": string,
                        "ice_server_address": string,
                        "time_of_last_heartbeat": ISOStringDate,
                        "num_users": integer
                    },
                    "thumbnail": URL,
                    "images": [ URL, URL, ... ]
                },
                ...
            ],
            "maturity-categories": string[] // maturity categories for the grid
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

## PUT /api/v1/places/:placeId

Legacy request that changes values in a place.

The requestor must be the account associated with the domain or an admin.

If the field "place.pointee_query" is passed, that is presumed to be the ID
of the domain that should be associated with the Place.

Setting fields is optional so only have to send those one wants to change.

```
    {
        'place': {
            'pointee_query': domainId,
            'path': stringAddress,
            'description': string,
            'thumbnail': stringURL
        }
    }
```

## GET /api/v1/places/{placeId}/field/{fieldname}

Get the value of an place field. The result returned is just the value of
that field.

This request is the opposite of the POST request that sets the values.

There are per-field permissions and value verification.
So the below table lists the permissions needed for doing a GET
of the field and the permissions to change the field value.

The place fields that can be fetched:

| FIELDNAME  | GET PERM | SET PERM    | TYPE |
| ---------  | -------- | --------    | ---- |
| placeId    |   all    |    none     | string |
| name       |   all    | domain, owner, admin | string |
| description |  all    | domain, owner, admin | string |
| domainId   |   all    |    none     | string |
| maturity   |   all    | domain, owner, admin | string |
| tags       |   all    | domain, owner, admin | stringArray |
| address    |   all    | domain, owner, admin | addressString |
| thumbnail  |   all    | domain, owner, admin | string |
| images     |   all    | domain, owner, admin | stringArray |
| addr_of_first_contact | all | none | string |
| when_place_entry_created | all | none | ISODate |

The JSON structure returned looks like the regular REST response
with the "data" object being the value requests.

```
GET /api/v1/places/f7e2bac9-ba02-4db7-bfd0-473286a502c6/field/address
```
returns

```
    {
        "status": "success",
        "data": "/23.4,33.6,10/0,0,0,1"
    }
```

```
GET /api/v1/places/f7e2bac9-ba02-4db7-bfd0-473286a502c6/field/images
```

returns:

```
    {
        "status": "success",
        "data": [ "https://example.com/image1.jpg", "https://example.com/image2.jpg", "https://example.com/image3.jpg" ]
    }
```

## POST /api/v1/places/{placeId}/field/{fieldname}

This request sets the value of a place field.
See the table under GET for the possible fields and the permissions
required to change account values.

The request to set a value POST's a JSON structure that gives
the value to set. So,

```
POST /api/v1/places/f7e2bac9-ba02-4db7-bfd0-473286a502c6/field/description
    {
        "set": "John's one and only domain"
    }
```

Note that the "set" element gives the value to set in the value.

For setting string arrays, one must send an array item manipulator
so:

```
POST /api/v1/places/f7e2bac9-ba02-4db7-bfd0-473286a502c6/field/images
    {
        "set": {
            "set": [ "https://example.com/myimage1.jpg", "https://example.com/myimage2.jpg" ],
            "add": [ "https://example.com/myimage5.jpg" ],
            "remove": [ "https://example.com/myimage8jpg" ]
        }
    }
```

This will set the "images" field to the "set" value, then add the "add" value
then remove the "remove" value. Of course, each of these manipulation fields
are optional so, if you wanted to add a new image, just having "add" will add
that image to the list.