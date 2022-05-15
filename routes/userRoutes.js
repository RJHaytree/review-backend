const controller = require('../controllers/users');
var express = require('express');
var router = express.Router();
const auth = require('../middleware/auth');

// setup routes - auth
router.post('/register', controller.register);
router.post('/auth', controller.authenticate);
router.get('/get', auth, controller.getUser);

// key routes
router.post('/keys/new', auth, controller.generateKey);
router.get('/keys/all', auth, controller.getKeys);
router.put('/keys/:id', auth, controller.toggleKey);
router.delete('/keys', auth, controller.deleteKeys);

// subscription routes
router.post('/subscription/add', auth, controller.addSubscription);
router.get('/subscription/all', auth, controller.returnSubscriptions);
router.get('/subscription/active', auth, controller.returnActiveSubscription);
router.put('/subscription/cancel/:id', auth, controller.cancelSubscription);

module.exports = router;