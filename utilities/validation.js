const Joi = require('@hapi/joi');

// Joi schemas with validation
const userSchema = Joi.object({
    username: Joi.string().min(1).max(100).required(),
    password: Joi.string().required(),
    email: Joi.string().min(1).max(100).required().email(),
    organisation: Joi.string().min(1).max(100).required(),
    card_num: Joi.string().allow(null, ''),
    card_expiry: Joi.string().allow(null, ''),
    card_cvv: Joi.string().allow(null, '')
});

const loginSchema = Joi.object({
    uid: Joi.string().required(),
    password: Joi.string().required()
});

const apiKeySchema = Joi.object({
    key: Joi.string().required(),
    date_generated: Joi.date().required(),
    enabled: Joi.bool().required(),
    user_id: Joi.number().required()
});

const itemSchema = Joi.object({
    name: Joi.string().required(),
    brand: Joi.string().required()
});

const reviewSchema = Joi.object({
    reviewer: Joi.string().required(),
    rating: Joi.number().required(),
    date_added: Joi.required(),
    description: Joi.string().required(),
    api_key_id: Joi.number().required(),
    item_id: Joi.required()
});

const subscriptionSchema = Joi.object({
    interval: Joi.string().required(),
    active: Joi.bool().required(),
    date_started: Joi.date().required(),
    date_ended: Joi.date().allow(null, ''),
    user_id: Joi.required()
});

// Validation methods
validateUser = (data) => {
    return userSchema.validate(data);
}

validateLogin = (data) => {
    return loginSchema.validate(data);
}

validateAPIKey = (data) => {
    return apiKeySchema.validate(data);
}

validateItem = (data) => {
    return itemSchema.validate(data);
}

validateReview = (data) => {
    return reviewSchema.validate(data)
}

validateSubscription = (data) => {
    return subscriptionSchema.validate(data);
}

module.exports = { validateUser, validateAPIKey, validateItem, validateReview, validateSubscription }