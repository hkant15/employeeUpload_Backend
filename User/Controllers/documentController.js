import { Employee } from '../../Model/employee.js';
import { Document } from '../../Model/document.js';

const documentController = {};

documentController.uploadDocument = async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required. Please provide employeeId in the request body.'
      });
    }

    const file = req.files?.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please provide a file.'
      });
    }

    const employeeRecord = await Employee.findByPk(employeeId);
    if (!employeeRecord) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const document = await Document.create({
      employeeId: employeeRecord.id,
      fileName: file.name,
      originalFileName: file.name,
      mimeType: file.mimetype,
      fileSize: file.size,
      driveFileId: null,
      webViewLink: null,
      webContentLink: null,
      description: req.body.description || null
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        documentId: document.id,
        fileName: document.fileName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        uploadedAt: document.createdAt
      }
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message
    });
  }
};

documentController.getEmployeeDocuments = async (req, res) => {
  try {
    const employeeId = req.query.employeeId || req.body.employeeId;
    
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required. Please provide employeeId as a query parameter or in the request body.'
      });
    }

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const documents = await Document.findAll({
      where: { employeeId: employeeId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: documents,
      message: 'Documents retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving documents',
      error: error.message
    });
  }
};

documentController.getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await Document.findByPk(id, {
      include: [{
        model: Employee,
        as: 'employee',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.status(200).json({
      success: true,
      data: document,
      message: 'Document retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving document',
      error: error.message
    });
  }
};

export default documentController;