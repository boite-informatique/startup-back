## Description

1SC multidisplinary project Diploma-Startup/Patent REST API backend implementation in NestJs

## Project Initilization

Upon opening this repository in VS Code it will prompt you to install recommended extensions (Prettier, ESLint, Prisma, .. etc)

You will also find VS Code workspace settings for formatting text and indentation already set up. As Well as running pre-commit hooks from npm/husky to run formatting and linting checks.

## Installation

```bash
$ npm install && npm run prepare
$ mv env.example .env
$ npx prisma generate
```

## Running The App

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running The Dev Database

Make sure to have `docker` and `docker-compose` installed.

```bash
# cd to prisma directory
$ cd prisma

# start the database
$ docker-compose up

# start the database in background
$ docker-compose up -d
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
