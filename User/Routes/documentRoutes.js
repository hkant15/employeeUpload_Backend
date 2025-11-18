import express from 'express';
import documentController from '../Controllers/documentController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Manage employee documents
 */

/**
 * @swagger
 * /documents/upload:
 *   post:
 *     summary: Upload a document for an employee
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - file
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: Employee ID the document belongs to
 *               description:
 *                 type: string
 *                 nullable: true
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: Validation error (missing employee or file)
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.post('/upload', documentController.uploadDocument);

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: List documents for an employee
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID to filter documents
 *     responses:
 *       200:
 *         description: Documents retrieved successfully
 *       400:
 *         description: Employee ID missing
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.get('/',
  documentController.getEmployeeDocuments
);

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Get document details by ID
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.get('/:id',
  documentController.getDocumentById
);

export default router;
