import express from 'express';
import authController from '../Controllers/authController.js';

const router = express.Router();


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login as an admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the admin
 *               password:
 *                 type: string
 *                 description: Password of the admin
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout as an admin
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Admin logged out successfully
 *       500:
 *         description: Server error
 */
router.post('/logout', authController.logout);

export default router;