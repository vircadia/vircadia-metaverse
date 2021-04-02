# Resource Use Limiting in Iamus

**As of April 2, 2021 this is a PROPOSAL for Iamus functionality. Add comments/improvements to issue #81 **

With any shared resource, there must be some controls to limit and/or manage
the overuse of the resources.
For a virtual world, whether it is a griefer
using resources for their LOLs or a user inadvertently running too many
scripts and degrading everyone's experience, there must be some
mechanism to allocate resources among all users.

Iamus uses three techniques to allocate resources among users:

1) account email verification (limit account overuse)
2) raw request rate limiting (limit API overuse)
3) per-account "resource tokens" for creation of metaverse resources (limit number of resources accounts can create)
4) elimination of legacy resource using requests (eliminate old and mis-usable APIs)

## Account Email Verification

To control the rate of account creation, account creation can require the
specification of an email address and the activation of a link that is sent
to that email address. While not a perfect or fool-proof method of verification,
more the majority of cases, this makes sure accounts are created by people
and that the metaverse has a way of contacting that person.

Account email verification is enabled by setting the configuration parameter
`metaverse-server.enable-account-email-verification` to `true`.
The default value is `false`.

To use this feature,
Iamus requires the metaverse-server admin to set up an outgoing email service
to send the email. The configuration parameters are:

Iamus sends an email using the HTML text specified in TBD

When an account is created, 
Iamus creates a AccountVerification Request entry and sends an email.
The Request entry will timeout in 10 minutes (default).
The email contains an URL to the metaverse-server.
That URL, when resolved, is matched to the AccountVerification request
and, if matched, causes the account to be activated.

Account activation is done in two ways: 1) the AccountEntity has an `active`
boolean flag that enables logging in, and 2) the AccountEntity has
a starting collection of "resource tokens" added to the `resourceTokens`
account variable. See discussion of "resource tokens" below.

### EMail Configuration

Iamus uses the [Nodemailer](https://nodemailer.com/about/) package to send
the email.

TBD

## Raw Request Rate Limiting

Request rate limiting is done using `express-rate-limit`.
The package is an [NPM package](https://www.npmjs.com/package/express-rate-limit)
and has a [GIT repository](https://github.com/nfriedly/express-rate-limit).
Iamus also uses the [Typescript definition files](https://www.npmjs.com/package/@types/express-rate-limit).

Descriptive article: [Rate Limiting in Express](https://medium.com/pixel-and-ink/rate-limiting-in-express-7a43ac14ed0c)

Iamus does simple, in-memory tracking and limiting of all requests.
This works for a single instance of Iamus, but if the server is ever sharded (horizontal scaling),
the MondgoDB statistic tracking module will need to be added to `express-rate-limit`.

The rate limiting is done across all requests and configuration variables are
present to set the activity window and maximum requests per window period.
The "users" are tracked by their login token or their IP if not logged in.

## Per-Account "resource tokens" for Use/Creation of Metaverse Resources

To limit the number of metaverse resources an individual account can create,
each account is allocated a number of "resource tokens". Creation of large
resources (Domains, Places, Groups) and potentially others uses up the
account's "resource tokens".

Account gain "resource tokens" over time.

The initial allocation and costs of "resource tokens" are:

* Initial tokens allocated when account created and email verified: 20
* "Resource tokens" earned per day: 2
* Maximum "resource tokens" that can be held by an individual account: 20
* "Resource tokens" used creating/associating a Domain: 10
* "Resource tokens" used creating a Place: 5

An administrative account can add resource tokens to an account for
special cases.

## Elimination of Legacy Resource Using Requests

There were some metaverse API requests that were not very controlled.

Previously, there was a requests where domain-servers created a temporary domain
name as they were being configured. This request has been replaced in Vircadia
with the process of assigning a real domain name while the domain is being
associated with its owner's account and registered with the metaverse-server.

The "temporary domain name" API request (`POST /domains/temporary`) is disabled
by default but can be enabled by changing the metaverse-server's configuration
file and setting `metaverse-server.allow-temp-domain-creation` to `true`.


# Notes On Other Resources and Solutions

If you are working on this, here are pointers to other rate limiting packages.

## Express-limiter

* https://github.com/ded/express-limiter
* https://www.npmjs.com/package/express-limiter
* Last published in 2017
* 11,733 downloads per week

## Express-brute

* https://github.com/AdamPflug/express-brute
* https://www.npmjs.com/package/express-brute
* Last published 2017
*     Github was updated 12 months ago with a merge request
* 30.780 downloads per week
* A brute-force protection middleware for express routes that rate-limits incoming requests, increasing the delay with each request in a fibonacci-like sequence.

## Node-rate-limiter-flexible

* https://github.com/animir/node-rate-limiter-flexible
* https://www.npmjs.com/package/rate-limiter-flexible
* last published Jan 2021
* 94,000 weekly downloads
* rate-limiter-flexible counts and limits number of actions by key and protects from DDoS and brute force attacks at any scale.
* It works with Redis, process Memory, Cluster or PM2, Memcached, MongoDB, MySQL, PostgreSQL and allows to control requests rate in single process or distributed environment.

