const express = require('express');
const router = express.Router();
const multer = require('multer');
const paymentController = require('../controllers/paymentController');
const { authenticate, authenticateOptional } = require('../middlewares/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

const uploadSingle = (req, res, next) => {
  upload.single('proof_file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      req.file = null; // Continue gracefully even if multer fails
    }
    next();
  });
};

router.post('/create', authenticate, paymentController.createOrder);
router.post('/verify', authenticate, paymentController.verifyPayment);
router.post('/verify-proof', authenticateOptional, uploadSingle, paymentController.verifyPaymentProof);

module.exports = router;
