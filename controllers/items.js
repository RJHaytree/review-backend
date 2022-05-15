const db = require('../models');
const utility = require('./../utilities/utility');
const { validateItem } = require ('./../utilities/validation');
const sequelize = db.sequelize;
const Sequelize = db.Sequelize;
const Item = db.item;
const { Op } = require('sequelize');

addItem = async (req, res) => {
    const item = {
        name: req.body.name,
        brand: req.body.brand
    };

    try {
        const { error } = validateItem(item);
        if (error) {
            throw new Error(error.details[0].message);
        }

        let result = '';
        await Item.create(item).then((response) => {
            result = response;
        });

        if (result) {
            let payload = {
                message: "Item registered successfully",
                item: result
            };

            utility.formatSuccessResponse(res, 201, payload);
        }
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getItem = async (req, res) => {
    const id = req.params.id;

    try {
        let item = await Item.findOne({ raw: true, where: { id: id }});

        if (!item) {
            throw new Error('No item exists with an ID of ' + id);
        }

        utility.formatSuccessResponse(res, 200, item);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getAllItems = async (req, res) => {
    try {
        let items = await Item.findAll({ raw: true });

        if (!items || items.length == 0) {
            throw new Error('No items returned. Contact an administrator.');
        }

        utility.formatSuccessResponse(res, 200, items);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getItemsByBrand = async (req, res) => {
    const brand = req.body.brand;

    try {
        if (!brand) {
            throw new Error('Please provide a brand.');
        }

        let items = await Item.findAll({ raw: true, where: { brand: { [Op.like]: `%${brand}%` } }});

        if (!items || items.length <= 0) {
            throw new Error('No items for from ' + brand + ' exist.')
        }

        utility.formatSuccessResponse(res, 200, items);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

getBrands = async (req, res) => {
    try {
        let brands = await Item.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']
            ]
        });

        if (!brands || brands.length == 0) {
            throw new Error('No brands returned. Contact an administrator');
        }

        utility.formatSuccessResponse(res, 200, brands);
    }
    catch (e) {
        utility.formatErrorResponse(res, 400, e.message);
    }
}

module.exports = { addItem, getItem, getAllItems, getItemsByBrand, getBrands }