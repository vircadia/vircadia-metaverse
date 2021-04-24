# Running the Iamus Docker Image

## Docker Image

Iamus can be packaged and run as a Docker image.
As of 20210424, the latest Docker image is stored in the
Github Container Registry
with the name "ghcr.io/vircadia/iamus".

The latest Docker image is created with Github Actions
(see `.github/workflows/docker-publish.yml`)
but, to create your own Docker image, the process is:

```sh
git clone https://github.com/vircadia/Iamus.git
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
adduser --disabled-password --gecos "Vircadia Metaverse Server User" cadia
mkdir /home/cadia/.ssh
cp /home/root/.ssh/authorized_keys /home/cadia/.ssh
chown -R cadia:cadia /home/cadia/.ssh
chmod 700 /home/cadia/.ssh
```

## Add MongoDB to the Droplet

Install MongoDb following the instructions at https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/ :

```sh
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod       # start server
sudo systemctl status mongod     # check that it is running
sudo systemctl enable mongod    # enable startup at boot
mongo
db.disableFreeMonitoring()
```

Turn on authentication and create some users for our instance:

```sh
mongo
use admin
db.createUser({user:"adminer", pwd: "LONGPASSWORD1", roles: [ "root" ]})
use admin
db.createUser({user:"backuper", pwd: "LONGPASSWORD2", roles: [ "backup" ]})
use admin
db.createUser({user:"cadiauser", pwd: "LONGPASSWORD3", roles: [{ role: "readWrite", db: "domainstore" }]})
```

Where, if course, "LONGPASSWORD*" is a collection of random letter and numbers.
This creates account "adminer" for DB administration, "backuper" for doing backups
and "cadiauser" to be the database user for the domain-server.
The database is "domainstore".

After doing the above creation steps, edit `/etc/mongod.conf` and add:

```
security:
    authorization: enabled
```

then do `sudo systemctl restart mongod`.

## Create Directories and Create Configuration File

Now that you have the Droplet created, log into the 'cadia' account and
create directories and a configuration file in its home directory.

```sh
cd
mkdir -p config
cat > config/iamus.json << EOFFF
{
    "metaverse": {
        "metaverse-name": "LONG_NAME_OF_THIS_METAVERSE",
        "metaverse-nick-name": "SHORT_NAME_FOR_THIS_METAVERSE",
        "metaverse-server-url": "EXTERNAL_URL",
        "default-ice-server-url": "ADDRESS_OF_ICE_SERVER"
    },
    "database": {
        "db": "DB_NAME",
        "db-host": "LOCAL_HOST_NAME",
        "db-user": "MONGO_USER",
        "db-pw": "MONGO_USER_PASSWORD"
    },
    "debug": {
        
    }
}
EOFFF
```

This configuration file points the metaverse-server's storage to
the created directory.

The `THE_ADDRESS_OF_ICE_SERVER` must be replaced with the IP address
or domain name of the ice-server.

There are MANY, MANY more configuration parameters.
Refer to [https://github.com/vircadia/Iamus/blob/master/src/config.ts]
for the complete list of parameters.
What you put in `config/iamus.json` will overlay the defaults given
in that file.

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
        ghcr.io/vircadia/iamus:latest
```

If you change the port in the configuration file, remember to change the `-p`
parameter above.


[DigitalOcean]: https://DigitalOcean.com/
[instructions]: https://www.digitalocean.com/docs/droplets/how-to/create/
[RunningIceServer]: ./RunningIceServer.md
[test setup]: ./TestSetup.md
