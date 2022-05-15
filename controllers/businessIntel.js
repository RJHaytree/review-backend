const db = require('../models');
const utility = require('./../utilities/utility');
const { Op } = require('sequelize');
const ApiKey = db.apiKey;
const Review = db.review;
const Item = db.item;
const User = db.user;
const _ = require('lodash');
const Sequelize = db.Sequelize;
const moment = require('moment');

getListProductsByLowestReviewsLocal = async (req, res) => {
    const user_id = res.locals.id;

    try {
        // return all api keys
        const keys = await ApiKey.findAll({ raw: true, attributes: ['id'], where: { user_id: user_id } }).then((rows) => {
            return _.map(rows, (row) => {
                return row.id;
            })
        });

        // return all reviws with item row 
        const reviews = await Review.findAll({ raw: true, where: { api_key_id: keys }});

        // get list of unique item_ids
        const item_ids = [];
        reviews.forEach(review => {
            if (!item_ids.includes(review.item_id)) {
                item_ids.push(review.item_id)
            }
        })

        const items = await Item.findAll({ raw: true, where: { id: item_ids }});

        // Add reviews to item
        items.forEach(item => {
            let average_rating = 0;
            let itemReviews = reviews.filter(r => r.item_id == item.id);
            itemReviews.forEach(r => {
                average_rating += r.rating;
            });

            item.review_count = itemReviews.length;
            item.average_rating = Math.round((average_rating / item.review_count) * 100) / 100;
            item.reviews = itemReviews;
        });

        // needs testing to ensure it is ordering account to low rating
        items.sort((a, b) => a.average_rating - b.average_rating);
        
        utility.formatSuccessResponse(res, 200, items);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getListProductsByHighestReviewsLocal = async (req, res) => {
    const user_id = res.locals.id;

    try {
        // return all api keys
        const keys = await ApiKey.findAll({ raw: true, attributes: ['id'], where: { user_id: user_id } }).then((rows) => {
            return _.map(rows, (row) => {
                return row.id;
            })
        });

        // return all reviws with item row 
        const reviews = await Review.findAll({ raw: true, where: { api_key_id: keys }});

        // get list of unique item_ids
        const item_ids = [];
        reviews.forEach(review => {
            if (!item_ids.includes(review.item_id)) {
                item_ids.push(review.item_id)
            }
        })

        const items = await Item.findAll({ raw: true, where: { id: item_ids }});

        // Add reviews to item
        items.forEach(item => {
            let average_rating = 0;
            let itemReviews = reviews.filter(r => r.item_id == item.id);
            itemReviews.forEach(r => {
                average_rating += r.rating;
            });

            item.review_count = itemReviews.length;
            item.average_rating = Math.round((average_rating / item.review_count) * 100) / 100;
            item.reviews = itemReviews;
        });

        // needs testing to ensure it is ordering account to low rating
        items.sort((a, b) => b.average_rating - a.average_rating);
        
        utility.formatSuccessResponse(res, 200, items);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getListProductsHighestNumberOfReviews = async (req, res) => {
    const user_id = res.locals.id;

    try {
        // return all api keys
        const keys = await ApiKey.findAll({ raw: true, attributes: ['id'], where: { user_id: user_id } }).then((rows) => {
            return _.map(rows, (row) => {
                return row.id;
            })
        });

        // return all reviws with item row 
        const reviews = await Review.findAll({ raw: true, where: { api_key_id: keys }});

        // get list of unique item_ids
        const item_ids = [];
        reviews.forEach(review => {
            if (!item_ids.includes(review.item_id)) {
                item_ids.push(review.item_id)
            }
        })

        const items = await Item.findAll({ raw: true, where: { id: item_ids }});

        // Add reviews to item
        items.forEach(item => {
            let average_rating = 0;
            let itemReviews = reviews.filter(r => r.item_id == item.id);
            itemReviews.forEach(r => {
                average_rating += r.rating;
            });

            item.review_count = itemReviews.length;
            item.average_rating = Math.round((average_rating / item.review_count) * 100) / 100;
            item.reviews = itemReviews;
        });

        // needs testing to ensure it is ordering account to low rating
        items.sort((a, b) => b.review_count - a.review_count);
        
        utility.formatSuccessResponse(res, 200, items);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getListProductsLowestNumberOfReviews = async (req, res) => {
    const user_id = res.locals.id;

    try {
        // return all api keys
        const keys = await ApiKey.findAll({ raw: true, attributes: ['id'], where: { user_id: user_id } }).then((rows) => {
            return _.map(rows, (row) => {
                return row.id;
            })
        });

        // return all reviws with item row 
        const reviews = await Review.findAll({ raw: true, where: { api_key_id: keys }});

        // get list of unique item_ids
        const item_ids = [];
        reviews.forEach(review => {
            if (!item_ids.includes(review.item_id)) {
                item_ids.push(review.item_id)
            }
        })

        const items = await Item.findAll({ raw: true, where: { id: item_ids }});

        // Add reviews to item
        items.forEach(item => {
            let average_rating = 0;
            let itemReviews = reviews.filter(r => r.item_id == item.id);
            itemReviews.forEach(r => {
                average_rating += r.rating;
            });

            item.review_count = itemReviews.length;
            item.average_rating = Math.round((average_rating / item.review_count) * 100) / 100;
            item.reviews = itemReviews;
        });

        // needs testing to ensure it is ordering account to low rating
        items.sort((a, b) => a.review_count - b.review_count);
        
        utility.formatSuccessResponse(res, 200, items);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getRetailersByNumberOfReviews = async (req, res) => {
    const user_id = res.locals.id;
    let profile = {
        organisation: '',
        position: 0
    };

    try {
        // get all reviews + users 
        let reviews = await Review.findAll({
            nested: true,
            include: [{ 
                required: true, 
                model: ApiKey, 
                as: 'apiKey', 
                attributes: ['user_id'], 
                include: [{ 
                    required: true, 
                    model: User, 
                    as: 'user', 
                    attributes: ['organisation'] 
                }]
            }]
        });

        reviews = JSON.parse(JSON.stringify(reviews));

        // get list of organisations
        const orgs = await User.findAll({ raw: true, attributes: [Sequelize.fn('DISTINCT', Sequelize.col('organisation')), 'organisation', 'id']});
        
        let organisations = [];
        orgs.forEach(org => {
            if (!organisations.includes(org.organisation)) {
                organisations.push(org.organisation)
            }

            if (org.id === user_id) {
                profile.organisation = org.organisation
            }
        });

        let leaderboard = [];
        let position = 0;

        // add number of reviews to the organisation
        organisations.forEach(org => {
            position = position + 1;

            let entry = {
                position: position,
                organisation: org,
                count: 0
            };

            let r = reviews.filter(x => x.apiKey.user.organisation == org);

            if (r) {
                entry.count = r.length;
                leaderboard.push(entry);
            }
        });

        leaderboard.sort((a, b) => b.count - a.count);

        // get org's current position
        profile.position = leaderboard.map((l) => { return l.organisation }).indexOf(profile.organisation) + 1;

        // limit in length to ensure response isn't massive
        if (leaderboard.length >= 20) leaderboard.length = 19;

        // compound into response
        const response = {
            user: profile,
            leaderboard: leaderboard
        }

        utility.formatSuccessResponse(res, 200, response);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getListTopReviewedProductsGlobal = async (req, res) => {
    try {
        // get reviews + items
        let reviews = await Review.findAll({ 
            nested: true,
            attributes: ['item_id', 'rating', 'description'],
            include: [{
                required: true,
                model: Item,
                attributes: ['name', 'brand']
            }]
        });

        reviews = JSON.parse(JSON.stringify(reviews));

        let products = [];

        reviews.forEach(review => {
            let found = false;
            products.find(p => {
                if (p.name == review.item.name) {
                    found = true;
                }
            });

            if (!found) {
                products.push({ id: review.item_id, name: review.item.name, brand: review.item.brand, average_rating: 0, review_count: 0, reviews: [] } );
            }
        });

        products.forEach(p => {
            let temp = reviews.filter(r => r.item.name == p.name);
            p.review_count = temp.length;

            temp.forEach(t => {
                p.average_rating += t.rating;
                p.reviews.push(t)
            })

            p.average_rating = Math.round((p.average_rating / p.review_count) * 100) / 100;
        });

        products.sort((a, b) => b.average_rating - a.average_rating);

        utility.formatSuccessResponse(res, 200, products);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getListLowestReviewedProductsGlobal = async (req, res) => {
    try {
        // get reviews + items
        let reviews = await Review.findAll({ 
            nested: true,
            attributes: ['item_id', 'rating', 'description'],
            include: [{
                required: true,
                model: Item,
                attributes: ['name', 'brand']
            }]
        });

        reviews = JSON.parse(JSON.stringify(reviews));

        let products = [];

        reviews.forEach(review => {
            let found = false;
            products.find(p => {
                if (p.name == review.item.name) {
                    found = true;
                }
            });

            if (!found) {
                products.push({ id: review.item_id, name: review.item.name, brand: review.item.brand, average_rating: 0, review_count: 0, reviews: [] } );
            }
        });

        products.forEach(p => {
            let temp = reviews.filter(r => r.item.name == p.name);
            p.review_count = temp.length;

            temp.forEach(t => {
                p.average_rating += t.rating;
                p.reviews.push(t)
            });

            p.average_rating = Math.round((p.average_rating / p.review_count) * 100) / 100;
        });

        products.sort((a, b) => a.average_rating - b.average_rating);

        utility.formatSuccessResponse(res, 200, products);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getRecentReviews = async (req, res) => {
    let timeframe = req.body.timeframe;
    let time = '';
    
    try {
        if (timeframe == null) {
            timeframe = 'MONTH'
        }

        // establish intervals
        if (timeframe == 'DAY') time = moment().subtract(1, 'd').toDate();
        if (timeframe == 'WEEK') time = moment().subtract(7, 'd').toDate();
        if (timeframe == 'MONTH') time = moment().subtract(30, 'd').toDate();

        if (!time) {
            throw new Error('Invalid timeframe specified');
        }

        // get reviews
        const reviews = await Review.findAll({ 
            nested: true, 
            where: { 
                date_added: { 
                    [Op.gte]: time 
                }
            },
            attributes: ['id', 'reviewer', 'rating', 'description', 'date_added'],
            include: [{
                model: Item,
                attributes: ['id', 'name', 'brand']
            }]
        });

        const chartPayload = {
            labels: [],
            datasets: []
        };

        const labels = [...new Set(reviews.map(r => r.item.name))];
        chartPayload.labels = labels;

        labels.forEach(l => {
            let array = reviews.filter((r) => r.item.name == l);
            chartPayload.datasets.push(array.length);
        });

        const response = {
            reviews: reviews,
            chartData: chartPayload
        }

        // format for chart
        utility.formatSuccessResponse(res, 200, response)
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

module.exports = { getListProductsByLowestReviewsLocal, getListProductsByHighestReviewsLocal, getListProductsHighestNumberOfReviews, getListProductsLowestNumberOfReviews, getRetailersByNumberOfReviews, getListTopReviewedProductsGlobal, getListLowestReviewedProductsGlobal, getRecentReviews }