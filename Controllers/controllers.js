const {
    getTopicsModel
} = require('../Models/models');

async function getTopics(req, res, next) {
    try {
        const topics = await getTopicsModel();
        res.status(200).send({topics});
    } catch(err) {
        next(err);
    }
}

module.exports = {
    getTopics
}