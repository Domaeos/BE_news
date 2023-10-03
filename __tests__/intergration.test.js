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
            console.log(returnObj);
            for (const key in returnObj) {
                expect(typeof returnObj[key].description).toBe("string")
                expect(Array.isArray(returnObj[key].queries)).toBe(true)
                expect(typeof returnObj[key].exampleResponse).toBe("object")
            }
        })
    })
});
describe.only("GET /api/articles/:id/comments", () => {
    test("Should return 200 status when passed an article ID with comments", () => {
        return request(app).get("/api/articles/1/comments").expect(200);
    })
    test("Should return an object with comments property containing an array of results", () => {
        return request(app).get("/api/articles/1/comments").expect(200).then(result => {
            const returnObj = result.body;
            expect(returnObj).hasOwnProperty("comments");
            expect(Array.isArray(returnObj.comments)).toBe(true);
        })
    })
    test("Each comment object in the return array should have correct properties", () => {
        return request(app).get("/api/articles/1/comments").expect(200).then(result => {
            const returnArray = result.body.comments;
            expect(returnArray.length).toBe(11);
            for (const index in returnArray) {
                expect(typeof returnArray[index].comment_id).toBe("number");
                expect(typeof returnArray[index].votes).toBe("number");
                expect(typeof returnArray[index].created_at).toBe("string");
                expect(typeof returnArray[index].author).toBe("string");
                expect(typeof returnArray[index].body).toBe("string");
                expect(returnArray[index].article_id).toBe(1);
            }
        })
    })
    test("When returned comments in array should be sorted by created_at ascending (newest first)", () => {
        return request(app).get("/api/articles/1/comments").expect(200).then(result => {
            const returnArray = result.body.comments;
            expect(returnArray).toBeSorted({key: 'created_at'})
        })
    })
    test("Given an invalid id type should return error: 400 bad request", () => {
        return request(app).get("/api/articles/text/comments").expect(400).then(result => {
            expect(result.body.message).toBe("Bad request");
        })
    })
    test("If no matches found for a given ID, return 404 match not found error", () => {
        return request(app).get("/api/articles/999/comments").expect(404).then(result => {
            expect(result.body.message).toBe("Match not found");
        })
    })
})