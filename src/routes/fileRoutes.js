const express = require('express');
const multer = require('multer');
const Joi = require('joi');
const fileController = require('../controllers/fileController');
const validate = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const fileIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required()
  }).required()
});

/**
 * @openapi
 * /files/upload:
 *   post:
 *     summary: Upload a file
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded
 */
router.post('/upload', authenticate, upload.single('file'), fileController.upload);

/**
 * @openapi
 * /files/{id}:
 *   get:
 *     summary: Get file metadata
 *     tags:
 *       - Files
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File metadata
 */
router.get('/:id', authenticate, validate(fileIdSchema), fileController.getById);

module.exports = router;
