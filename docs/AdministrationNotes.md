# Administration Notes

This contains a discussion of some things you might need when
administrating an Iamus metaverse-server.

- [Account Email Verification](#account-email-verification)
- [Initial Admin Account](#initial-admin-account)

## Account Email Verification

A grid can require email verification on account creation.
The steps are:

- account creation is requested via API (specifies username, password, and email address)
- account is created but is not enabled
- a RequestEntity is created to remember verification request
- email is sent to account's email address with a verification URL
- user resolves URL in email
- if RequestEntity exists for that account/verification code, account is enabled
- user's browser is redirected to a "Welcome" page

There are many configuration parameters associated with this feature.
The configuration file in the sources is:

```
    'metaverse-server': {
        ...
        'enable-account-email-verification': false,
        'email-verification-timeout-minutes': 1440, // minutes to wait for email verification (1440=one day)
        // default is in 'static' dir. If you put in 'config' dir, use 'config/verificationEmail.html'.
        //   "VERIFICATION_URL" is replaced with the computed URL (build with Config.metaverse-server-url)
        //   "METAVERSE_NAME" is replaced (from Config.metaverse.metaverse-name)
        //   "SHORT_METAVERSE_NAME" is replaced (from Config.metaverse.metaverse-nick-name)
        'email-verification-email-body': 'dist/static/verificationEmail.html',  // file to send
        'email-verification-from': '', // who the email is From
        // When user follows the verification URL, they are redirected to one of these two URLs
        //   "METAVERSE_SERVER_URL" is replaced (from Config.metaverse.metaverse-server-url)
        //   "DASHBOARD_URL" is replaced (from Config.metaverse.dashboard-url)
        //   "ACCOUNT_ID" is replaced with the verifying account id
        //   "FAILURE_REASON" is replaced with the reason for verification failure (url encoded)
        'email-verification-success-redirect': 'METAVERSE_SERVER_URL/static/verificationEmailSuccess.html',
        'email-verification-failure-redirect': 'METAVERSE_SERVER_URL/static/verificationEmailFailure.html?r=FAILURE_REASON'
        ...
    },
    ...
```

Setting `enable-account-email-verification` to `true` enables this feature.
The default is `false` which means the account is enabled when it is created.

`email-verifiction-timeout-minutes` is the number of minutes that the system waits for the
account verification to happen. The default is one day (1440 minutes).
After this time, the verification URL will no longer enable the account and the
account will remain in a disabled state.

The body of the sent email is read from the file `email-verification-email-body`. 
A simple email body is provided in the `/static/` directory but that can be changed
or a different file can be specified in order to customize and brand the sent email.
Several text strings are replaced in the read in file to allow customization.

If running Iamus Docker image, this file can be put in the `config/` directory.
I.e., `"email-verifiction-email-body": "config/MyGridVerificationEmail.html"`.

When the user resolves the verification URL, the user's browser is redirected to one of two
URLs. These URLs are specified by `email-verification-success-redirect` and
`email-verification-failure-redirect`.
Simple HTML pages are provided by default in the `/static/` directory but,
in order to customize and brand what the user sees, these URLs can be changed to
anything appropriate.

### Outbound Email Configuration

Sending the email requires access to an SMTP out-going mail server. This is
configured in the `nodemailer-transport-config` configuration section.
Iamus uses the [NodeMailer](https://nodemailer.com) package to do the
mailing and this configuration section is passed to NodeMailer for SMTP setup.
If fancy configuration is required, refer to the SMTP documentation at [https://nodemailer.com/smtp].
The default configuration file contains:

```
    ...
    'nodemailer-transport-config': {
        'host': 'SMTP-HOSTNAME',
        'port': 465,    // 587 if secure=false
        'secure': true,
        'auth': {
            'user': 'SMTP-USER',
            'pass': 'SMTP-PASSWORD'
        }
    },
    ...
```

where the strings `SMTP-HOSTNAME`, `SMTP-USER`, and `SMTP-PASSWORD` are the
values needed for your SMTP out-bound service.

## Initial Admin Account

Many of the metaverse-server maintainence operations require 
the requesting account to have the "admin" role.
An account with the "admin" role can add the "admin" role to another
account but there is the problem of getting the first admin account.

There is a kludge to add the "admin" role to a created account.
One sets the account name in the metaverse-server's configuration file
and, when the account is created, it has the "admin" role automatically
added.
This can be done at any time so make sure that the account of the name
exists and is controlled by the metaverse-server operator.

Before creating the admin account, 
edit the metaverse-server's configuration file to set
`metaverse-server.base-admin-account` to the name of the admin account.
The following example makes it so that creating an account with the
username "adminer" will cause that account to have the "admin" role added.

```
    {
        ...
        'metaverse-server': {
            ...
            'base-admin-account': 'adminer',
            ...
        },
        ...
    }
```

The default configuration file has an empty name for this field to
prevent random account creation.
To use this feature, remember to set the account name and then create
the account so that the account is controlled by the metaverser-server operator.
