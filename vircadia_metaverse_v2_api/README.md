# vircadia-metaverse-v2


## Getting Started

Getting up and running is as easy

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

2. Install docker (https://docs.docker.com/engine/install)

4. Go to the project root path
    ```
        cd path/to/vircadia-metaverse-v2
    ```

5. Install your dependencies

    ```
    npm install
    cd path/to/vircadia-metaverse-v2/ethereum/dlt/
    npm installcd ..
    npm run chain
    ```
6. open vircadia_metaverse_v2_api/conf.d/vircadia_conf.conf file and change server_name

7. Copy env file
    ```
     cp env.default .env 
    ```
8. Open .env file 
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
    


9. Run Following docker commands for deploy into docker (Same commands for redeploy)
     ```
     docker-compose build
     docker-compose up -d
     ```

10. Run Following command for stop docker  (Optional)
     
     ```
     docker-compose down
     ```

11. Remove docker cached images (Optional)

    ```
    docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
    ```


## Testing

Spin up a test blockchain:

`npm run localchain`

Then run `npm test` and all your tests in the `test/` directory will be run.

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

