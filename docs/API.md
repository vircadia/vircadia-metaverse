# Vircadia Metaverse API

Vircadia's Project Apollo metaverse-server presents a REST API
for the services for a metaverse.

A "metaverse" is defined as a group of virtual world spaces (provided
by domain-servers) that share a common set of users and interest groups.
The metaverse-server handles the common operations between the world spaces
by managing the user accounts, the relationships between the users
(friends and connections), and the interest groups.
Additionally, the metaverse server coordinates services between the
world spaces -- services like audio and chat.

The domain-servers and any browser interfaces interact with the
metaverse-server through REST API calls. In general, a requestor
does a GET, PUT, POST, or DELETE HTTP operation on an endpoint
and gets back a `application/json` body response of the form:

```
    {
        "status": "success",
        "data": JSON-object
    }
```

where the "JSON-object" is the response data.

If the request failed, for some reason, the status value will be "fail".

Authorization to make the calls is through access tokens that are
included in the "Authorization:" HTTP header of the REST request.
Access tokens are aquired by giving user account information
(currently limited to account/password). See the
[/oauth/token](./API-Tokens.md#post-oauthtoken)
request.

## Metaverse_info

The metaverse-server has an information API. A GET operation
returns information about the metaverse-server itself:

Here is an example response for a possible metaverse.

GET /api/metaverse_info

```
    {
        "metaverse_name": "BlueStuff Test Metaverse",
        "metaverse_nick_name": "BlueStuff",
        "metaverse_url": "http://metaverse.bluestuff.org:9400",
        "ice_server_url": "ice.blueplace.org:7337",
        "metaverse_server_version": "1.1.58-alpha+71ea34fac0",
    }
```

Any key/value information can be included in the response by a particular metaverse-server
but these are the default items returned.

## Operations

User access to the metaverse-server starts by getting an access token.
The
[/oauth/token](./API-Tokens.md#post-oauthtoken)
request accepts a username and password and returns an access token.
The token comes with a type (usually "Bearer") and a refresh token.
The refresh token is used to extend an access token's expiration time.
All tokens have an expiration time after which they become invalid.

After aquiring an access token, future requests must include this
token in the HTTP header.

```
    Authorization: Bearer 98793872341897231723098172348190283-401729304289
```

The access granted by the access token depends on the account. Administrative
accounts will have wide access to the information on the metaverse server
while plain user accounts will be limited to their connections and personal information.

With the access token, requests are made for information on
[Accounts](./API-Accounts.md),
[Users](./API-Users.md),
and
[Tokens](./API-Tokens.md)

## Account Creation

A new account can be created with the
[POST /api/v1/users](./API-Accounts.md#post-apiv1users)
request.
This accepts basic user information (username, password, and email)
and creates an account.
The account can then aquire an access token.

## Error Handling

Most requests return the results of the operation as a HTTP "200 OK" response with
the JSON structure:

```
    {
        "status": "success",
        "data": JSON-Object-Results
    }
```

Where "JSON-Object-Results" is a JSON formatted object with the results of the request.

If there is an error, though, the "200 OK" structure returned is:

```
    {
        "status": "fail",
        "error": "error explanation"
    }
```

Thus, every API invocation must check the returned structure for "status" equaling "success".

A hack has been added to cause all errors to be returned with a HTTP "400 Bad Request" response.
The same "status"/"fail" JSON object is returned -- it is just the HTTP response code that changes.
This hack is enabled when the request has a specific header:

```
    x-vircadia-error-handle: badrequest
```

If this header is in the API request, errors, that would have normally been returned with
an HTTP "200 OK" will be returned with a "400 Bad Request". All other operation is unchanged.

