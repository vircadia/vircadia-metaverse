goobie-verse / [Modules](modules.md)

# vircadia-metaverse-v2

## Docker MAC
- docker compose build  
- docker compose up  
        OR
- docker compose up --scale api=10

## Docker Ubuntu
- docker-compose build
- docker-compose up -d //()
        OR
- docker-compose up  --scale api=10

## Load Init master data
- Using this API, load master data into the database (Quest item, Inventory Items, Npc etc...)
```
https://{apiUrl}/init-master-data

```
-Remove catch images
```
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
```

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/vircadia-metaverse-v2
    npm install
    ```

3. Start your app

    ```
    npm start
    ```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Generate Doc
```
npx typedoc expand ./src/services/**/*.class.ts  
```
