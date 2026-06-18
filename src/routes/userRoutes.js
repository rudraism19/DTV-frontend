const express = require('express');
const Joi = require('joi');
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const cacheResponse = require('../middlewares/cache');
const env = require('../config/env');

const router = express.Router();

const listSchema = Joi.object({
  query: Joi.object({
    limit: Joi.number().min(1).max(100).optional(),
    offset: Joi.number().min(0).optional(),
    search: Joi.string().max(100).allow('').optional()
  }).optional()
});

const roleSchema = Joi.object({
  body: Joi.object({
    role: Joi.string().valid('admin', 'user').required()
  }).required(),
  params: Joi.object({
    id: Joi.string().uuid().required()
  }).required()
});

const statusSchema = Joi.object({
  body: Joi.object({
    isActive: Joi.boolean().required()
  }).required(),
  params: Joi.object({
    id: Joi.string().uuid().required()
  }).required()
});

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List users (admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list
 */
router.get('/', authenticate, authorize('admin'), validate(listSchema), cacheResponse(env.CACHE_TTL_SECONDS), userController.listUsers);

/**
 * @openapi
 * /users/{id}/role:
 *   patch:
 *     summary: Update user role (admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user
 */
router.patch('/:id/role', authenticate, authorize('admin'), validate(roleSchema), userController.updateRole);

/**
 * @openapi
 * /users/{id}/status:
 *   patch:
 *     summary: Update user active status (admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isActive]
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated user status
 */
router.patch('/:id/status', authenticate, authorize('admin'), validate(statusSchema), userController.updateStatus);

module.exports = router;
