const express = require('express');
const dataController = require('../controllers/dataController');
const { authenticate, authorizeParentOfStudent } = require('../middlewares/auth');

const router = express.Router();

// Student (or any user) getting and saving their own data
router.get('/me', authenticate, dataController.getMyData);
router.put('/me', authenticate, dataController.saveMyData);

// Parent viewing their student's data
router.get('/students/:studentId', authenticate, authorizeParentOfStudent, dataController.getStudentData);

module.exports = router;
