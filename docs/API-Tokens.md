# MetaverseAPI - Token Creation

Requests that create and manage access tokens.

User access is mostly controlled by the "Authorization:" header
containing a bearer token. Once an account is created
(see [GET /api/v1/users](./API-Accounts.md#get-apiv1users) ),
a requestor can get an initial
account token with
[POST /oauth/token](./API-Tokens.md@post-oauthtoken)
request.

Tokens expire and can be refreshed using the refresh token returned
with the token and a "refresh_token" request to `/oauth/token`.

## POST /oauth/token

This request mimics and official OAuth request interface. The POST request
sends authentication information and returns an account access token.

The post body is an "applicaton/json" structure that depends on the grant type:

```
    {
        "grant_type": "password",
        "username": username,
        "password": password
    }
```

The following is for a "login" using an external service. Was used for
Steam login. As of 2200621, this is not implemented but kept here for
future addition.

```
    {
        "grant_type": "authorization_code",
        "client_id": stringIDofClient,
        "client_secret": stringSecret,
        "code": stringAuthorizationTokenFromService,
        "redirect_url": loginRedirectionURL
    }
```

Grant type "refresh_token" is used to create a new token that extends the
life of an account's access token. If successful, this returns the refreshed
account access token with an extended expiration time.

```
    {
        "grant_type": "refresh_token",
        "refresh_token": refreshTokenForAccountsAccessToken,
        "scope": "owner"
    }
```

A successful response (HTTP response code "200 OK"), returns an "application/json"
body formatted:

```
    {
        "access_token": tokenString,
        "token_type": "Bearer",
        "expires_in": integerSecondsUntilTokenExpiration,
        "refresh_token": tokenToUseToRefreshThisToken,
        "scope": scopeOfTokenUse,
        "created_at": integerUnixTimeSeconds
    }
```

The failure of the request will return an "application/json" body:

```
    {
        "error": stringDescribingError
    }
```

## GET /user/tokens/new

Legacy API call that allocates and returns HTML describing the new token.
This operation is built to adapt to the domain registration pages when
setting up a domain.

This request operates differently if the account is logged in.

If the user making the request has  a valid account token
(Header "Authorization:" contains a valid token) then the
request returns MIME type of "text/html" and the body
text:

<pre>
<center><h2>Your domain's access token is: ACCESS_TOKEN</h2></center>
</pre>

If the user does not pass a valid account token, the request returns
response code "302 Found" and with a "Location:" header giving a redirection
to a page for token generation. The default redirection location is
"/static/DomainTokenLogin.html" which is a token generation page
supplied with the Project Apollo metaverse server.

## POST /api/v1/token/new

New API call added 20200620 that allocates and returns a new token.

The user making the request must have a valid account token
(Header "Authorization:" contains a valid token).

Query parameters:

* scope: optional. If specified, has the value of either "domain" or "owner".
  "domain" is for domain access tokens and "owner" is for account access tokens.

This request is throttled.

The POST request returns an "application/json" body:

```
    {
        "status": "success",
        "data": {
            "token": tokenString,
            "token_id": tokenIdentifierString,
            "refresh_token": tokenToUseToRefreshThisToken,
            "token_expiration_seconds": integerOfSecondsUntilExpiration,
            "account_name": accountNameString
        }
    }
```

If, for some reason, the token cannot be created, this returns the JSON string:

```
    {
        "status": "fail"
    }
```

[API-Accounts]: ./API-Accounts.md
