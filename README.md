# Northcoders News API

## Project Summary

An API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.
Hosted Version

You can find the hosted version of the API here: https://news-app-4jdh.onrender.com/api/users

Paths

These paths are avaiable on the api:

    /api : Serves up a json representation of all the available endpoints of the api
    /api/topics : Serves an array of all topics
    /api/articles/:article_id : Serves an article object
    /api/articles : Serves an array of all articles
    /api/articles/:article_id/comments : Serves an array of all comments for a specified article
    /api/users : Serves an array of all users

Local Hosting Setup
Version Requirements

    Node.js v20.5.1
    Psql v14.9 (Homebrew)

Environment Variables

In order to run this project locally, you will need to create the following environment variables with these filenames and the respective database assignment:

.env.development

`PGDATABASE=nc_news`

.env.test

`PGDATABASE=nc_news_test`

Reference the .env-example file if you have any formatting issues.

## Dependencies

To install the required dependencies run `npm install` in your terminal environment

You should now have the following dependencies in the package.json file:
```JSON
"dependencies": {
"dotenv": "^16.0.0",
"express": "^4.18.2",
"pg": "^8.7.3"
}
```

Developer Dependencies (required for testing)

```JSON
"devDependencies": {
"husky": "^8.0.2",
"jest": "^27.5.1",
"jest-extended": "^2.0.0",
"jest-sorted": "^1.0.14",
"pg-format": "^1.0.4",
"supertest": "^6.3.3"
}
```

## Local Behaviour

In order to run the server locally, you will need to create the databases and seed them first; using the following code:

### Database Creation

`npm run setup-dbs`

### Seeding

`npm run seed`

You can then run the server locally using:

`npm start`

### Testing

In order to run tests, enter the following code:

npm run test
