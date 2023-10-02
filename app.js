const express = require('express');
const {
    getTopics,
    getApi
} = require('./Controllers/controllers');

const app = express();


app.get("/api/topics", getTopics)
app.get("/api", getApi)

app.all("/*", (request, response) => {
    response.status(404).send({message: "Not found"})
})

app.use((err, req, res, next) => {
    res.status(500).send({message: "Internal server error"});
})
module.exports = app;