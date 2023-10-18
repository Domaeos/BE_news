const db = require('../db/connection');
const fs = require('fs/promises');


async function getTopicsModel() {
    const { rows: topics } = await db.query("SELECT slug, description FROM topics;")
    return topics;
}
async function getUsersModel() {
    const results = await db.query("SELECT * FROM users;")
    return results.rows;
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
    const { rows: results } = await db.query(`
    SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1
  GROUP BY comments.article_id, articles.article_id;
    `, [articleID]);
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

async function deleteCommentModel(commentID) {
    const result = await db.query(`
      DELETE FROM comments
      WHERE comment_id = $1;
    `,[commentID]);
    if (!result.rowCount) {
        throw({code: "22P02"})
    }
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
    getArticleModel,
    postCommentModel,
    patchArticleModel,
    getUsersModel,
    deleteCommentModel
}