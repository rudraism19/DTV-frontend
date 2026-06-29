const express = require('express');
const { authenticate, authorizeParentOfStudent, authorizeAdmin } = require('../middlewares/auth');
const parentController = require('../controllers/parentController');

const router = express.Router();

router.use(authenticate);

// Real-Time SSE Live Stream
router.get('/live-stream', parentController.subscribeLiveStream);

// Parent Dashboards
router.get('/dashboard', parentController.getDashboard);

// Specific Student Data (uses authorizeParentOfStudent to check links)
router.get('/student/:studentId', authorizeParentOfStudent, parentController.getStudentDetails);
router.get('/student/:studentId/report', authorizeParentOfStudent, parentController.generateReport);

// Admin Management Dashboard with Pagination, Sorting, Filtering
router.get('/admin/dashboard', authorizeAdmin, parentController.getAdminDashboard);

module.exports = router;
