const db = require('../models');
const utility = require('./../utilities/utility');
const { validateReview } = require('./../utilities/validation');
const { Op } = require('sequelize');
const ApiKey = db.apiKey;
const Review = db.review;
const Item = db.item;
const User = db.user;
const _ = require('lodash');

addReview = async (req, res) => {
    const api_key = req.body.api_key;
    const now = new Date();

    const review = {
        reviewer: req.body.reviewer,
        rating: req.body.rating,
        description: req.body.description,
        date_added: new Date().toJSON(),
        item_id: req.body.item_id
    };

    try {
        if (!api_key) {
            throw new Error('No API Key provided.');
        }

        // get api key id
        const api_key_id = await ApiKey.findOne({ raw: true, attributes: ['id'], where: { key: api_key } });

        if (!api_key_id) {
            throw new Error('The provided API key does not exist or is disabled.');
        }

        review.api_key_id = api_key_id.id;

        const { error } = validateReview(review);
        if (error) {
            throw new Error(error.details[0].message);
        }

        let entry = await Review.create(review);

        if (!entry) {
            throw new Error('An error has occurred. Contact an administrator');
        }

        utility.formatSuccessResponse(res, 201, entry);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getReviews = async (req, res) => {
    const key = req.body.api_key;

    try {
        // get key and subsequent user_id
        let keyRow = await ApiKey.findOne({ raw: true, where: { key: key } });

        if (!keyRow) {
            throw new Error('No key found.');
        }

        let user_id = keyRow.user_id;

        const keys = await ApiKey.findAll({ raw: true, attributes: ['id'], where: { user_id: user_id } }).then((rows) => {
            return _.map(rows, (row) => {
                return row.id;
            })
        });

        if (!keys) {
            throw new Error('No keys found for this user.');
        }

        const reviews = await Review.findAll({ raw: true, where: { api_key_id: keys } });

        if (!reviews) {
            throw new Error('No reviews found for this user.');
        }

        utility.formatSuccessResponse(res, 200, reviews);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getReview = async (req, res) => {
    const id = req.params.id;

    try {
        if (!id) {
            throw new Error('Invalid review ID.');
        }

        const review = await Review.findOne({ plain: true, where: { id: id } });

        if (!review) {
            throw new Error('No review found with an ID of ' + id);
        }

        utility.formatSuccessResponse(res, 200, review);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getReviewsForProductById = async (req, res) => {
    const key = req.body.api_key;
    const id = req.params.id;

    try {
        if (!id) {
            throw new Error('No item ID provided.');
        }

        if (!key) {
            throw new Error('No API key provided');
        }

        // get key and subsequent user_id
        let keyRow = await ApiKey.findOne({ raw: true, where: { key: key } });

        if (!keyRow) {
            throw new Error('No key found.');
        }
        
        let user_id = keyRow.user_id;

        // get all API keys for user
        const keys = await ApiKey.findAll({ raw: true, attributes: ['id'], where: { user_id: user_id } }).then((rows) => {
            return _.map(rows, (row) => {
                return row.id;
            })
        });

        if (!keys) {
            throw new Error('No keys found for this user.');
        }

        const item = await Item.findOne({ raw: true, where: { id: id }});

        if (!item) {
            throw new Error('No items can be found with an ID of ' + id + ".");
        }

        let item_id = item.id;

        // get product reviews for this item using a valid API key
        const reviews = await Review.findAll({ raw: true, where: { api_key_id: keys, item_id: item_id }});

        if (!reviews) {
            throw new Error('No reviews found for this product and keys.');
        }

        utility.formatSuccessResponse(res, 200, reviews);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getGlobalReviewsForProductById = async (req, res) => {
    const key = req.body.api_key;
    const id = req.params.id;

    try {
        if (!id) {
            throw new Error('No item ID provided.');
        }

        if (!key) {
            throw new Error('No API key provided');
        }

        // check api key exists
        let keyRow = await ApiKey.findOne({ raw: true, where: { key: key } });

        if (!keyRow) {
            throw new Error('No key found.');
        }

        // if code reached, API key exists
        let reviews = await Review.findAll({ raw: true, where: { item_id: id }});

        if (!reviews || reviews.length <= 0) {
            throw new Error('No reviews found for this item.');
        }

        let organisations = await User.findAll({ raw: true });
        let apiKeys = await ApiKey.findAll({ raw: true });

        let payload = [];

        reviews.forEach(r => {
            let reviewObj = {
                rating: '',
                description: '',
                date_added: '',
                organisation: ''
            };

            reviewObj.rating = r.rating;
            reviewObj.description = r.rating;
            reviewObj.date_added = r.date_added;

            let api_key_id = r.api_key_id;
            apiKeys.forEach(a => {
                if (a.id == api_key_id) {
                    organisations.forEach(o => {
                        if (a.user_id == o.id) {
                            reviewObj.organisation = o.organisation;
                        }
                    });
                }
            });

            payload.push(reviewObj);
        });

        utility.formatSuccessResponse(res, 200, payload);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getReviewsForProductByName = async (req, res) => {
    // pass in API key
    const key = req.body.api_key;
    const name = req.body.name;

    try {
        if (!name) {
            throw new Error('No name provided.')
        }

        // get key and subsequent user_id
        let keyRow = await ApiKey.findOne({ plain: true, where: { key: key } });

        if (!keyRow) {
            throw new Error('No key found.');
        }

        let user_id = keyRow.user_id;

        // get all API keys for user
        const keys = await ApiKey.findAll({ raw: true, attributes: ['id'], where: { user_id: user_id } }).then((rows) => {
            return _.map(rows, (row) => {
                return row.id;
            })
        });

        if (!keys) {
            throw new Error('No keys found for this user.');
        }

        // get item from description
        let item = await Item.findOne({
            plain: true,
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        });

        if (!item) {
            throw new Error('No item found with this name.');
        }

        // get item id
        let item_id = item.id;

        // get reviews from item id and api keys
        let reviews = await Review.findAll({ where: { item_id: item_id, api_key_id: keys } });

        if (!reviews || reviews.length <= 0) {
            throw new Error('No reviews found for this product and keys.');
        }

        utility.formatSuccessResponse(res, 200, reviews);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getGlobalReviewsForProductByName = async (req, res) => {
    const key = req.body.api_key;
    const name = req.body.name;

    try {
        if (!name) {
            throw new Error('No name provided.')
        }

        // get key and subsequent user_id
        let keyRow = await ApiKey.findOne({ plain: true, where: { key: key } });

        if (!keyRow) {
            throw new Error('No key found.');
        }

        // if past this point, key exists.
        // get item from name
        let item = await Item.findOne({
            plain: true,
            where: {
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        });

        if (!item) {
            throw new Error('No item found with this name.');
        }

        // get item id
        let item_id = item.id;

        let reviews = await Review.findAll({ where: { item_id: item_id }});

        if (!reviews || reviews.length <= 0) {
            throw new Error('No reviews exist for this product.');
        }

        let organisations = await User.findAll({ raw: true });
        let apiKeys = await ApiKey.findAll({ raw: true });

        let payload = [];

        reviews.forEach(r => {
            let reviewObj = {
                rating: '',
                description: '',
                date_added: '',
                organisation: ''
            };

            reviewObj.rating = r.rating;
            reviewObj.description = r.rating;
            reviewObj.date_added = r.date_added;

            let api_key_id = r.api_key_id;
            apiKeys.forEach(a => {
                if (a.id == api_key_id) {
                    organisations.forEach(o => {
                        if (a.user_id == o.id) {
                            reviewObj.organisation = o.organisation;
                        }
                    });
                }
            });

            payload.push(reviewObj);
        });

        utility.formatSuccessResponse(res, 200, payload);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

updateReview = async (req, res) => {
    const id = req.body.id;
    const api_key = req.body.api_key;

    const review = {
        reviewer: req.body.reviewer,
        rating: req.body.rating,
        description: req.body.description,
        date_added: new Date().toJSON(),
        item_id: req.body.item_id
    };

    try {
        if (!id) {
            throw new Error('No review ID specified.')
        }

        if (!api_key) {
            throw new Error('No API key provided.');
        }

        const api_key_id = await ApiKey.findOne({ raw: true, attributes: ['id'], where: { key: api_key } });

        if (!api_key_id) {
            throw new Error('The provided API key does not exist.');
        }

        review.api_key_id = api_key_id.id;

        const { error } = validateReview(review);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // get user_id
        const key = await ApiKey.findOne({ raw: true, where: { key: api_key } });

        let user_id = key.user_id;

        // get keys
        const keys = await ApiKey.findAll({ raw: true, attributes: ['id'], where: { user_id: user_id } }).then((rows) => {
            return _.map(rows, (row) => {
                return row.id;
            })
        });

        // check if current api key is from the same user as the one submitted
        if (!keys.includes(review.api_key_id)) {
            throw new Error('The provided API Key cannot access this review.');
        }

        // update fields
        let reviewObj = await Review.findOne({ where: { id: id } });

        if (!reviewObj) {
            throw new Error('No review exists with an ID of ' + id + ".");
        }

        reviewObj.reviewer = review.reviewer;
        reviewObj.rating = review.rating;
        reviewObj.description = review.description;
        reviewObj.date_added = review.date_added;
        reviewObj.api_key_id = review.api_key_id;
        reviewObj.item_id = review.item_id;

        // save
        await reviewObj.save();

        utility.formatSuccessResponse(res, 200, reviewObj);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

deleteReview = async (req, res) => {
    const id = req.body.id;
    const api_key = req.body.api_key;

    try {
        // get user_id from key
        const user_id = await ApiKey.findOne({ raw: true, attributes: ['user_id'], where: { key: api_key } });

        if (!user_id) {
            throw new Error('No user can be associated to the provided key.');
        }

        // get keys
        const keys = await ApiKey.findAll({ raw: true, attributes: ['id'], where: { user_id: user_id.user_id } }).then((rows) => {
            return _.map(rows, (row) => {
                return row.id;
            })
        });

        if (!keys) {
            throw new Error('No keys can be found for this user.');
        }

        // get review in question
        const review = await Review.findOne({ raw: true, where: { id: id, api_key_id: keys } });

        if (!review) {
            throw new Error('No review exists with this criteria.');
        }

        await Review.destroy({ where: { id: review.id } });

        utility.formatSuccessResponse(res, 201, review.id);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

module.exports = { addReview, getReviews, getReview, getReviewsForProductByName, getReviewsForProductById, updateReview, deleteReview, getGlobalReviewsForProductById, getGlobalReviewsForProductByName }