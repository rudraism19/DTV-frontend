const express = require('express');
const router = express.Router();
const multer = require('multer');
const paymentController = require('../controllers/paymentController');
const { authenticate, authenticateOptional } = require('../middlewares/auth');

const rateLimit = require('express-rate-limit');

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'SECURITY ALERT: Too many payment attempts from this IP. Please try again later.' }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('SECURITY ALERT: Invalid file type detected. Only JPG, PNG, WEBP, and PDF files are allowed.'), false);
    }
  }
});

const uploadSingle = (req, res, next) => {
  upload.single('proof_file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ success: false, message: err.message || 'File upload error.' });
    }
    next();
  });
};

router.post('/create', authenticate, paymentLimiter, paymentController.createOrder);
router.post('/verify', authenticate, paymentLimiter, paymentController.verifyPayment);
router.post('/verify-proof', authenticateOptional, paymentLimiter, uploadSingle, paymentController.verifyPaymentProof);

module.exports = router;
