const {
    getTopicsModel,
    getApiModel
} = require('../Models/models');

async function getTopics(req, res, next) {
    try {
        const topics = await getTopicsModel();
        res.status(200).send({ topics });
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
    getApi
}