const {
    getTopicsModel,
    getApiModel,
    getArticleModel
} = require('../Models/models');

async function getTopics(req, res, next) {
    try {
        const topics = await getTopicsModel();
        res.status(200).send({ topics });
    } catch (err) {
        next(err);
    }
}
async function getArticle(req, res, next) {
    try {
        const article = await getArticleModel(req.params.articleID);
        res.status(200).send({article});
    } catch (err) {
        next(err);
    }
}

async function getApi(req, res, next) {
    try {
        const documentation = await getApiModel();
        res.status(200).send({API: documentation});
    } catch (err) {
        next(err);
    }
}



module.exports = {
    getTopics,
    getApi,
    getArticle
}