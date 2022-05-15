const Sequelize = require('sequelize');
const User = require('./user');
const ApiKey = require('./apiKey');
const Item = require('./item');
const Review = require('./review');
const Subscription = require('./subscription');
const dotenv = require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_UID,
    process.env.DB_PASS, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT
    }
);

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