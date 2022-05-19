# Northcoders News API

## View the app [here](https://obscure-lowlands-69895.herokuapp.com/api)

--

## About

This is a RESTful API for articles, comments and users. It includes multiple endpoints with various params and queries. You can view `/api` to get a list of all available endpoints. It uses NodeJS and Express to build out a web server, we use Express Router to handle routing, makes use of Error handling and we have implemented unit testing with Jest and Supertest. Checkout the link above to view all endpoints available.

## Dependencies

- dotenv

- express

- pg

## Dev Dependencies

- husky

- jest

- jest-extended

- jest-sorted

- pg-format

## Using this API

- First you would need to clone this repository.

- Then you would need to create `.env.test` and `.env.development` and add the names for the database for each, they would be `nc_news_test` and `nc_news` respectively. Then follow these steps:

- run `npm run install`

- run `npm run setup-dbs`

- run `npm run seed`

- finally if you run `npm test` you can view all tests

## Minimum Versions

- Node - `v17.8.0`

- Postgres - `psql (PostgreSQL) 14.2`

## Available Scripts

- `setup-dbs` - uses psql to create databases

- `seed` - used to seed the database with test data

- `test` - runs the test suite

- `prepare` - sets up husky, used for testing prior to commits

- `start` - uses node to start the application
