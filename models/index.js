const Sequelize = require('sequelize');
const User = require('./user');
const ApiKey = require('./apiKey');
const Item = require('./item');
const Review = require('./review');
const Subscription = require('./subscription');
const dotenv = require('dotenv').config();
const config = require('config');

const sequelize = new Sequelize(
    config.get('database.db_name'),
    config.get('database.uid'),
    config.get('database.pass'), {
        host: config.get('database.host'),
        dialect: config.get('database.dialect'),
        port: config.get('database.port')
    });

sequelize.authenticate()
    .then(() => {
        console.log('Connection established');
    })
    .catch(e => {
        console.error('Unable to form connection: ', e)
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = User(sequelize, Sequelize);
db.apiKey = ApiKey(sequelize, Sequelize, db.user);
db.subscription = Subscription(sequelize, Sequelize, db.user);

db.item = Item(sequelize, Sequelize);

db.review = Review(sequelize, Sequelize, db.apiKey, db.item);

module.exports = db;