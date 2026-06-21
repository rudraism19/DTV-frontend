const express = require('express');
const { authenticate, authorizeParentOfStudent } = require('../middlewares/auth');
const parentController = require('../controllers/parentController');

const router = express.Router();

router.use(authenticate);

// Dashboards
router.get('/dashboard', parentController.getDashboard);

// Specific Student Data (uses authorizeParentOfStudent to check links)
router.get('/student/:studentId', authorizeParentOfStudent, parentController.getStudentDetails);
router.get('/student/:studentId/report', authorizeParentOfStudent, parentController.generateReport);

module.exports = router;
