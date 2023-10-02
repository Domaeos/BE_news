const express = require('express');
const {
    getTopics,
    getApi,
    getArticle
} = require('./Controllers/controllers');

const app = express();


app.get("/api/topics", getTopics)
app.get("/api", getApi)
app.get("/api/articles/:articleID", getArticle)

app.all("/*", (request, response) => {
    response.status(404).send({message: "Not found"})
})


app.use((err, req, res, next) => {
    if(err.code === 404) {
        res.status(404).send({message: "No match found"});
    }
    next(err);
})

app.use((err, req, res, next) => {
    if(err.code === "22P02") {
        res.status(400).send({message: "Bad request"});
    }
    next(err);
})
app.use((err, req, res, next) => {
    res.status(500).send({message: "Internal server error"});
})
module.exports = app;