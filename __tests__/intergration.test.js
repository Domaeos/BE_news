const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const db = require("../db/connection");
const data = require('../db/data/test-data/');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("Undefined endpoints", () => {
    test("Should return a status of 404", () => {
        return request(app).get("/api/not_real_point").expect(404);
    })
    test("Should return an object with property message", () => {
        return request(app).get("/api/not_real_point").expect(404)
            .then(result => {
                expect(result.body).hasOwnProperty("message")
            })
    })
    test("Message should say not found", () => {
        return request(app).get("/api/not_real_point").expect(404)
            .then(result => {
                expect(result.body.message)
                    .toBe("Not found");
            })
    })
})
describe("GET /api/topics", () => {
    test("Should return a status code of 200", () => {
        return request(app).get("/api/topics").expect(200);
    })
    test("Should return an object with property topics", () => {
        return request(app).get("/api/topics").expect(200).then(result => {
            expect(result.body).hasOwnProperty("topics");
        })
    })
    test("Topics property should contain an array object", () => {
        return request(app).get("/api/topics").expect(200).then(result => {
            expect(Array.isArray(result.body.topics)).toBe(true);
        })
    })
    test("Elements in returned array should contain an object with slug and description", () => {
        return request(app).get("/api/topics").expect(200).then(result => {
            for (const topic of result.body.topics) {
                expect(topic).hasOwnProperty("slug");
                expect(topic).hasOwnProperty("description");
            }
        })
    })
})
describe("GET /api", () => {
    test("Should return a 200 status code", () => {
        return request(app).get("/api").expect(200);
    })
    test("Should return an object with API property", () => {
        return request(app).get("/api").expect(200).then(result => {
            expect(result.body).hasOwnProperty("API");
        });
    })
    test("each API endpoint documentation should have set properties", () => {
        return request(app).get("/api").expect(200).then(result => {
            const returnObj = result.body.API;
            for (const apiObj in returnObj) {
                expect(returnObj[apiObj]).hasOwnProperty("description")
                expect(returnObj[apiObj]).hasOwnProperty("queries")
                expect(returnObj[apiObj]).hasOwnProperty("exampleResponse")
            }
        })
    })
    test("each API property should be correct type", () => {
        return request(app).get("/api").expect(200).then(result => {
            const returnObj = result.body.API;
            for (const key in returnObj) {
                expect(typeof returnObj[key].description).toBe("string")
                expect(Array.isArray(returnObj[key].queries)).toBe(true)
                expect(typeof returnObj[key].exampleResponse).toBe("object")
            }
        })
    })
});
describe("get all articles endpoint", () => {
    test("Should return a 200 status code", () => {
        return request(app).get("/api/articles/").expect(200);
    })
    test("Should return an array in property 'articles'", () => {
        return request(app).get("/api/articles/").expect(200).then(result => {
            expect(result.body).hasOwnProperty("articles");
            expect(Array.isArray(result.body.articles)).toBe(true);
        })
    })
    test("Should return each article with correct properties", () => {
        return request(app).get("/api/articles/").expect(200).then(result => {
            const resultArray = result.body.articles;
            if (resultArray.length) {
                resultArray.forEach(article => {
                    expect(typeof article.article_id).toBe("number")
                    expect(typeof article.author).toBe("string")
                    expect(typeof article.title).toBe("string")
                    expect(typeof article.comment_count).toBe("string");
                    expect(typeof article.topic).toBe("string")
                    expect(typeof article.created_at).toBe("string")
                    expect(typeof article.votes).toBe("number")
                    expect(typeof article.article_img_url).toBe("string")
                    expect(article).not.hasOwnProperty("body");
                })
            }
        });
    })
    test("Should return the correct amount of comments for an article", () => {
        return request(app).get("/api/articles/").expect(200).then(result => {
            const resultArray = result.body.articles;
            const article5 = resultArray.find(article => article.article_id === 5);
            expect(+article5.comment_count).toBe(2);
        });
    })
    test("Should be sorted by created_at in descending order", () => {
        return request(app).get("/api/articles/").expect(200).then(result => {
            const resultArray = result.body.articles;
            expect(resultArray).toBeSorted({ key: 'created_at', descending: true });
        });
    })
})