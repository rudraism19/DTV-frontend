const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

// Protected dashboard - admin only
router.get('/', authenticate, authorize('admin'), dashboardController.index);

module.exports = router;
