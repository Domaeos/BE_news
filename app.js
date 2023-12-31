const express = require('express');
const cors = require('cors');
const {
    getTopics,
    getApi,
    getComments,
    getAllArticles,
    getArticle,
    postComment,
    patchArticle,
    getUsers,
    deleteComment
} = require('./Controllers/controllers');

const app = express();
app.use(cors());
app.use(express.json());


app.get("/api/topics", getTopics)
app.get("/api", getApi)
app.get("/api/articles/:article_id/comments", getComments)
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:articleID", getArticle)
app.post("/api/articles/:articleID/comments", postComment)
app.patch("/api/articles/:articleID", patchArticle)
app.get("/api/users", getUsers)
app.delete("/api/comments/:commentID", deleteComment)

app.all("/*", (request, response) => {
    response.status(404).send({ message: "Not found" })
})


app.use((err, req, res, next) => {
    if (err.code === "NOUSER") {
        res.status(404).send({ message: "Invalid username" })
    } else {
        next(err);
    }
});
app.use((err, req, res, next) => {
    if (err.code === "NOARTICLE") {
        res.status(404).send({ message: "No matching article found" })
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code === "BAD_R" || err.code === "23502") {
        res.status(400).send({ message: "Bad request" })
    } else {
        next(err);
    }
})
app.use((err, req, res, next) => {
    if (err.code === "23503") {
        res.status(404).send({ message: err.detail })
    } else {
        next(err);
    }
})
app.use((err, req, res, next) => {
    if (err.code === 404) {
        res.status(404).send({ message: "Match not found" })
    } else {
        next(err);
    }
})
app.use((err, req, res, next) => {
    res.status(500).send({ message: "Internal server error" });
})

module.exports = app;