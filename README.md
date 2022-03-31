# Northcoders News API

## View the app [here](https://obscure-lowlands-69895.herokuapp.com/api)

--

## About

This is a RESTful API for articles, comments and users. It includes multiple endpoints with various params and queries. You can view `/api` to get a list of all available endpoints.

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
