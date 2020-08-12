# Project Apollo: Notes On Development

This document attempts to describe the environment you need to build
and configure in order to enhance and debug a Project Apollo metaverser server.

Building and running this metaverse server is tricky because there
are several applications and services that must link together:
- metaverse-server: presents API for domain and account management;
- ice-server: provides linkage between Interface's for firewall transversal and streaming;
- domain-server: hosts the "land" and avatars that make up a region of the metaverse;
- Interface: the "user interface" that talks to the above services and presents the user's view of the metaverse;

All four of this services run as separate processes, can run on different computers,
and all have to properly link to each other.

Below is described building the different servers.
Especially check out the [Modifications]("#Modification") section for the changes that must
be made to the sources to get all the URLs correct.
The original sources from High Fidelity contained many, many URLs as in-source
constants which need changing to run a different metaverse-server instance.

## Metaverse-Server

I do my development of the metaverse-server on a Windows10 box running
Visual Studio 2019.
This gets me hands-on with the source for modification and debugging.
If I am running the server as a separate service, I build a [Docker] image
and run it in a [DigitalOcean] droplet.
Refer to [Running Docker Image] for the latter case. What follows is
my development setup.

## Building and Running Ice-Server and Domain-Server

The ice-server and domain-server are part of the [Project Athena] project.
For the ice-server and domain-server, I've been using the
[vircadia-builder] project to build a properly configured
version of these services.

I use [vircadia-builder] to build all the pieces, then I modify
the sources, and then do a rebuild to create images with the modifications.
The process is:

```sh
cd
git clone https://github.com/kasenvr/vircadia-builder.git
cd vircadia-builder
./vircadia-builder --tag=master --build=domain-server,ice-server,assignment-client
cd ~/Vircadia/sources
# Make changes to the sources
cd ~/vircadia-builder
./vircadia-builder --keep-source --tag=master --build=domain-server,ice-server,assignment-client
```

The last build with the `--keep-source` parameter has the builder build without refetching
the sources so the modifications made to the source tree are included in the binaries.

[vircadia-builder] creates run scripts in `~/Vircadia/install-master` and I run each
of the services with small scripts:

run-ice-server.sh:

```sh
#! /bin/bash
cd ~/Vircadia/install_master
export HIFI_METAVERSE_URL=http://192.168.86.41:9400
./run_ice-server --url ${HIFI_METAVERSE_URL}
```

run-domain-server.sh:

```sh
#! /bin/bash
cd ~/Vircadia/install_master

FORCETEMPNAME=--get-temp-name
export HIFI_METAVERSE_URL=http://192.168.86.41:9400
./run_domain-server -i 192.168.86.56:7337 ${FORCETEMPNAME}
```

The IP addresses above are for my development environment: 192.168.86.41 is
the Windows10 box running the metaverse-server and Interface, and
192.168.86.56 is my Linux box running the ice-server and domain-server.
Be sure to change these for your network setup.

Note that the ice-server and the domain-server get an environment variable
that points them at the new metaverse-server. This setting works for most of
the C++ code. The Javascript and QML code, on the other hand, need other
changes.

Once everything is built, the process is:

1. Start metaverse-server
1. Start ice-server
1. Start domain-server
1. Start Interface

## Modifications

As of 20200614 (June 14, 2020), there are several pull requests ("PR"s) that have not
yet been applied to the [Project Athena] sources. These are 
[Move metaverse server URL info into central files for easier updating](https://github.com/kasenvr/project-athena/pull/411)
(which centralizes some of the URL references scattered in [Project Athena])
and
[Bug: ice-server uses the wrong RSA private key decoder](https://github.com/kasenvr/project-athena/pull/400)
(which fixes an ice-server public-key encoding problem).

These two PRs must be applied to the sources. They will be accepted someday so,
when you're reading this, you might not need to make the above changes.
If, after starting the ice-server and domain-server, the domain-server continuiously
outputs messages about recreating its public/private key, the ice-server PR has not been applied.

With the above PRs applied, you modify `libraries/networking/src/NetworkingConstants.h` so
that all references are to your metaverse-server.
That file also points to several High Fidelity locations and they do not need changing yet --
someday they will all point to Vircadia content.

You need to modify `domain-server/resources/web/js/shared.js` so `METAVERSE_URL` points
to your metaverse-server.

## Interface

[Project Athena]: https://github.com/kasenvr/project-athena
[vircadia-builder]: https://github.com/kasenvr/vircadia-builder
[Docker]: https://docker.io/
[DigitalOcean]: https://DigitalOcean.com/
[Running Docker Image]: ./RunningDockerImage.md
