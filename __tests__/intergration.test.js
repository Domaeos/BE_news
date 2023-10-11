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
describe("GET /api/articles/:id/comments", () => {
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
            expect(returnArray).toBeSorted({ key: 'created_at' })
        })
    })
    test("Given an invalid id type should return error: 400 bad request", () => {
        return request(app).get("/api/articles/text/comments").expect(400).then(result => {
            expect(result.body.message).toBe("Bad request");
        })
    })
    test("If no matches found for a given ID, return 404 no match found error", () => {
        return request(app).get("/api/articles/999/comments").expect(404).then(result => {
            expect(result.body.message).toBe("Match not found");
        })
    })
})
describe.skip("GET /api/articles/", () => {
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
            expect(resultArray.length).toBe(13)
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
    test("Should return bad request if topic query is anything other than a string", () => {
        return request(app).get("/api/articles?topic=123").expect(400).then(result => {
            expect(result.body.message).toBe("Bad request")
        })
    })
    test("Should return a 200 if passed valid topic but no article with that topic", () => {
        return request(app).get("/api/articles?topic=paper").expect(200).then(result => {
            expect(result.body.articles.length).toBe(0)
        });
    })
    test("Should return only articles that match if passed a valid topic query", () => {
        return request(app).get("/api/articles?topic=cats").expect(200).then(result => {
            expect(result.body.articles.length).toBe(1)
        })
    })
    test("all returned objects should have the topic of matching query", () => {
        return request(app).get("/api/articles?topic=mitch").expect(200).then(result => {
            const articles = result.body.articles;
            for (const article of articles) {
                expect(article.topic).toBe("mitch");
            }
        })
    })

})
describe("GET /api", () => {
    test("Should return status 200 if article exists", () => {
        return request(app).get("/api/articles/2").expect(200);
    })
    test("If article ID exists should return the article object found", () => {
        return request(app).get("/api/articles/2").expect(200).then(result => {
            const returnObj = result.body.article[0];
            expect(typeof returnObj.author).toBe("string");
            expect(typeof returnObj.title).toBe("string");
            expect(typeof returnObj.body).toBe("string");
            expect(typeof returnObj.topic).toBe("string");
            expect(typeof returnObj.created_at).toBe("string");
            expect(typeof returnObj.article_img_url).toBe("string");
            expect(typeof returnObj.article_id).toBe("number");
            expect(typeof returnObj.votes).toBe("number");
        })
    })
    test("If no match found should return 404 error with message not found", () => {
        return request(app).get("/api/articles/9999999").expect(404).then(result => {
            expect(result.body.message).toBe("Match not found");
        });
    })
    test("If passed an invalid search paramater, returns a 400 bad request error", () => {
        return request(app).get("/api/articles/fifty").expect(400).then(result => {
            expect(result.body.message).toBe("Bad request");
        });
    })
})
describe("POST /api/articles/:articleID/comments", () => {
    test("Should return a 404 status and message no user if invalid username passed", () => {
        const testComment = {
            username: "ryan",
            body: "a comment again"
        }
        return request(app).post('/api/articles/1/comments').send(testComment).expect(404).then(result => {
            expect(result.body.message).toBe("Invalid username")
        });
    })
    test("Should return a 404 status and message no article if passed a nonexistent articleID", () => {
        const testComment = {
            username: "rogersop",
            body: "a comment again"
        }
        return request(app).post('/api/articles/99999/comments').send(testComment).expect(404).then(result => {
            expect(result.body.message).toBe(`Key (article_id)=(99999) is not present in table \"articles\".`)
        });
    })
    test("Should return 400 bad request if comment object passed is invalid", () => {
        const testComment = {
            username: "rogersop"
        }
        return request(app).post('/api/articles/2/comments').send(testComment).expect(400).then(result => {
            expect(result.body.message).toBe("Bad request")
        });

    })
    test("Should return 201 status and the correct post if the request is valid", () => {
        const testComment = {
            username: "rogersop",
            body: "a comment again"
        }
        return request(app).post('/api/articles/2/comments').send(testComment).expect(201).then(result => {
            const comment = result.body.comment[0];
            expect(comment.comment_id).toBe(19);
            expect(comment).hasOwnProperty("created_at");
            expect(comment.body).toBe("a comment again");
            expect(comment.votes).toBe(0);
            expect(comment.author).toBe("rogersop");
            expect(comment.article_id).toBe(2);
        });
    })
    test("Should ignore any extra properties sent", () => {
        const testComment = {
            username: "rogersop",
            body: "a comment again",
            randomProp: 2,
            anotherRandomExrtaProp: "text"
        }
        return request(app).post('/api/articles/2/comments').send(testComment).expect(201).then(result => {
            const comment = result.body.comment[0];
            expect(comment).not.hasOwnProperty("randomProp"),
            expect(comment).not.hasOwnProperty("anotherRandomExtraProp")
        });
    })
})



