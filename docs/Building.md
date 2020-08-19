# Building and Configuring Iamus

This document describes building and configuring the Iamus
metaverse-server. There are other documents on setting up
and running the server. For that, refer to
[Notes On Development] and [Running Docker Image].

## Build Instructions

The application is a [NodeJS]/[ExpressJS]/[TypeScript] application so the
build steps are: 

```
npm install
npm run build
```

## Running

When you run the server, you must point any domain-servers (Project-Athena) at this
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
- IAMUS_CONFIG_FILE: filename or URL of a JSON formatted configuration file that over-rides the values. Default "./imus.json".

The configuration file, if it exists, is read and its values overlay
the other configuration values. This is the preferred method of configuring the
server: use the IAMUS_CONFIG_FILE environment variable to point at a configuration
file that sets the values for the metaverse-server instance.

## Troubleshooting

[Running Docker Image]: ./RunningDockerImage.md
[Notes On Development]: ./NotesOnDevelopment.md
[NodeJS]: https://nodejs.org/
[ExpressJS]: https://expressjs.com/
[TypeScript]: https://www.typescriptlang.org/