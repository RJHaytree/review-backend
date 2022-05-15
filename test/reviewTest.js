let auth_token = '';
let invalid_auth_token = 'invalid-auth-token';

let api_key = '';
let invalid_api_key = 'invalid-api-key';

let review_id = '';

execute = (server, chai, expect, should) => {
    describe("AUTHENTICATE user endpoint for review endpoints", () => {
        it("It should successfully authenticate the user", (done) => {
            const user = {
                uid: 'mochatest',
                password: 'Password123.'
            };
    
            chai.request(server)
                .post("/user/auth")
                .send(user)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.header.should.have.property('auth-token');
                    auth_token = response.header['auth-token'];
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.have.property('username');
                    response.body.success.payload.should.have.property('organisation');
                    done();
                });
        });
    });

    describe("POST key endpoint for review endpoints", () => {
        it("It should successfully post a new api key", (done) => {
            chai.request(server)
                .post("/user/keys/new")
                .set('auth-token', auth_token)
                .end((error, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.have.property('id');
                    response.body.success.payload.should.have.property('key');
                    response.body.success.payload.should.have.property('date_generated');
                    response.body.success.payload.should.have.property('enabled');
                    response.body.success.payload.should.have.property('user_id');
                    api_key = response.body.success.payload['key'];
                    done();
                })
        });
    });

    describe("POST review endpoint", () => {
        it("It should successfully submit a review", (done) => {
            const review = {
                reviewer: 'testuser',
                rating: 8,
                description: 'This phone is fantastic',
                item_id: 1,
                api_key: api_key
            };
    
            chai.request(server)
                .post("/reviews/add")
                .send(review)
                .end((error, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.have.property('reviewer');
                    review_id = response.body.success.payload['id'];
                    done();
                });
        });

        it("It should not successfully submit a review", (done) => {
            const review = {
                reviewer: 'testuser',
                rating: 8,
                description: 'This phone is fantastic',
                item_id: 1,
                api_key: invalid_api_key
            };

            chai.request(server)
                .post("/reviews/add")
                .send(review)
                .end((error, response) => {
                    response.should.have.status(400);
                    done();
                });
        })
    });

    describe("GET ALL reviews endpoint endpoint", () => {
        it("It should successfully return all reviews for this user", (done) => {
            const key = { api_key: api_key };

            chai.request(server)
                .get("/reviews/all")
                .send(key)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.be.a('array');
                    response.body.success.payload.length.should.be.greaterThan(0);
                    done();
                })
        });

        it("It should not successfully return all reviews", (done) => {
            const key = { api_key: invalid_api_key };

            chai.request(server)
                .get("/reviews/all")
                .send(key)
                .end((error, response) => {
                    response.should.have.status(400);
                    done();
                })
        });
    });

    describe("GET ALL local reviews by product name endpoint", () => {
        it("It should successfully return all local reviews by this name", (done) => {
            const req = {
                api_key: api_key,
                name: 'Samsung Galaxy S22 Ultra'
            };

            chai.request(server)
                .get("/reviews/local/item/name")
                .send(req)
                .end((error, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.be.a('array');
                    response.body.success.payload.length.should.be.greaterThan(0);
                    done();
                })
        });

        it("It should not successfully return all local reviews by this name", (done) => {
            const req = {
                api_key: api_key,
                name: 'Blackberry'
            }; 

            chai.request(server)
                .get("/reviews/local/item/name")
                .send(req)
                .end((error, response) => {
                    response.should.have.status(400)
                    done();
                })
        });
    });

    describe("GET ALL local reviews by product ID endpoint", () => {
        it("It should successfully return all local reviews for that product", (done) => {
            const req = {
                api_key: api_key
            };

            chai.request(server)
                .get("/reviews/local/item/1")
                .send(req)
                .end((error, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.be.a('array');
                    response.body.success.payload.length.should.be.greaterThan(0);
                    done();
                });
        });

        it("It should not successfully return all local reviews for that product", (done) => {
            const req = {
                api_key: api_key
            }; 

            chai.request(server)
                .get("/reviews/local/item/7887767")
                .send(req)
                .end((error, response) => {
                    response.should.have.status(400)
                    done();
                })
        });
    });

    describe("GET ALL global reviews by product name endpoint", () => {
        it("It should successfully return all global reviews by this name", (done) => {
            const req = {
                api_key: api_key,
                name: 'Samsung Galaxy S22 Ultra'
            };

            chai.request(server)
                .get("/reviews/global/item/name")
                .send(req)
                .end((error, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.be.a('array');
                    response.body.success.payload.length.should.be.greaterThan(0);
                    done();
                })
        });

        it("It should not successfully return all global reviews by this name", (done) => {
            const req = {
                api_key: api_key,
                name: 'Blackberry'
            }; 

            chai.request(server)
                .get("/reviews/global/item/name")
                .send(req)
                .end((error, response) => {
                    response.should.have.status(400)
                    done();
                })
        });
    });

    describe("GET ALL global reviews by product ID endpoint", () => {
        it("It should successfully return all global reviews for that product", (done) => {
            const req = {
                api_key: api_key
            };

            chai.request(server)
                .get("/reviews/global/item/1")
                .send(req)
                .end((error, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.be.a('array');
                    response.body.success.payload.length.should.be.greaterThan(0);
                    done();
                });
        });

        it("It should not successfully return all global reviews for that product", (done) => {
            const req = {
                api_key: api_key
            }; 

            chai.request(server)
                .get("/reviews/global/item/7887767")
                .send(req)
                .end((error, response) => {
                    response.should.have.status(400)
                    done();
                })
        });
    });

    describe("GET review by ID endpoint", () => {
        it("It should successfully return the review with the corresponding ID", (done) => {
            let req = {
                api_key: api_key
            };

            chai.request(server)
                .get("/reviews/" + review_id)
                .send(req)
                .end((error, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.have.property('id').eq(review_id);
                    done();
                });
        });

        it("It should not successfully return the review with the corresponding ID", (done) => {
            let req = {
                api_key: api_key
            };

            chai.request(server)
                .get("/reviews/" + 88787667)
                .send(req)
                .end((error, response) => {
                    response.should.have.status(400)
                    done();
                });
        });
    });

    describe("PUT review endpoint", () => {
        it("It should successfully update the review", (done) => {
            const review = {
                id: review_id,
                reviewer: 'testuser',
                rating: 6,
                description: 'This phone was fantastic but I have started to get display issues.',
                item_id: 1,
                api_key: api_key
            };

            chai.request(server)
                .put("/reviews/")
                .send(review)
                .end((error, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.have.property('description').eq(review.description);
                    done();
                });
        });

        it("It should not successfully update the review - invalid API key", (done) => {
            const review = {
                id: review_id,
                reviewer: 'testuser',
                rating: 6,
                description: 'This phone was fantastic but I have started to get display issues.',
                item_id: 1,
                api_key: invalid_api_key
            };

            chai.request(server)
                .put("/reviews/")
                .send(review)
                .end((error, response) => {
                    response.should.have.status(400)
                    done();
                });
        });

        it("It should not successfully update the review - invalid review structure", (done) => {
            const review = {
                id: review_id,
                rating: 6,
                description: 'This phone was fantastic but I have started to get display issues.',
                item_id: 1,
                api_key: api_key
            };

            chai.request(server)
                .put("/reviews/")
                .send(review)
                .end((error, response) => {
                    response.should.have.status(400)
                    done();
                });
        });
    });

    describe("DELETE review endpoint", () => {
        it("It should not successfully delete the review", (done) => {
            const req = {
                id: 134535454564,
                api_key: api_key
            };

            chai.request(server)
                .delete("/reviews/")
                .send(req)
                .end((error, response) => {
                    response.should.have.status(400);
                    done();
                })
        });


        it("It should successfully delete the review", (done) => {
            const req = {
                id: review_id,
                api_key: api_key
            };

            chai.request(server)
            .delete("/reviews/")
            .send(req)
            .end((error, response) => {
                response.should.have.status(201);
                response.body.should.be.a('object');
                response.body.should.have.property('success');
                response.body.success.should.have.property('status');
                response.body.success.should.have.property('payload').eq(review_id);
                done();
            })
        });
    });
}

module.exports = { execute }