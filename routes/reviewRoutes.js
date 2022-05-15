const controller = require('../controllers/reviews');
const auth = require('../middleware/auth')
var express = require('express');
var router = express.Router();

router.post('/add', controller.addReview);
router.get('/all', controller.getReviews);
router.get('/local/item/name', controller.getReviewsForProductByName);
router.get('/local/item/:id', controller.getReviewsForProductById);
router.get('/global/item/name', controller.getGlobalReviewsForProductByName);
router.get('/global/item/:id', controller.getGlobalReviewsForProductById);
router.get('/:id', controller.getReview);
router.put('/', controller.updateReview);
router.delete('/', controller.deleteReview);

module.exports = router;