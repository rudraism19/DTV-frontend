const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middlewares/auth');

router.post('/create', authenticate, paymentController.createOrder);
router.post('/verify', authenticate, paymentController.verifyPayment);

module.exports = router;
