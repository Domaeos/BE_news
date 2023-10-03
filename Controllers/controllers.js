const {
    getTopicsModel,
    getApiModel,
    getAllArticlesModel,
} = require('../Models/models');

async function getTopics(req, res, next) {
    try {
        const topics = await getTopicsModel();
        res.status(200).send({ topics });
    } catch (err) {
        next(err);
    }
}
async function getAllArticles(req, res, next) {
    try {
        const articles = await getAllArticlesModel(req);
        res.status(200).send({articles});
    } catch(err) {
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
    getAllArticles
}