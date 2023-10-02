const db = require('../db/connection');
const documentation = require('../endpoints.json');
const fs = require('fs/promises');

async function getTopicsModel() {
    const {rows: topics} = await db.query("SELECT slug, description FROM topics;")
    return topics;
}

async function getApiModel() {
    const documentation = await fs.readFile(__dirname + "/../endpoints.json", "utf-8");
    return JSON.parse(documentation);
}

module.exports = {
    getTopicsModel,
    getApiModel
}