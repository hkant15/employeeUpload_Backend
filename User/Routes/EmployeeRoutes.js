import express from 'express';
import employeeController from '../Controllers/EmployeeController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Manage employees and related uploads
 */

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Retrieve all employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: Employees retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/', employeeController.getAllEmployees);

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Retrieve a single employee
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.get('/:id', employeeController.getEmployeeById);

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               location:
 *                 type: string
 *               driveFolderId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       500:
 *         description: Server error
 */
router.post('/', employeeController.createEmployee);

/**
 * @swagger
 * /employees/upload:
 *   post:
 *     summary: Upload a file related to an employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server error
 */
router.post('/upload', employeeController.uploadEmployeeFile);

export default router;

