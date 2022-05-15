let auth_token = '';
let invalid_auth_token = 'invalid-token';
let item_id = '';

execute = (server, chai, expect, should) => {
    describe("AUTHENTICATE user endpoint for item endpoints", () => {
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

    describe("POST item endpoint", () => {
        it("It should successfully add a new item", (done) => {
            const item = {
                name: "iPhone 7",
                brand: "Apple"
            };

            chai.request(server)
                .post("/items/item")
                .set('auth-token', auth_token)
                .send(item)
                .end((error, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.item.should.have.property('name').eq(item.name);
                    response.body.success.payload.item.should.have.property('brand').eq(item.brand);
                    item_id = response.body.success.payload.item['id'];
                    done();
                });
        });

        it("It should not successfully add a new item - null property", (done) => {
            const item = {
                name: '',
                brand: 'Samsung Electronics'
            };

            chai.request(server)
            .post("/items/item")
            .set('auth-token', auth_token)
            .send(item)
            .end((error, response) => {
                response.should.have.status(400);
                done();
            });
        });

        it("It should not successfully add a new item - invalid token", (done) => {
            const item = {
                name: 'Samsung Galaxy ZFlip 3',
                brand: 'Samsung Electronics'
            };

            chai.request(server)
            .post("/items/item")
            .set('auth-token', invalid_auth_token)
            .send(item)
            .end((error, response) => {
                response.should.have.status(401);
                done();
            });
        })
    });

    describe("GET All items endpoint", () => {
        it("It should successfully return all items", (done) => {
            chai.request(server)
                .get("/items/item/all")
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

        it("It should not successfully return all items", (done) => {
            chai.request(server)
                .get("/items/item/all")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                });
        });
    });

    describe("GET item by ID", () => {
        it("It should successfully return the item with that ID", (done) => {
            chai.request(server)
                .get("/items/item/" + item_id)
                .set('auth-token', auth_token)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('success');
                    response.body.success.should.have.property('status');
                    response.body.success.should.have.property('payload');
                    response.body.success.payload.should.have.property('name').eq('iPhone 7');
                    done();
                })
        });

        it("It should not successfully return an item with that ID", (done) => {
            chai.request(server)
                .get("/items/item/" + 2098787)
                .set('auth-token', auth_token)
                .end((error, response) => {
                    response.should.have.status(400);
                    done();
                });
        });
    });

    describe("GET item by brand", () => {
        it("It should successfully return items for that brand", (done) => {
            let brand = { brand: 'Samsung Electronics'};

            chai.request(server)
                .get("/items/brand")
                .set('auth-token', auth_token)
                .send(brand)
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

        it("It should not successfully return items for that brand", (done) => {
            let brand = { brand: 'Oppo'};

            chai.request(server)
                .get("/items/brand")
                .set('auth-token', auth_token)
                .send(brand)
                .end((error, response) => {
                    response.should.have.status(400);
                    done();
                })
        });
    });

    describe("GET all brands", () => {
        it("It should return all brands", (done) => {
            chai.request(server)
                .get("/items/brand/all")
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

        it("It should not successfully return items for that brand", (done) => {
            chai.request(server)
                .get("/items/brand/all")
                .set('auth-token', invalid_auth_token)
                .end((error, response) => {
                    response.should.have.status(401);
                    done();
                })
        });
    });
}

module.exports = { execute }