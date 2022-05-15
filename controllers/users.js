const db = require("../models");
const { validateUser, validateAPIKey, validateSubscription } = require('../utilities/validation');
const utility = require('../utilities/utility');
const security = require('../utilities/security');
const { Op } = require('sequelize');
const User = db.user;
const ApiKey = db.apiKey;
const Subscription = db.subscription;

register = async (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        organisation: req.body.organisation,
        card_num: req.body.card_num,
        card_expiry: req.body.card_expiry,
        card_cvv: req.body.card_cvv,
    };

    // These fields are optional
    if ( user.card_num == null || user.card_expiry == null || user.card_cvv == null) {
        user.card_num = "";
        user.card_expiry = "";
        user.card_cvv = "";
    }

    try {
        const { error } = validateUser(user);
        if (error) {
            throw new Error(error.details[0].message);
        }

        let savedUser = '';

        // hash password
        user.password = await security.hash(user.password);

        await User.create(user)
            .then((response) => {
                savedUser = response;
            });

        if (savedUser) {
            utility.formatSuccessResponse(res, 201, savedUser);
        }
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message)
    }
};

authenticate = async (req, res) => {
    const login = {
        uid: req.body.uid,
        password: req.body.password
    }

    try {
        const { error } = validateLogin(login);
        if (error) {
            throw new Error(error.details[0].message)
        }

        let result = '';

        // find a user with valid credentials
        await User.findOne({
            raw: true,
            where: {
                [Op.or]: [{ username: login.uid }, { email: login.uid }]
            }}).then((response) => {
                result = response;
            });

        if (result) {
            if (!result.id) {
                throw new Error('Invalid uid or password');
            }

            if (!await security.compare(login.password, result.password)) {
                throw new Error('Invalid uid or password');
            }
    
            // JWT object
            const token = await security.sign(result);
    
            // send basic object with token
            res.header('Auth-Token', token);

            let payload = {
                username: result.username,
                organisation: result.organisation
            }

            utility.formatSuccessResponse(res, 200, payload);
        }
        else {
            throw new Error('Invalid UID or password')
        }
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message)
    }
};

getUser = async (req, res) => {
    const user_id = res.locals.id;
    let user = {
        username: '',
        email: '',
        organisation: '',
        card_num: '',
        card_expiry: '',
        card_cvv: ''
    }

    try {
        const row = await User.findOne({ where: { id: user_id }});

        if (!row) {
            throw new Error('No user found with the provided ID.')
        }

        user.username = row.username;
        user.email = row.email;
        user.organisation = row.organisation;
        user.card_num = row.card_num;
        user.card_expiry = row.card_expiry;
        user.card_cvv = row.card_cvv;

        utility.formatSuccessResponse(res, 200, user);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message)
    }
}

generateKey = async (req, res) => {
    const user_id = res.locals.id;
    const date = new Date().toJSON().slice(0, 10);
    const key = await generateRandomString(50);

    const entry = {
        key: key,
        date_generated: date,
        enabled: true,
        user_id: user_id
    };

    try {
        const { error } = validateAPIKey(entry);
        if (error) {
            throw new Error(error.details[0].message);
        }

        while (true) {
            let result = '';
            await ApiKey.findOne({ raw: true, where: { key: entry.key }}).then((response) => {
                result = response;
            });

            if (!result) {
                break;
            }
        }

        let result = '';

        await ApiKey.create(entry).then((response) => {
            result = response;
        });

        if (result) {
            utility.formatSuccessResponse(res, 201, result);
        }
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message)
    }
}

generateRandomString = async (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_$-';
    let charLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charLength));
    }

    return result;
}

getKeys = async (req, res) => {
    const user_id = res.locals.id;
    
    const keys = await returnAllKeys(user_id);
    utility.formatSuccessResponse(res, 201, keys);
}

returnAllKeys = async (user_id) => {
    return await ApiKey.findAll({ raw: true, where: { user_id: user_id }});
}

// change to toggle key
toggleKey = async (req, res) => {
    const user_id = res.locals.id;
    const api_key_id = req.params.id;

    try {
        const key = await ApiKey.findOne({ where: {
            [Op.and]: [
                { id: api_key_id },
                { user_id: user_id }
            ]
        }});
    
        if (key) {
            key.enabled = !key.enabled;
            await key.save();

            utility.formatSuccessResponse(res, 201, key);
        }
        else {
            throw new Error('Invalid API key');
        }
    }
    catch (e) {
        utility.formatErrorResponse(res, 404, e.message)
    }
}

deleteKeys = async (req, res) => {
    const user_id = res.locals.id;
    const api_key_ids = req.body.api_key_ids;

    try {
        if (api_key_ids == null) {
            throw new Error('No API keys provided')
        }

        let result = '';

        await ApiKey.destroy({ where: { id: api_key_ids }}).then((response) => {
            result = response;
        });

        if (result) {
            utility.formatSuccessResponse(res, 200, 'API keys deleted.');
        }
        else {
            throw new Error('An error has occurred.');
        }
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

addSubscription = async (req, res) => {
    const user_id = res.locals.id;
    const date_started = new Date().toJSON().slice(0, 10);

    const subscription = {
        interval: req.body.interval,
        active: true,
        date_started: date_started,
        user_id: user_id
    };

    try {
        const { error } = validateSubscription(subscription);
        if (error) {
            throw new Error(error.details[0].message);
        }

        let exists = '';
        await Subscription.findOne({ raw: true, where: { active: subscription.active, user_id: user_id }}).then((response) => {
            exists = response;
        });

        if (exists) {
            throw new Error('You already have an active subscription.');
        }

        let result = '';
        await Subscription.create(subscription).then((response) => {
            result = response;
        });

        utility.formatSuccessResponse(res, 201, result);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

returnSubscriptions = async (req, res) => {
    const user_id = res.locals.id;

    let subscriptions = '';

    try {
        await Subscription.findAll({ raw: true, where: { user_id: user_id }}).then((response) => {
            subscriptions = response;
        });

        if (!subscriptions) {
            throw new Error('No subscriptions available');
        }
        
        utility.formatSuccessResponse(res, 200, subscriptions);
    }
    catch (e) {
        utility.formatErrorResponse(res, 404, e.message);
    }
}

returnActiveSubscription = async (req, res) => {
    const user_id = res.locals.id;

    try {
        let active_subscriptions = '';

        await Subscription.findAll({ raw: true, where: {
            user_id: user_id,
            active: true
        }}).then((response) => {
            active_subscriptions = response;
        });

        if (!active_subscriptions) {
            throw new Error('No active subscriptions found');
        }

        utility.formatSuccessResponse(res, 200, active_subscriptions);
    }
    catch (e) {
        utility.formatErrorResponse(res, 404, e.message)
    }
}

cancelSubscription = async (req, res) => {
    const user_id = res.locals.id;
    const subscription_id = req.params.id;

    try {
        if (subscription_id == null) {
            throw new Error('Invalid subscription ID.');
        }

        const subscription = await Subscription.findOne({ where: {
            user_id: user_id,
            id: subscription_id,
            active: true
        }});

        if (!subscription) {
            throw new Error('The provided ID is not valid or does not match an active subscription.');
        }

        subscription.date_ended = new Date().toJSON().slice(0, 10);
        subscription.active = false;
        await subscription.save();

        utility.formatSuccessResponse(res, 200, subscription);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

module.exports = { register, authenticate, getUser, generateKey, getKeys, deleteKeys, addSubscription, returnSubscriptions, returnActiveSubscription, cancelSubscription, toggleKey, returnAllKeys };