describe('PATCH /api/articles/:articleID', () => {
    test('should return a database-updated article with incremented votes ', () => {
        const testVote = {
            vote_increment: 3
        }
        return request(app).patch("/api/articles/2").send(testVote).expect(200).then(result => {
            const article= result.body.article;
            expect(article.article_id).toBe(2)
            expect(typeof article.author).toBe("string")
            expect(typeof article.title).toBe("string")
            expect(typeof article.topic).toBe("string")
            expect(typeof article.created_at).toBe("string")
            expect(typeof article.article_img_url).toBe("string")
            expect(typeof article.body).toBe("string")
            expect(article.votes).toBe(3);
        })
    })

    test("Should return bad request if not passed correct format", () => {
        return request(app).patch("/api/articles/2").send({}).expect(400).then(result => {
            expect(result.body.message).toBe("Bad request");
        })
    })
    test("Should return invalid article if article doesnt exist", () => {
        const testVote = {
            vote_increment: 3
        }
        return request(app).patch("/api/articles/99999").send(testVote).expect(404).then(result => {
            expect(result.body.message).toBe(`No matching article found`);
        })
    })
    test("Should return bad request if given invalid article ID", () => {
        const testVote = {
            vote_increment: 3
        }
        return request(app).patch("/api/articles/dave").send(testVote).expect(400).then(result => {
            expect(result.body.message).toBe(`Bad request`);
        })
    })
});

describe("Get article by ID API", () => {
    test("Should return status 200 if article exists", () => {
        return request(app).get("/api/articles/2").expect(200);
    })
    test("If article ID exists should return the article object found", () => {
        return request(app).get("/api/articles/2").expect(200).then(result => {
            const returnObj = result.body.article[0];
            expect(typeof returnObj.author).toBe("string");
            expect(typeof returnObj.title).toBe("string");
            expect(typeof returnObj.body).toBe("string");
            expect(typeof returnObj.topic).toBe("string");
            expect(typeof returnObj.created_at).toBe("string");
            expect(typeof returnObj.article_img_url).toBe("string");
            expect(typeof returnObj.article_id).toBe("number");
            expect(typeof returnObj.votes).toBe("number");
        })
    })
    test("If no match found should return 404 error with message not found", () => {
        return request(app).get("/api/articles/9999999").expect(404).then(result => {
            expect(result.body.message).toBe("Match not found");
        });
    })
    test("If passed an invalid search paramater, returns a 400 bad request error", () => {
        return request(app).get("/api/articles/fifty").expect(400).then(result => {
            expect(result.body.message).toBe("Bad request");
        });
    })
    describe("Add comment count to get article by ID", () => {
        test("Return objects should have a comment_count property", () => {
            return request(app).get("/api/articles/2").expect(200).then(result => {
                expect(result.body.article).hasOwnProperty("comment_count");
            });
        })
        test("Article should have the correct number of comments", () => {
            return request(app).get("/api/articles/1").expect(200).then(result => {
                expect(+result.body.article[0].comment_count).toBe(11);
            });
        })
    })
});

describe("GET /api/users", () => {
    test("Should return a status code of 200", () => {
        return request(app).get("/api/users").expect(200);
    })
    test("Should return an object with property users", () => {
        return request(app).get("/api/users").expect(200).then(result => {
            expect(result.body).hasOwnProperty("users");
        })
    })
    test("Users property should contain an array object with correct length of users", () => {
        return request(app).get("/api/users").expect(200).then(result => {
            expect(Array.isArray(result.body.users)).toBe(true);
            expect(result.body.users.length).toBe(4);
        })
    })
    test("Elements in returned array should contain an object with username, name, avatar_url", () => {
        return request(app).get("/api/users").expect(200).then(result => {
            for (const user of result.body.users) {
                expect(typeof user.username).toBe("string")
                expect(typeof user.name).toBe("string")
                expect(typeof user.avatar_url).toBe("string")
            }
        })
    })
})


describe("DELETE /api/comments/:commentID", () => {
    test ("Should return a bad request if no correct comment ID given", () => {
        return request(app).delete("/api/comments/fifty").expect(400).then(result => {
            expect(result.body.message).toBe("Bad request")
        });
    })
    test("Should return bad request if no comment with the ID passed is found", () => {
        return request(app).delete("/api/comments/9999999").expect(400).then(result => {
            expect(result.body.message).toBe("Bad request")
        });
    })
    test("Should return status 204 on successful deletion", () => {
        return request(app).delete("/api/comments/2").expect(204);  
    })
})

