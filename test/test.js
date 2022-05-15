let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');

let userTest = require('./userTest');
let itemTest = require('./itemTest');
let reviewTest = require('./reviewTest');
let businessIntelTest = require('./businessIntelTest');

var expect = chai.expect;
var should = chai.should;

chai.use(chaiHttp);
chai.should();
chai.expect();

userTest.execute(server, chai, expect, should);
itemTest.execute(server, chai, expect, should);
reviewTest.execute(server, chai, expect, should);
businessIntelTest.execute(server, chai, expect, should);