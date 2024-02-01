# Vircaida Metaverse

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

2. Install docker (https://docs.docker.com/engine/install)

3. Go to the project root path.

4. Install Ethereum DLT dependencies (optional)

    ```sh
    cd ethereum/dlt/
    npm install
    cd ..
    ```

5. Open `conf.d/vircadia_conf.conf` file and change the `server_name`

6. Create the `.env` file.
    ```sh
     cp env.default .env
    ```
7. Open the `.env` file and change following:

    ```
    SERVER_HOST,
    METAVERSE_SERVER_URL,
    DEFAULT_ICE_SERVER_URL,
    DASHBOARD_URL,
    APP_LOGO,
    APP_URL,
    SMTP_USER,
    SMTP_PASS,
    SMTP_EMAIL_FROM
    # Handle any other params you want to change

    # Blockchain params (optional)

    MINTER_PRIVATE_KEY,
    ETH_RPC_URL
    ```

### Run with Docker

Run the following commands to deploy with Docker:

```sh
docker compose build
docker compose up -d
```

To stop the containers, run the following command:

```sh
docker compose down
```

To clean up the containers, run the following command:

```sh
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
```

## Testing

Run `npm test` and all your tests in the `test/` directory will be run.

_Note: DLT is not a required component for the metaverse._

Spin up a test chain:

`npm run localchain`

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

````

$ npm install -g @feathersjs/cli # Install Feathers CLI

$ feathers generate service # Generate a new Service
$ feathers generate hook # Generate a new Hook
$ feathers help # Show all commands

```

## Generate Doc

```

npx typedoc expand ./src/services/\*_/_.class.ts

```

```
````
