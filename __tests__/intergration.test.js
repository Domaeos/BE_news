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
describe.only("Get article API", () => {
    test("Should return status 200 if article exists", () => {
        return request(app).get("/api/articles/2").expect(200);
    })
    test("If article ID exists should return the article object found", () => {
        return request(app).get("/api/articles/2").expect(200).then(result => {
            expect(result.body.article).toMatchObject([
                {
                    article_id: 2,
                    title: 'Sony Vaio; or, The Laptop',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
                    created_at: '2020-10-16T05:03:00.000Z',
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                }
            ]
            )
        })
    })
    test("If no match found should return 404 error with message not found", () => {
        return request(app).get("/api/articles/9999999").expect(404).then(result => {
            expect(result.body.message).toBe("No match found");
        });
    })
    test("If passed an invalid search paramater, returns a 400 bad request error", () => {
        return request(app).get("/api/articles/fifty").expect(400).then(result => {
            expect(result.body.message).toBe("Bad request");
        });
    })
});