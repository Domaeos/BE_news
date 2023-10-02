const express = require('express');
const {
    getTopics
} = require('./Controllers/controllers');

const app = express();


app.get("/api/topics", getTopics)
app.all("/*", (request, response) => {
    response.status(404).send({message: "Not found"})
})
module.exports = app;