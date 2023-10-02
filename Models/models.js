const db = require('../db/connection');
const documentation = require('../endpoints.json');
const fs = require('fs/promises');

async function getTopicsModel() {
    const {rows: topics} = await db.query("SELECT slug, description FROM topics;")
    return topics;
}

async function getArticleModel(articleID) {
    const { rows: results } = await db.query("SELECT * FROM articles WHERE article_id=$1;", [articleID]);
    return results;
}
async function getApiModel() {
    const documentation = await fs.readFile(__dirname + "/../endpoints.json", "utf-8");
    return JSON.parse(documentation);
}

module.exports = {
    getTopicsModel,
    getApiModel,
    getArticleModel
}