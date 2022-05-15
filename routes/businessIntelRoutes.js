const controller = require('../controllers/businessIntel');
const auth = require('../middleware/auth')
var express = require('express');
var router = express.Router();

router.get('/lowest/avg/local', auth, controller.getListProductsByLowestReviewsLocal);
router.get('/highest/avg/local', auth, controller.getListProductsByHighestReviewsLocal);
router.get('/highest/count', auth, controller.getListProductsHighestNumberOfReviews);
router.get('/lowest/count', auth, controller.getListProductsLowestNumberOfReviews);
router.get('/leaderboard', auth, controller.getRetailersByNumberOfReviews);
router.get('/highest/avg/global', auth, controller.getListTopReviewedProductsGlobal);
router.get('/lowest/avg/global', auth, controller.getListLowestReviewedProductsGlobal);
router.post('/recent', auth, controller.getRecentReviews);

module.exports = router;