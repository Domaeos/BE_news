const db = require('../db/connection');
const documentation = require('../endpoints.json');
const fs = require('fs/promises');

async function getTopicsModel() {
    const { rows: topics } = await db.query("SELECT slug, description FROM topics;")
    return topics;
}

async function getArticleModel(articleID) {
    const { rows: results } = await db.query("SELECT * FROM articles WHERE article_id=$1;", [articleID]);
    if(!results.length) {
        throw({code: 404})
    }
    return results;     
}

async function getApiModel() {
    const documentation = await fs.readFile(__dirname + "/../endpoints.json", "utf-8");
    return JSON.parse(documentation);
}
async function getCommentsModel(articleID) {
    const { rows: comments } = await db.query
    ("SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at;", [articleID])
    if (!comments.length) {
        throw ({ code: 404 })
    }
    return comments;
}

async function getAllArticlesModel(queryObj) {
    let sqlStr = `
    SELECT articles.article_id, articles.author, articles.topic, articles.created_at,
articles.votes, articles.title, articles.article_img_url,
COUNT(comments.article_id) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
    `;
    if (queryObj.topic) {
        const greenListTopics = {};
        const validQueryNames = await db.query("SELECT slug FROM topics;")
        validQueryNames.rows.forEach(topic => {
            greenListTopics[topic.slug] = topic.slug;
        })
        if(greenListTopics[queryObj.topic]) {
            sqlStr += ` WHERE topic = '${queryObj.topic}'`
        } else {
            throw({code: "BAD_R"});
        }
    }
    sqlStr += ` GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    const results = await db.query(sqlStr);
    return results.rows;

}
module.exports = {
    getTopicsModel,
    getApiModel,
    getCommentsModel,
    getAllArticlesModel,
    getArticleModel
}