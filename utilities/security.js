const brycpt = require('bcrypt');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const utility = require('./utility');

hash = async (password) => {
    let salt = await brycpt.genSalt(10);
    let hashedPassword = await brycpt.hash(password, salt);

    return hashedPassword;
}

compare = async (password, hashed) => {
    return await brycpt.compare(password, hashed);
}

sign = async (user) => {
    const object = {
        _id: user.id,
        issued: new Date().toLocaleString()
    };

    return jwt.sign(object, process.env.TOKEN_SECRET, { expiresIn: '1d'});
}

verify = async (token) => {
    let decodedToken = '';

    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
        decodedToken = decoded;
    });

    return decodedToken;
}

logout = async (token) => {
    // unsure of how to do this.
}

compareKey = async (res, api_key, ApiKey) => {
    let key = '';

    try {
        await ApiKey.findOne({ where: { key: api_key }}).then((response) => {
            key = response;
        });

        if (key) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

module.exports = { hash, compare, sign, verify, logout, compareKey }