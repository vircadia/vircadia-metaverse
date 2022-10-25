# vircadia-metaverse-v2


## Getting Started

Getting up and running is easy.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

2. Install docker (https://docs.docker.com/engine/install)

3. Go to the project root path
    ```
        cd path/to/vircadia-metaverse-v2
    ```

4. Install etherium dlt dependencies

    ```
    cd ethereum/dlt/
    npm install
    cd ..
    ```
5. open `conf.d/vircadia_conf.conf` file and change `server_name`

6. Copy env file
    ```
     cp env.default .env 
    ```
7. Open .env file 
   - Change following env params  SERVER_HOST,
    METAVERSE_SERVER_URL,
    DEFAULT_ICE_SERVER_URL,
    DASHBOARD_URL,
    APP_LOGO,
    APP_URL,
    SMTP_USER,
    SMTP_PASS,
    SMTP_EMAIL_FROM  etc...

    - Blockchain params 
        MINTER_PRIVATE_KEY,
        ETH_RPC_URL
    


8. Run Following docker commands for deploy into docker (Same commands for redeploy)
     ```
     docker compose build
     docker compose up -d
     ```

9. Run Following command for stop docker  (Optional)
     
     ```
     docker compose down
     ```

10. Remove docker cached images (Optional)

    ```
    docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
    ```


## Testing

Run `npm test` and all your tests in the `test/` directory will be run.

*Note: DLT is not a required component for the metaverse.*

Spin up a test chain:

`npm run localchain`

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Generate Doc

```
npx typedoc expand ./src/services/**/*.class.ts
```

