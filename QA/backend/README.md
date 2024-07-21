# Stim7 Backend
Secure Web Backend

## Dependencies

1. MongoDB
2. Nodejs
3. Redis Stack (Docker)

- Notes for using `npm`: use `npx` to execute any javascript files/modules/commands. Replace `pnpm` with `npx`. If `yarn`, can continue to use `yarn`. If `pnpm`, can continute to use `pnpm`.

## Setup Backend Services

### Install node packages

Default is npm unless you have installed pnpm, then use pnpm. Both are interchangable. `npm install` or `pnpm install`

## MongoDB start services

### MacOS

```sh
xcode-select --install
brew tap mongodb/brew
brew update
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

## Get Environment Keys

Make sure `.env.keys` is in the root project dir `backend/`

Decrypt keys using `pnpm decrypt`

Use local or production files as `.env` accordingly

Any env file changes that needs to be updated use `pnpm encrypt`

## MongoDB Migrations Set Up

Make sure to create a database named `ssd` (or any database name you want) inside MongoDB first, then modify details into .env file

### Run Migrations

Only run **ONCE**, database table will be dropped at each execution

Run from root directory of repository `pnpm migrate`

## Start Redis with Docker 

`docker run -p 127.0.0.1:6379:6379 --name redis-stack redis/redis-stack:latest`

## Start Backend Services

Run the application locally `pnpm start`

Hot reload is using pm2 instead of nodemon. Therefore it creates an instance. Kill it using `pnpm kill`

For monitoring of processes use `pnpm pm2 monit`. More info at [PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)

## Using Docker for backend (alternative)

**Requirements:**

1. Make sure terminal has buildkit: `export DOCKER_BUILDKIT=1 && export COMPOSE_DOCKER_CLI_BUILD=1`
2. Make sure `.compose.env` and `.env.keys` is in `docker/`
3. Make sure `.env.keys` is in `backend/`
4. All docker compose networks are in **backend**, attaching external containers require: `--network backend`
5. Docker-compose makes use of ssh agent forwarding, ensure local pc has ssh keys in github repo. Dockerfile in `backend/` uses locally hosted repo.
6. Create docker network first: `docker network create --driver bridge --attachable --opt com.docker.network.bridge.name=backend backend`

### Full setup (standalone, mostly local development)

**MAKE SURE .env.keys and .compose.env are also in this folder**

This runs mongo + redis + backend (expose single port).

Run standard docker-compose: `docker-compose -f docker-compose-standalone.yml --env-file .compose.env up -d`

### Full setup (microservices, staging/production development)

**MAKE SURE .env.keys and .compose.env are also in this folder**

This runs mongo + redis + backend (expose individual service ports).

Run standard docker-compose: `docker-compose -f docker-compose-services.yml --env-file .compose.env up -d`

### Dependencies only (mongodb + redis)

**MAKE SURE .env.keys and .compose.env are also in this folder**

This runs only mongo + redis, external connection of backend need to manually join the compose network if using docker otherwise, localhost.

Run dependencies only: `docker-compose -f docker-compose-depend.yml --env-file .compose.env up -d`

### Dockerfile in `backend/` (local development only)

Standalone dockerfile with integration to [dependencies setup](#dependencies-only-mongodb--redis). The code uses code from local machine.

```
docker build --tag sap . 
docker run --name app -p 0.0.0.0:3010:3010 --network backend -d sap
```

To enable hot reload in docker file while editing on your local machine, use docker-compose in `backend/`. Files can be edited on the fly and will be read by the container. **Do not need to build docker from the above steps**

```
docker-compose up -d
```

### Standalone dockerfile in `backend/docker/` (local development only)

Standalone dockerfile with integration to [dependencies setup](#dependencies-only-mongodb--redis). The code will be taken from github's repo. Require SSH agent forwarding.

```
docker buildx build -t sap -f standalone --build-arg NODE_ENV=development --target=development --ssh default .
docker run --name standalone-local -p 0.0.0.0:3010:3010 --network backend -d standalone
```

### Running backend from local machine

Local machine code can also integrate with [dependencies setup](#dependencies-only-mongodb--redis).

```
pnpm start
```

### Running testing scripts

#### Install k6

Use this [k6 installation](https://k6.io/docs/get-started/installation/) guide to install k6 in order to run the test.

Run full automated load testing (requires **bash**): `pnpm load-test`

Run individual load test (from backend/): `k6 run ./test/k6/local/<filename>.js`

### Running mocha + chai unit tests

Run full automated unit testing: `pnpm unit-test`

Run individual test (from backend/): `pnpm mocha -c test/mocha/<filename>.mjs`

### Delete containers, images, volumes and builder cache

See all docker containers: `docker ps -a`

Kill active containers: `docker kill <name/container ID>`

Remove container: `docker container rm standalone-threadhub`

See all docker images: `docker images`

Remove image: `docker rmi standalone-threadhub`

See all docker volumes: `docker volume`

Remove docker volume: `docker volume rm <volume name/ID>`

Remove unused docker volume: `docker volume prune`

See all docker builder cache: `docker builder ls`

Remove unused docker builder: `docker builder prune`

### Troubleshoot

- Adjusting mongo docker configs: Delete container, volume and images. Followed by changing the init-mongo or compose files accordingly. Once volume is mounted and has data, the init script will not execute anymore.
- If there are permissions denied on logs, `sudo chmod -R 666 /var/log/ssd` and `sudo chown -R <user>:<user> /var/log/ssd` before running backend. Otherwise, comment out the pino-roll in config/pinoConfig.js.


## See Backend APIs Documentation

Go to [`http://127.0.0.1:3010/docs`](http://127.0.0.1:3010/docs)

## References

[Distutils missing for node gyp](https://stackoverflow.com/questions/77251296/distutils-not-found-when-running-npm-install)

[Local HTTPS development certs](https://github.com/FiloSottile/mkcert)

convert pem file to base64 string: `cat <file>.pem | openssl base64 | tr -d`