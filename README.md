# Iamus
Metaverse server for Vircadia Project that integrates the virtual world with ActivityPub.

## Running

The configuration of the metaverse-server is controlled by parameters that
are defined and defaulted in `config.ts`. These default values are
over-ridden by some environment variables and then by the contents of
a configuration file.

The usual setup is to do all the configuration setup in the configuration
file, setting the environment variable to point at that configuration file,
and then running the metaverse-server.

Environment variables, if they exist, override default values:

- IAMUS_LOGLEVEL: logging level. One of 'error', 'info', 'warn', 'debug'. Default 'info'.
- IAMUS_LISTEN_HOST: host to listen for requests on. Default '0.0.0.0'.
- IAMUS_LISTEN_PORT: port to listen for requests on. Default 9400.
- IAMUS_EXTERNAL_HOSTNAME: hostname to report as referencing back to this server. This is mostly used by ActivityPub for links to users. Default 'localhost'. This value MUST be set for proper metavserse-server operation.
- IAMUS_CONFIG_FILE: filename or URL of a JSON formatted configuration file that over-rides the values. Default "./imus.json".

## Building

## Architecture/Organization

### Routing

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

### Other Implimentation Nodes

So that the import statements don't have relative file references, this uses path
aliases. These start with at-signs and are defined in `tsconfig.json`
and `package.json`. The [module-alias] package is used to set the paths
in the compiled JavaScript code. This package is invoked at the top of
`index.ts`;

[module-alias]: https://www.npmjs.com/package/module-alias
[ExpressJS]: https://expressjs.com/
