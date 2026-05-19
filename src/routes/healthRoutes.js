const express = require('express');
const healthController = require('../controllers/healthController');

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Service health check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Health status
 */
router.get('/', healthController.health);

module.exports = router;
