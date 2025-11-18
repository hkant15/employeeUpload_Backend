import { Employee } from '../../Model/employee.js';
import { Document } from '../../Model/document.js';
import { All_Models } from '../../Utils/All_Models.js';
import blobService from '../../Utils/blobService.js';

const documentController = {};

documentController.getDocumentsByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    const employee = await Employee.findOne({ where: { id: employeeId } });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const documents = await Document.findAll({
      where: { employeeId: employeeId },
      attributes: ['id', 'employeeId', 'fileName', 'originalFileName', 'mimeType', 'fileSize', 'azureBlobName', 'azureBlobUrl', 'documentType', 'createdAt', 'updatedAt'],
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

documentController.createDocument = async (req, res) => {
  try {
    const { employeeId, documentType } = req.body;
    
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    const file = req.files?.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const employeeRecord = await Employee.findOne({ where: { id: employeeId } });
    if (!employeeRecord) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    let uploadResult = null;
    const fileBuffer = file.data || file.buffer;
    if (fileBuffer) {
      try {
        uploadResult = await blobService.uploadFileToEmployeeFolder(
          employeeRecord.id,
          employeeRecord.name,
          file.name,
          fileBuffer,
          file.mimetype
        );
      } catch (uploadError) {
        console.error('Error uploading file to Azure Blob:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error uploading file to Azure Blob',
          error: uploadError.message
        });
      }
    }
    const document = await Document.create({
      employeeId: employeeRecord.id,
      fileName: file.name,
      originalFileName: file.name,
      mimeType: file.mimetype,
      fileSize: file.size,
      azureBlobName: uploadResult?.blobName || null,
      azureBlobUrl: uploadResult?.url || null,
      documentType: documentType || 'general'
    });

    res.status(201).json({
      success: true,
      message: 'Document created successfully',
      data: {
        documentId: document.id,
        fileName: document.fileName,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        blobUrl: uploadResult?.url || null,
        uploadedAt: document.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating document',
      error: error.message
    });
  }
};

documentController.updateDocument = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Document ID is required'
      });
    }

    const { documentType } = req.body;

    const document = await Document.findOne({ where: { id } });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    if (documentType !== undefined) {
      document.documentType = documentType;
    }

    await document.save();

    res.status(200).json({
      success: true,
      data: document,
      message: 'Document updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating document',
      error: error.message
    });
  }
};

documentController.deleteDocument = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Document ID is required'
      });
    }

    const document = await Document.findOne({ where: { id } });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    await document.destroy();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting document',
      error: error.message
    });
  }
};

documentController.downloadAllDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({
      attributes: ['id', 'employeeId', 'fileName', 'originalFileName', 'mimeType', 'fileSize', 'azureBlobName', 'azureBlobUrl', 'documentType', 'createdAt', 'updatedAt'],
      include: [{
        model: All_Models.Employee,
        as: 'employee',
        attributes: ['id', 'name', 'phoneNumber', 'dateOfBirth', 'uan', 'remark', 'location']
      }],
      order: [['createdAt', 'DESC']]
    });

    if (!documents || documents.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No documents found'
      });
    }

    return res.status(200).json({
      success: true,
      data: documents,
      message: 'All documents downloaded successfully',
      count: documents.length
    });
  } catch (error) {
    console.error('Error downloading all documents:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading documents',
      error: error.message
    });
  }
};

documentController.downloadDocumentsByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.query;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    const employee = await Employee.findOne({ where: { id: employeeId } });
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

    if (!documents || documents.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No documents found for this employee'
      });
    }

    const documentsWithUrls = documents.map(doc => ({
      documentId: doc.id,
      fileName: doc.originalFileName,
      mimeType: doc.mimeType,
      fileSize: doc.fileSize,
      documentType: doc.documentType,
      azureBlobUrl: doc.azureBlobUrl,
    }));

    res.status(200).json({
      success: true,
      data: documentsWithUrls,
      message: 'Documents retrieved successfully',
      count: documents.length
    });
  } catch (error) {
    console.error('Error downloading documents:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading documents',
      error: error.message
    });
  }
};

export default documentController;