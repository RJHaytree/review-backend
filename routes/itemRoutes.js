const controller = require('../controllers/items');
const auth = require('../middleware/auth')
var express = require('express');
var router = express.Router();

router.post('/item', auth, controller.addItem);
router.get('/item/all', auth, controller.getAllItems);
router.get('/item/:id', auth, controller.getItem);
router.get('/brand', auth, controller.getItemsByBrand);
router.get('/brand/all', auth, controller.getBrands);

module.exports = router;