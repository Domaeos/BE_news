const {
    getTopicsModel,
    getApiModel,
    getCommentsModel,
    getAllArticlesModel,
    getArticleModel,
    postCommentModel,
    patchArticleModel
} = require('../Models/models');

async function getTopics(req, res, next) {
    try {
        const topics = await getTopicsModel();
        res.status(200).send({ topics });
    } catch (err) {
        next(err);
    }
}
async function patchArticle(req, res, next) {
    try {
    const article = await patchArticleModel(req.params.articleID, req.body.vote_increment);
    res.status(200).send({article});
    } catch (err) {
        next(err);
    }
}

async function postComment(req, res, next) {
    try {
        const comment = await postCommentModel(req.params.articleID, req.body)
        res.status(201).send({comment});
    } catch (err) {
        next(err);
    }
}
async function getComments(req, res, next) {
    try {
        const comments = await getCommentsModel(req.params.article_id, req.body);
        res.status(200).send({ comments });
    } catch (err) {
        next(err);
    }
}

async function getAllArticles(req, res, next) {
    try {
        const articles = await getAllArticlesModel(req);
        res.status(200).send({  articles });
    } catch (err) {
        next(err);
    }
}

async function getArticle(req, res, next) {
    try {
        const article = await getArticleModel(req.params.articleID);
        res.status(200).send({ article });
    } catch (err) {
        next(err);
    }
}

async function getApi(req, res, next) {
    try {
        const documentation = await getApiModel();
        res.status(200).send({ API: documentation });
    } catch (err) {
        next(err);
    }
}



module.exports = {
    getTopics,
    getApi,
    getComments,
    getAllArticles,
    getArticle,
    postComment,
    patchArticle
}