# Running the Project Apollo Docker Image

## Docker Image

A Docker image is made of the latest release.
As of 20200813, the Docker image is stored at
hub.docker.com with the name "misterblue/vircadia-metaverse-server".
Someday CI will be integrated with this project and then the image may move.

As of 20200813, there is an instance of the Docker image running
at `metaverse.bluestuff.org`. For a description of that instance,
refer to the [test setup] document.

To create your own Docker image, the process is:

```sh
git clone https://github.com/kasenvr/Iamus.git
cd Iamus/docker
docker build -t iamus .
```

I have been running the Docker image in a [DigitalOcean] droplet.
The process I use has the following steps:

1. Create the droplet
1. Log into the droplet as root
1. Create a new user in the droplet to run the metaverse-server
1. Log into the new user account in the droplet
1. Create directories to hold the persistant data and logs
1. Create configuration file for the metaverse-server
1. Start the Docker image

Each of these steps are described below.

One also needs to set up some domain names for use by the droplet so
you are not dealing with ever changing IP addresses.
This is discussed below.

I've also been running the ice-server in a droplet.
This process is described in [RunningIceServer].

## Create and Log Into Droplet

Follow the [instructions] at [DigitalOcean] to create and access a droplet.

## Create New User In Droplet

I create a new user in the droplet to run the metaverse-server so
the server is not running as root.
I copy the SSH key from the root
account to this new account so the SSH login is the same.

```sh
adduser --disabled-password --gecos "Vircadia Metaverse Server User" mvsrv
mkdir /home/mvsrv/.ssh
cp /home/root/.ssh/authorized_keys /home/mvsrv/.ssh
chown -R mvsrv:mvsrv /home/mvsrv/.ssh
chmod 700 /home/mvsrv/.ssh
```

## Add MongoDB to the Droplet

TODO: write something here
    create database
    add user for server

## Create Directories and Create Configuration File

```sh
mkdir -p config
cat > config/iamus.json << EOFFF
{
    "metaverse": {
        "metaverse-server-url": "EXTERNAL_URL",
        "default-ice-server-url": "ADDRESS_OF_ICE_SERVER"
    },
    "database": {
        "db": "DB_NAME",
        "db-host": "LOCAL_HOST_NAME",
        "db-user": "MONGO_USER",
        "db-pw": "MONGO_USER_PASSWORD"
    }
}
EOFFF
```

This configuration file points the metaverse-server's storage to
the created directory and sets up logging to be verbose.
The `ConsoleLog` setting to `false` says to not log to the console
and let all logging go to the `content/Logs` directory.

The `THE_ADDRESS_OF_ICE_SERVER` must be replaced with the IP address
or domain name of the ice-server.

## Run the Metaverse-Server Docker Image

I use a script to run the docker image:

```sh
#! /bin/bash
docker run -d \
        --name=metaverseserver \
        --restart=unless-stopped \
        -p 9400:9400 \
        -e IAMUS_CONFIG_FILE=/home/cadia/config/iamus.json \
        --volume ${BASE}/config:/home/cadia/config \
        misterblue/vircadia-metaverse-server
```

If you change the port in the configuration file, remember to change the `-p`
parameter above.


[DigitalOcean]: https://DigitalOcean.com/
[instructions]: https://www.digitalocean.com/docs/droplets/how-to/create/
[RunningIceServer]: ./RunningIceServer.md
[test setup]: ./TestSetup.md
