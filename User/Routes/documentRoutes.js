import express from 'express';
import documentController from '../Controllers/documentController.js';
import tokenVerify from '../../Admin/Middleware/tokenVerify.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Manage employee documents
 */

/**
 * @swagger
 * /document/getDocumentsByEmployeeId:
 *   get:
 *     summary: Get document by Employee ID
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.get('/getDocumentsByEmployeeId', documentController.getDocumentsByEmployeeId);


/**
 * @swagger
 * /document/createDocument:
 *   post:
 *     summary: Create a new document
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
 *               documentType:
 *                 type: string
 *                 description: Type/category of the document
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Document created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.post('/createDocument', documentController.createDocument);

/**
 * @swagger
 * /document/updateDocument:
 *   put:
 *     summary: Update a document
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documentType:
 *                 type: string
 *                 description: New document type/category
 *     responses:
 *       200:
 *         description: Document updated successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.put('/updateDocument', documentController.updateDocument);

/**
 * @swagger
 * /document/deleteDocument:
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID to delete
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteDocument', documentController.deleteDocument);

/**
 * @swagger
 * /document/downloadDocumentsByEmployeeId:
 *   get:
 *     summary: Download documents by employee ID
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Employee ID to download documents for
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *           enum: [zip]
 *         description: Format to download documents in (zip)
 *         default: zip
 *     responses:
 *       200:
 *         description: Document downloaded successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.get('/downloadDocumentsByEmployeeId', documentController.downloadDocumentsByEmployeeId);

/**
 * @swagger
 * /document/downloadAllDocuments:
 *   get:
 *     summary: Download all documents for all employees (Admin only)
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All documents downloaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *       401:
 *         description: Unauthorized - Admin authentication required
 *       500:
 *         description: Server error
 */
router.get('/downloadAllDocuments', documentController.downloadAllDocuments);

export default router;
