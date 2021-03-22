# MetaverseAPI - Place Management

Requests that create and manage Place entries.

Places are location "bookmarks" that are created by a domain owner
to denote locations of interest in a domain.
The list of places is used for an "Explore" dialog so users can
find interesting locations to visit.

Places are created by a domain owner/manager using
[POST /api/v1/user/places](./API-Places.md#post-apiv1userplaces).
The domain owner/manager is the account(s) associated with the 
domain (the account that registered the domain with the metaverse-server
or an account that is flagged as a manager of the domain).

A Place is described with a name, description, images, and other
identifying information. The Place name is unique within the metaverse-server.
A Place also has an identifying ID.
A Place owner/manager can update several of the Place information items with
[PUT /api/v1/places/{placeID}](./API-Places.md#post-apiv1placesplaceid)
or can update values individually with
[POST /api/v1/places/{placeID}/field/{fieldname}](./API-Places.md#post-apiv1placesplaceidfieldfieldname)
.

Places have "current" information which is updated with
[POST /api/v1/places/current](./API-Places.md#post-apiv1placescurrent).
The current information includes an attendance number along
with images and other info.
The idea is that a particular Place can have a script which updates
the current attendance for the Place as well as updating current
images of what's happening at the place.
This provides a real-time update of the Place's activity.

By default, the current attendance is the domain's avatar count.
If the attendance has ever been set by
[POST /api/v1/places/current](./API-Places.md#post-apiv1placescurrent)
,
the attendance will be zeroed if it has not been updated in the
last hour.
So, if a Place never sets current attendance, it will report the
domain's avatar count. If the Place has a current attendance
script, the Place will report that attendance or zero depending
if the script has been updating the attendance count.

Access to update the current information is controlled by an
`APIkey`. The `APIkey` is visible to the domain owner and managers
in the
[GET /api/v1/places/{placeId}](./API-Places.md#get-apiv1placeplaceid)
request or by the fetch of the place field `current_api_key`.
The `APIkey` is created when the place is created and can be
recreated by doing a
[POST /api/v1/places/current/refreshkey](./API-Places.md#get-apiv1placecurrentrefreshkey)
request.
Of course, the `APIkey` should be kept as secret as possible.

## GET /api/v1/places

Get the list of places. Returns all the places.

This request takes a number of parameters to control the list of places returned.

| QUERY     | Description |
| -------   | --------- |
| maturity  | get the places with the specified maturity level ("unrated", "adult", "mature", "teen", "everyone") |
| tag       | get places that have specified tags (comma separated list. Any tag matches) |
| per_page | number of entries to return per request |
| page_num | which "page" of entries to return |
| order    | comma separated list of 'ascending', 'decending', 'num_users', 'name' |
| search   | search on the place name. ( "search=fred" will return all Places whos name includes "fred") |
| status   | comma separated list of 'online' (domain is heartbeating), 'active' (has attendees) |

So, a legal request could be:

```
    GET /api/v1/places?per_page=20&page_num=4&order=ascending,num_users
    GET /api/v1/places?maturity=adult
    GET /api/v1/places?tag=friendly,kids,sandbox
```

(Note: as of February 2021, "order" and "status" queries are not yet implimented.)

This request return JSON formatted as:

```
    {
        "status": "success",
        "data": {
            "places": [
                {
                    "placeId": string,
                    "name": string,
                    "visibility": string,   // one of 'open', 'friends', 'connections', 'private'
                    "path": string,
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
                    "current_attendance": number,
                    "current_images": string[],
                    "current_info": string,
                    "current_last_update_time": ISOStringDate
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
                    <Same format as shown in /api/v1/places>
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
                <Same format as shown in /api/v1/places>
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

## PUT /api/v1/places/{placeId}

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
| name       |   all    | domainOwner, admin | string |
| description |  all    | domainOwner, admin | string |
| visibility |    all   | domainOwner, admin | string |
| domainId   |   all    |    none     | string |
| maturity   |   all    | domainOwner, admin | string |
| tags       |   all    | domainOwner, admin | stringArray |
| address    |   all    | domainOwner, admin | addressString |
| thumbnail  |   all    | domainOwner, admin | string |
| images     |   all    | domainOwner, admin | stringArray |
| current_attendance | all | none | number |
| current_images | all | domainOwner, admin | stringArray |
| current_info | all | domainOwner, admin | string |
| current_last_update_time | all | none | ISODateString |
| current_api_key | domainOwner, admin | none | string |
| addr_of_first_contact | all | none | string |
| when_place_entry_created | all | none | ISODateString |

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
is optional so, if you wanted to add a new image, just having "add" will add
that image to the list.

## POST /api/v1/places/current

Update the Place's current activity information.

This request does not need any authentication.

The body of the request must include a `placeId`
and a `current_api_key` and the other fields are optional.

```
    {
        "placeId": string,
        "current_api_key": string,
        "current_attendance": number,
        "current_images": string[],
        "current_info": string,
    }
```

The response is either "success" or "failure".
For "failure", the `error` field will state the reason for the failure.

## POST /api/v1/places/current/refreshkey

A request to change the current information setting APIkey.
This causes any existing key to be revoked and deleted and
a new key to be generated.

The requestor must be logged in as the domain owner, a 
manager of the domain, or an administration account.

The body of the request must include a `placeId`
and a `current_api_key` with the latter being the APIkey
that is being replaced.

If the logged in account is an administrator and the query
includes "asAdmin=true", `current_api_key` is optional.

```
    {
        "placeId": string,
        "current_api_key": string,
    }
```
