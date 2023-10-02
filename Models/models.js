const db = require('../db/connection');

async function getTopicsModel() {
    const {rows: topics} = await db.query("SELECT slug, description FROM topics;")
    return topics;
}

module.exports = {
    getTopicsModel
}