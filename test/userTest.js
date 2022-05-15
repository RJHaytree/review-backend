let auth_token = '';
let invalid_auth_token = 'invalid-token';
let valid_key = '';
let invalid_key = '118374625ahdyekrt537n$5675k533zfgh5657yhgre5e5.hter54f32qwdg68855';

let api_key_id = '';
let invalid_api_key_id = 10887;

let subscription_id = '';
let invalid_subscription_id = 10887;

execute = (server, chai, expect, should) => {

    // Register endpoint
    describe("POST user endpoint", () => {
        // should pass
        it("It should successfully register a new user", (done) => {
            const user = {
                username: 'mochatest',
                password: 'Password123.',
                email: 'mochatest@test.com',
                organisation: 'Mocha',
                card_num: '',
                card_expiry: '',
                card_cvv: ''
            };

            chai.request(server)
                .post("/user/register")
                .send(user)
                .end((error, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.have.property('id');
                    response.body.success.payload.should.have.property('username');
                    response.body.success.payload.should.have.property('email');
                    response.body.success.payload.should.have.property('organisation');
                    done();
                })
        });

        it("It should fail to register a new user", (done) => {
            const user = {
                username: '',
                password: 'Password123.',
                email: 'mochatest@test.com',
                organisation: 'Mocha',
                card_num: '',
                card_expiry: '',
                card_cvv: ''
            };

            chai.request(server)
                .post("/user/register")
                .send(user)
                .end((error, response) => {
                    response.should.have.status(400);
                    done();
                });
        })
    });

    // Authenticate endpoint
    describe("AUTHENTICATE user endpoint", () => {
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

        it("It should fail to authenticate the user", (done) => {
            const user = {
                uid: 'mochatest',
                password: 'Pass123.'
            };

            chai.request(server)
                .post("/user/auth")
                .send(user)
                .end((error, response) => {
                    response.should.have.status(400);
                    done();
                })
        });
    });

    // Get User endpoint
    describe("GET user endpoint", () => {
        it("It should successfully return the user", (done) => {
            chai.request(server)
                .get("/user/get")
                .set('auth-token', auth_token)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.have.property('username');
                    response.body.success.payload.should.have.property('email');
                    response.body.success.payload.should.have.property('organisation');
                    response.body.success.payload.should.not.have.property('password');
                    done();
                })
        });

        it("It should fail to return the user", (done) => {
            chai.request(server)
                .get("/user/get")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        });
    });

    // Generate key endpoint
    describe("POST key endpoint", () => {
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
                    api_key_id = response.body.success.payload['id'];
                    done();
                })
        });

        it("It should fail to successfully post a new api key", (done) => {
            chai.request(server)
                .post("/user/keys/new")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        });
    });

    // Get all keys endpoint
    describe("GET ALL keys endpoint", () => {
        it("It should successfully return all keys", (done) => {
            chai.request(server)
                .get("/user/keys/all")
                .set('auth-token', auth_token)
                .end((error, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.be.a('array');
                    response.body.success.payload.length.should.be.greaterThan(0);
                    done();
                })
        });

        it("It should fail to successfully return all keys", (done) => {
            chai.request(server)
                .get("/user/keys/all")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        });
    });

    // Toggle key endpoint
    describe("UPDATE key endpoint", () => {
        it("It should successfully toggle the key", (done) => {
            chai.request(server)
                .put("/user/keys/" + api_key_id)
                .set('auth-token', auth_token)
                .end((error, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.have.property('enabled').eq(false);
                    done();
                })
        });

        it("It should fail to successfully toggle the key - invalid auth token", (done) => {
            chai.request(server)
                .get("/user/keys/" + api_key_id)
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(404);
                    done();
                })
        });

        it("It should fail to successfully toggle the key - invalid key", (done) => {
            chai.request(server)
                .get("/user/keys/" + invalid_api_key_id)
                .set('auth-token', auth_token)
                .end((error, response) => {
                    response.should.have.status(404);
                    done();
                })
        });
    });

    // Delete key endpoint
    describe("DELETE key endpoint", () => {
        it("It should successfully delete the API key", (done) => {
            let req = { api_key_ids: [] };
            req.api_key_ids.push(api_key_id);
    
            chai.request(server)
                .delete("/user/keys")
                .set('auth-token', auth_token)
                .send(req)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.success.should.have.property('payload').eq('API keys deleted.');
                    done();
                });
        });

        it("It should not successfully delete the API key", (done) => {
            let req = { api_key_ids: [] };
            req.api_key_ids.push(invalid_api_key_id);

            chai.request(server)
                .delete("/user/keys")
                .set('auth-token', auth_token)
                .send(req)
                .end((error, response) => {
                    response.should.have.status(400);
                    done();
                })
        });
    });

    // Add subscription endpoint
    describe("POST subscription endpoint", () => {

        it("It should successfully add a subscription", (done) => {
            let req = { interval: 'ANNUAL'};

            chai.request(server)
                .post("/user/subscription/add")
                .set('auth-token', auth_token)
                .send(req)
                .end((error, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.have.property('interval').eq('ANNUAL');
                    subscription_id = response.body.success.payload['id'];
                    done();
                })
        });

        it("It should not successfully add a subscription - Invalid Interval", (done) => {
            let req = { interval: 'ANNUALLY'};

            chai.request(server)
                .post("/user/subscription/add")
                .set('auth-token', auth_token)
                .send(req)
                .end((error, response) => {
                    response.should.have.status(400);
                    done();
                })
        });
    });

    // Return all subscriptions endpoint
    describe("GET all subscriptions endpoint", () => {
        it("It should successfully return all subscriptions", (done) => {
            chai.request(server)
                .get("/user/subscription/all")
                .set('auth-token', auth_token)
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

        it("It should fail to successfully return all subscriptions", (done) => {
            chai.request(server)
                .get("/user/subscription/all")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        })
    });

    // Return active subscription endpoint
    describe("GET active subscription endpoint", () => {
        it("It should successfully return all active subscriptions", (done) => {
            chai.request(server)
                .get("/user/subscription/active")
                .set('auth-token', auth_token)
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

        it("It should fail to successfully return all active subscriptions", (done) => {
            chai.request(server)
                .get("/user/subscription/all")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        })
    });

    // Cancel subscription endpoint.
    describe("UPDATE subscription endpoint", () => {
        it("It should successfully cancel the subscription", (done) => {
            chai.request(server)
                .put("/user/subscription/cancel/" + subscription_id)
                .set('auth-token', auth_token)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    done();
                })
        });

        it("It should not successfully cancel the subscription", (done) => {
            chai.request(server)
                .put("/user/subscription/cancel/" + invalid_subscription_id)
                .set('auth-token', auth_token)
                .end((error, response) => {
                    response.should.have.status(400);
                    done();
                })
        })
    });
};

module.exports = { execute }