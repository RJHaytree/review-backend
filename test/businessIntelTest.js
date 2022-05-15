let auth_token = '';
let invalid_auth_token = 'invalid-auth-token'
execute = (server, chai, expect, should) => {

    // authenticate for auth_token;
    describe("AUTHENTICATE user endpoint for business intelligence endpoints", () => {
        it("It should successfully authenticate the user", (done) => {
            const user = {
                uid: 'admin',
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

    describe("GET local products by lowest average rating", () => {
        it("It should successfully return local products by lowest average rating", (done) => {
            chai.request(server)
                .get("/bi/lowest/avg/local")
                .set('auth-token', auth_token)
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

        it("It should not successfully return local products by lowest average rating", (done) => {
            chai.request(server)
                .get("/bi/lowest/avg/local")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        });
    });

    describe("GET local products by highest average rating", () => {
        it("It should successfully return local products by highest average rating", (done) => {
            chai.request(server)
                .get("/bi/highest/avg/local")
                .set('auth-token', auth_token)
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

        it("It should not successfully return local products by highest average rating", (done) => {
            chai.request(server)
                .get("/bi/highest/avg/local")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        });
    });

    describe("GET local product by lowest number of reviews", () => {
        it("It should successfully return local products by lowest number of reviews", (done) => {
            chai.request(server)
                .get("/bi/lowest/count")
                .set('auth-token', auth_token)
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

        it("It should not successfully return local products by lowest number of reviews", (done) => {
            chai.request(server)
                .get("/bi/lowest/count")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        });
    });

    describe("GET local products by highest number of reviews", () => {
        it("It should successfully return local products by highest number of reviews", (done) => {
            chai.request(server)
                .get("/bi/highest/count")
                .set('auth-token', auth_token)
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

        it("It should not successfully return local products by highest number of reviews", (done) => {
            chai.request(server)
                .get("/bi/highest/count")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        });
    });

    describe("GET leaderboard by number of reviews", () => {
        it("It should successfully return a leaderboard payload", (done) => {
            chai.request(server)
                .get("/bi/leaderboard")
                .set('auth-token', auth_token)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.user.should.be.a('object');
                    response.body.success.payload.leaderboard.should.be.a('array');
                    response.body.success.payload.leaderboard.length.should.be.greaterThan(0);
                    done();
                });
        });

        it("It should not successfully return a leaderboard payload", (done) => {
            chai.request(server)
                .get("/bi/leaderboard")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        });
    });

    describe("GET global products by highest average rating", () => {
        it("It should successfully return products by global highest average rating", (done) => {
            chai.request(server)
                .get("/bi/highest/avg/global")
                .set('auth-token', auth_token)
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

        it("It should not successfully return products by global highest average rating", (done) => {
            chai.request(server)
                .get("/bi/highest/avg/global")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        });
    });

    describe("GET global products by lowest average rating", () => {
        it("It should successfully return products by global lowest average rating", (done) => {
            chai.request(server)
                .get("/bi/lowest/avg/global")
                .set('auth-token', auth_token)
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

        it("It should not successfully return products by global lowest average rating", (done) => {
            chai.request(server)
                .get("/bi/lowest/avg/global")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        });
    });

    describe("GET recent global reviews", () => {
        it("It should successfully return global recent product reviews - MONTH", (done) => {
            let req = { timeframe: 'MONTH' };

            chai.request(server)
                .post("/bi/recent")
                .set('auth-token', auth_token)
                .send(req)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.have.property('reviews');
                    response.body.success.payload.reviews.should.be.a('array');
                    response.body.success.payload.reviews.length.should.be.greaterThan(0);
                    done();
                })
        });

        it("It should successfully return global recent product reviews - WEEK", (done) => {
            let req = { timeframe: 'WEEK' };

            chai.request(server)
            .post("/bi/recent")
            .set('auth-token', auth_token)
            .send(req)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('success');
                response.body.success.should.have.property('status');
                response.body.success.should.have.property('payload');
                response.body.success.payload.should.have.property('reviews');
                response.body.success.payload.reviews.should.be.a('array');
                response.body.success.payload.reviews.length.should.be.greaterThan(0);
                done();
            })
        });

        it("It should successfully return global recent product reviews - DAY", (done) => {
            let req = { timeframe: 'DAY' };

            chai.request(server)
            .post("/bi/recent")
            .set('auth-token', auth_token)
            .send(req)
            .end((error, response) => {
                response.should.have.status(200);
                response.body.should.be.a('object');
                response.body.should.have.property('success');
                response.body.success.should.have.property('status');
                response.body.success.should.have.property('payload');
                response.body.success.payload.should.have.property('reviews');
                response.body.success.payload.reviews.should.be.a('array');
                response.body.success.payload.reviews.length.should.be.greaterThan(0);
                done();
            })
        });

        it("It should not successfully return global recent product reviews - Invalid auth token", (done) => {
            let req = { timeframe: 'MONTH' };

            chai.request(server)
            .post("/bi/recent")
            .set('auth-token', invalid_auth_token)
            .send(req)
            .end((error, response) => {
                response.should.have.status(401);
                done();
            })
        });

        it("It should not successfully return global recent product reviews - Invalid tiemframe", (done) => {
            let req = { timeframe: 'YEAR' };

            chai.request(server)
            .post("/bi/recent")
            .set('auth-token', auth_token)
            .send(req)
            .end((error, response) => {
                response.should.have.status(400);
                done();
            })
        });
    });
}

module.exports = { execute }