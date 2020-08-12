# Project Apollo Test Setup

**TL:DR version**: a test metaverse using the latest Project Apollo
sources (metaverse-server and ice-server) has been created.
Do testing by running domain-servers
and Interfaces created in [Project Athena] pull request #458 ([PR #472]).

Long version:

An instance of the Project Apollo metaverse-server Docker image
is running in a [DigitalOcean] droplet.
This, along with an ice-server instance,
provides a test setup that is updated frequently with the
latest metaverse-server improvements.

The "BlueStuff" test metaverse allows us developers to
run domain-servers and Interface's against the latest development
version to find all the things that need fixing.

**NOTICE: all the domains, user accounts, friends, and profiles that
are created on this test server are ephemeral.**
While some effort
will be made to keep the database stable, accounts, domain setups,
and everything could be lost at any time.

To use this metaverse-server, you must have a version of
the domain-server and Interface that are configured to talk to
this metaverse server.
Command line parameters exist to change most of metaverse-server
links, there are some (especially in the scripts) that must
be changed in the source.

There is a pull request ([PR #472]) on [Project Athena]'s Github
repository that applies the source patches and thus builds
images of the domain-server and Interface that should work
with this test metaverse server.

Download the executables from [PR #472], install them on
your computer. You can create accounts on the BlueStuff
using either the login screen in Interface or on the domain
token fetch dialog.

The latter case happens when you set up the domain-server.
After starting a new domain-server, one runs a browser on the
server's setup screen. One operation is to connect your account.
For Vircadia, the connect dialog lets one login to an account
or to create an account.


The metaverse-server is addressed at `http://metaverse.bluestuff.org:9400`.

The ice-server is addressed at `http://ice.bluestuff.org:7337`.

As of 20200616, https has not yet been set up for these servers so
the links must be `http:`.


[Project Athena]: https://github.com/kasenvr/project-athena
[vircadia-builder]: https://github.com/kasenvr/vircadia-builder
[Docker]: https://docker.io/
[DigitalOcean]: https://DigitalOcean.com/
[Running Docker Image]: ./RunningDockerImage.md
[PR #472]: https://github.com/kasenvr/project-athena/pull/472
