const express = require('express');
const {
    getTopics,
    getApi,
    getComments
} = require('./Controllers/controllers');

const app = express();


app.get("/api/topics", getTopics)
app.get("/api", getApi)
app.get("/api/articles/:article_id/comments", getComments)

app.all("/*", (request, response) => {
    response.status(404).send({message: "Not found"})
})

app.use((err, req, res, next) => {
    if(err.code === "22P02") {
        res.status(400).send({message: "Bad request"})
    }
    next(err);
})
app.use((err, req, res, next) => {
    if(err.code === 404) {
        res.status(404).send({message: "Match not found"})
    }
    next(err);
})
app.use((err, req, res, next) => {
    res.status(500).send({message: "Internal server error"});
})
module.exports = app;