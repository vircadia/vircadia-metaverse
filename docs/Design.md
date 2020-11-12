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

## Entity Field Updates

Updating entity fields is handled by a process of value validation, field
getting and setting routines, and a database update step.

The procedural process for getting or setting the value of an entity's field
is to call the field get/set value and, if setting, getting a list of the updated
fields to update the database entries. Note that just changing the value in
the in-memory entity does not change the value stored in the database.

So, to set a DomainEntity field, for instance, the code is:

```
    data = await getDomainField(req.vAuthToken, req.vDomain, 'version');
```

This takes the authorization of the requestor, the domain entity, and the name
of the field. The returned value can be 'undefined' if the field value couldn't
be fetched. There isn't a good indication of why it wasn't fetched (a place for
future work) but it's most often due to the requestor not having the authorization.

To set the value of a field, one needs to update the field and then update
the database. This two step process is done with:

```
  let updates: VKeyedCollection = {};
  await setAccountField(req.vAuthToken, updatedAccountEntity, 'images_hero',
                          imagesURLString, requestingAccountEntity, updates);
  await Accounts.updateEntityFields(updatedAccountEntity, updates);
```

This sample takes the authorization of the requestor, the account being changed, the external
name of the field being set, and the value being set.
The extra parameters passing the AccountEntity that goes with the authorization token (this is
optional but saves a database lookup if supplied) and a VKeyedCollection that has  the
database information that needs to be updated for this set operation.
Ths update information is then passed 

This system of field getting and setting is implmented with field definitions
that are attached to the entity definition.
Each field in an Entity has a `FieldDefn` definition that gives its internal
and external name and the routines to use to validate and update the field.
For instance, AccountEntity.imagesHero has the `FieldDefn` of:

```
  'images_hero': {
    entity_field: 'imagesHero',
    request_field_name: 'images_hero',
    get_permissions: [ 'all' ],
    set_permissions: [ 'owner', 'admin' ],
    validate: isStringValidator,
    setter: simpleSetter,
    getter: simpleGetter
  },
```

This specifies that the field's external name (the name that appears in API GET and POST operations)
is "images_hero" and its internal name (the field on the AccountEntity) is "imagesHero".
`get_permissions` is the `Permissions.Perm` code showing that all requestors can get the
field value and `set_permissions` says that only the account owner or an administration account
can set the value.

In order to make sure all values set into the fields are valid, the `validate` function tests
whether a value being set follows any content restriction rules. In this case, it uses a
pre-existing function that just verifies if the value is a string.

The functions `getter` and `setter` are the operations that get and set the field value.
Of course, the setter presumes the set value has passed the validation. These function definitions
accept and return type "any" so the callers need to know what they want/expect.

## Other Implimentation Nodes

BEWARE! All "entity" classes are really just Objects that are read out
of the database. Even though they are defined as classes, when read from the
database, the underlying structure is not converted from the returned
database object into a class instance. Therefore, operations like "instanceOf"
will not work. This is why the entity class definitions don't have constructors
and other instance properties. At best, they have associated const variables.

So that the import statements don't have relative file references, this uses path
aliases. These start with at-signs and are defined in `tsconfig.json`
and `package.json`. The [module-alias] package is used to set the paths
in the compiled JavaScript code. This package is invoked at the top of
`index.ts`;
