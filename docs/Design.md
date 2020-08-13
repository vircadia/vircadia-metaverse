# Notes on Iamus Architecture and Design

## Routing

[ExpressJS] routing is built at run time. The routine `createAPIRouter()`
in `index.ts` imports all the `.js` files in the given directory
and, if they present a `Router` export, that route is added to
a new router. This builds a router that routes to all the routers
defined in the directory tree.

Each of the processors for MetaverseAPI requests is processed as a
stream with processors for setting up the actual action of the request.
The parameters for the final action are variables added to the passed
request. See `RequestAdditions.ts` for the definition of the additional
variables added to the Request object.

As an example:

```javascript
router.delete('/api/v1/account/:accountId/tokens/:tokenId',
                    [ setupMetaverseAPI,      // req.vRestReq
                      accountFromAuthToken,   // req.vAuthAccount
                      accountFromParams,      // req.vAccount
                      tokenFromParams,        // req.vToken
                      procDeleteToken,
                      finishMetaverseAPI
                    ] );
```

For this request, `setupMetaverseAPI` sets up the passed `Request` with initial
values (mostly setup for the status/data eventual response).
Then `accountFromAuthToken` looks up the account specified in the `Authorization:`
header and sets the value on `req.vAuthAccount`.
Then `accountFromParams` looks up the account specified in the `:accountId`
URL parameter and sets `req.vAccount`. `tokenFromParams` does the token lookup
for the `:tokenId` parameter.
Then `procDeleteToken` is called which actually does  the delete operation based
on all the collected parameters.
Finally, `finishMetaverseAPI` builds the status/data response for the request.

## Other Implimentation Nodes

So that the import statements don't have relative file references, this uses path
aliases. These start with at-signs and are defined in `tsconfig.json`
and `package.json`. The [module-alias] package is used to set the paths
in the compiled JavaScript code. This package is invoked at the top of
`index.ts`;
