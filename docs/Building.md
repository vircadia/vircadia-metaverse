# Building and Configuring Iamus

This document describes building and configuring the Iamus
metaverse-server. There are other documents on setting up
and running the server.
For development or other running configurations, refer to
[Notes On Development] and [Running Docker Image].

For more advanced notes on running an Iamus metaverse-server,
check out [Administration Notes].

## Build Instructions

The application is a [NodeJS]/[ExpressJS]/[TypeScript] application so the
build steps are: 

```
npm install
npm run build
```

## Running

For testing and simple opertion, you can run Iamus in the build directory.
Say you want to build and run Iamus in the directory IBASE. The steps are:

```sh
cd $IBASE
git clone https://github.com/vircadia/Iamus.git
cd Iamus
npm install     # install all the required NodeJS packages
npm run build   # build Iamus into $IBASE/Iamus/dist/
# setup MongoDB (see notes below)
# create configuration file 'iamus.json' in directory $IBASE/Iamus (see below)
node dist/index.js  # run Iamus
```

Note that the `iamus.json` configuration file is not put in the 'dist/' directory
because that directory is cleaned out before each build.

Iamus can also be built and run in a Docker container.
Refer to [Running Docker Image] for instructions.

For connecting domain-servers to the Iamus metaverse-server,
you must point any domain-servers (Vircadia) at this
metaverse server. This is accomplished by setting the `HIFI_METAVERSE_URL`:

```sh
export HIFI_METAVERSE_URL=http://HOSTADDRESS:9400
./run_domain-server
```

If you are modifying domain-server sources, the default server address is in
`NetworkingConstants.h`:

```c++

    const QUrl METAVERSE_SERVER_URL_STABLE { "http://127.0.0.1:9400" };
    const QUrl METAVERSE_SERVER_URL_STAGING { "http://127.0.0.1:9400" };

```

## Versioning and Development

The server has a package version specified in `package.json`. The build
process creates the file `VERSION.json` which contains tags for the
current package and build version. The format of the file is:

```
{
  "npm-package-version": "2.1.1",
  "git-commit": "02fac7f918f5137a6538965e55a219e85619b845",
  "version-tag": "2.1.1-20200812-02fac7f"
}
```

`version-tag` combines the NPM package version, the date of build, and
the GIT commit version and is used to tag the Docker image.

The version information is also read and added to the configuration
data structure (for use by the application) and added to the
`metaverse_info` API requests for reading by external applications.

## Configuration

The server parameters are all specified in `config.ts`. These default
values are overlayed with environment variables and then overlayed with
the contents of a configuration file.

The environment variables are:

- IAMUS_LOGLEVEL: logging level. One of 'error', 'info', 'warn', 'debug'. Default 'info'.
- IAMUS_LISTEN_HOST: host to listen for requests on. Default '0.0.0.0'.
- IAMUS_LISTEN_PORT: port to listen for requests on. Default 9400.
- IAMUS_EXTERNAL_HOSTNAME: hostname to report as referencing back to this server. This is mostly used by ActivityPub for links to users. Default 'localhost'. This value MUST be set for proper metavserse-server operation.
- IAMUS_CONFIG_FILE: filename or URL of a JSON formatted configuration file that over-rides the values. Default "./iamus.json".

The configuration file, if it exists, is read and its values overlay
the other configuration values. This is the preferred method of configuring the
server: use the IAMUS_CONFIG_FILE environment variable to point at a configuration
file that sets the values for the metaverse-server instance.

An example configuration file to start with is:

```
{
    "metaverse": {
        "metaverse-name": "My Metaverse",
        "metaverse-nick-name": "MyVerse",
        "metaverse-server-url": "https://metaverse.example.org:9400/",
        "default-ice-server-url": "ice.example.org:7337"
    },
    "server": {
        "cert-file": "config/cert.pem",
        "key-file": "config/privkey.pem",
        "chain-file": "config/chain.pem"
    },
    "metaverse-server": {
        "metaverse-info-addition-file": "config/metaverse_info.json"
    },
    "database": {
        "db": "myverse",
        "db-host": "metaverse.example.org",
        "db-user": "DBUSER",
        "db-pw": "DBUSERPASSWORD"
    },
    "debug": {
        "loglevel": "debug",
        "devel": true,
    }
}
```

This sets up a metaverse named "My Metaverse" that's available at the location `metaverse.example.org`.
The `.pem` files are the certificates that enable `https:` for that domain.
If the `.pem` files are not specified, the metaverse-server will only respond to `http:` requests.
The `database` section specifies the connection to the MongoDB database.
If you have a complex connection string, replace these parameters with one `db-connection`
parameter which is just the connection string.

All the configuration parameter default values are defined in `src/config.ts`.

## Setup MongoDB

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

## Logging

My default, Iamus logs to a file named `iamus.log` in the directory `./logs`.
Previous versions of the log file are rotated here and 
this directory can eventually hold up to 10, 100MB files.
These parameters can be changed with the config file.

| Config value | default | description |
| ------------ | ------- | ----------- |
| debug.log-to-files | true | whether to log to filesystem |
| debug.log-filename | "iamus.log" | base name of the log files |
| debug.log-directory | "./logs" | directory to store logs into |
| debug.log-max-size-megabytes | 100 | the maximum size of the individual log files |
| debug.log-max-files | 10 | number of old log files to keep |
| debug.log-compress | false | if to compress old versions of the log files |
| debug.log-to-console | false | whether to additionlly log to the console |

When running with Docker, one often changes the logging directory to point
into a mounted volume for easy reference.

## Troubleshooting

[Running Docker Image]: ./RunningDockerImage.md
[Administration Notes]: ./AdministrationNotes.md
[Notes On Development]: ./NotesOnDevelopment.md
[NodeJS]: https://nodejs.org/
[ExpressJS]: https://expressjs.com/
[TypeScript]: https://www.typescriptlang.org/
