const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const healthRoutes = require('./healthRoutes');
const fileRoutes = require('./fileRoutes');
const aiRoutes = require('./aiRoutes');
const dataRoutes = require('./dataRoutes');

const router = express.Router();

const env = require('../config/env');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/files', fileRoutes);
router.use('/health', healthRoutes);
router.use('/payments', require('./paymentRoutes'));
router.use('/payment', require('./paymentRoutes'));
router.use('/data', dataRoutes);
router.use('/', aiRoutes);

router.get('/config', (req, res) => {
    res.json({
        GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID || ''
    });
});

module.exports = router;
