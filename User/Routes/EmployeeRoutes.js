import express from 'express';
import employeeController from '../Controllers/EmployeeController.js';
import tokenVerify from '../../Admin/Middleware/tokenVerify.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Manage employees and related uploads
 */

/**
 * @swagger
 * /employee/getAllEmployees:
 *   get:
 *     summary: Retrieve all employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: Employees retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/getAllEmployees', tokenVerify, employeeController.getAllEmployees);

/**
 * @swagger
 * /employee/getEmployeeById:
 *   get:
 *     summary: Retrieve an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID to retrieve documents for
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.get('/getEmployeeById', tokenVerify, employeeController.getEmployeeById);

/**
 * @swagger
 * /employee/createEmployee:
 *   post:
 *     summary: Create a new employee with documents
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phoneNumber
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               uan:
 *                 type: string
 *               remark:
 *                 type: string
 *               aadhaar:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               pan:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               bank:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               additional:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       500:
 *         description: Server error
 */
router.post('/createEmployee', employeeController.createEmployee);

/**
 * @swagger
 * /employee/updateEmployee:
 *   put:
 *     summary: Update employee details
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               uan:
 *                 type: string
 *               remark:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.put('/updateEmployee', tokenVerify, employeeController.updateEmployee);

/**
 * @swagger
 * /employee/deleteEmployee:
 *   delete:
 *     summary: Delete an employee
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID to delete   
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteEmployee', tokenVerify, employeeController.deleteEmployee);

export default router;

