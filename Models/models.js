const db = require('../db/connection');
const documentation = require('../endpoints.json');
const fs = require('fs/promises');
const format = require('pg-format');


async function getTopicsModel() {
    const { rows: topics } = await db.query("SELECT slug, description FROM topics;")
    return topics;
}

async function patchArticleModel(articleID, incCount) {
    if (incCount === undefined) {
        throw ({ code: "BAD_R" });
    }
    const result = await db.query(
        `
        UPDATE articles
        SET votes = votes + $2
        WHERE article_id = $1
        RETURNING *;    
      `,
        [articleID, incCount]
    )
    if (result.rowCount === 0) {
        throw({code: "NOARTICLE"})
    }
    return result.rows[0];
}

async function getArticleModel(articleID) {
    const { rows: results } = await db.query("SELECT * FROM articles WHERE article_id=$1;", [articleID]);
    if (!results.length) {
        throw ({ code: 404 })
    }
    return results;
}

async function postCommentModel(articleID, commentObj) {
    const { username, body } = commentObj;
    const userQuery = await db.query('SELECT * FROM users WHERE username=$1;', [commentObj.username])
    if (!userQuery.rowCount) {
        throw ({ code: "NOUSER" });
    }
    const result = await db.query(`
    INSERT INTO comments (article_id, body, author)
    VALUES ($1, $2, $3) RETURNING *;
    `, [articleID, body, username])
    return result.rows;
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

async function getAllArticlesModel() {
    const results = await db.query(`
    SELECT articles.article_id, articles.author, articles.topic, articles.created_at,
articles.votes, articles.title, articles.article_img_url,
COUNT(comments.article_id) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;
    `);
    return results.rows;

}
module.exports = {
    getTopicsModel,
    getApiModel,
    getCommentsModel,
    getAllArticlesModel,
    getArticleModel,
    postCommentModel,
    patchArticleModel
}