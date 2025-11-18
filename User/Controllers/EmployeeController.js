import { Employee } from '../../Model/employee.js';
import { Document } from '../../Model/document.js';
import { All_Models } from '../../Utils/All_Models.js';
import blobService from '../../Utils/blobService.js';

const employeeController = {}

employeeController.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{
        model: All_Models.Document,
        as: 'documents',
        attributes: ['id', 'fileName', 'originalFileName', 'mimeType', 'fileSize', 'azureBlobUrl', 'documentType', 'createdAt']
      }]
    });
    res.status(200).json({
      success: true,
      data: employees,
      message: 'Employees retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving employees',
      error: error.message
    });
  }
};

employeeController.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }
    const employee = await Employee.findOne({
      where: { id },
      include: [{
        model: All_Models.Document,
        as: 'documents',
        attributes: ['id', 'fileName', 'originalFileName', 'mimeType', 'fileSize', 'azureBlobUrl', 'documentType', 'createdAt']
      }]
    });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: employee,
      message: 'Employee retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving employee',
      error: error.message
    });
  }
};

employeeController.createEmployee = async (req, res) => {
  try {
    const { name, phoneNumber, mobile, dateOfBirth, uan, remark } = req.body;
    
    if (!name || (!phoneNumber && !mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Name and phoneNumber are required'
      });
    }

    const employeeData = {
      name,
      phoneNumber: phoneNumber || mobile,
      dateOfBirth: dateOfBirth || null,
      uan: uan || null,
      remark: remark || null,
      location: req.body.location || 'N/A'
    };

    const employee = await Employee.create(employeeData);

    const documentTypes = ['aadhaar', 'pan', 'bank', 'additional'];
    const uploadedDocuments = [];
    const uploadErrors = [];

    for (const docType of documentTypes) {
      const files = req.files?.[docType];
      if (files) {
        const fileArray = Array.isArray(files) ? files : [files];
        
        for (const file of fileArray) {
          const fileBuffer = file.data || file.buffer;
          if (!fileBuffer) {
            uploadErrors.push(`No file buffer found for ${docType} file: ${file.name}`);
            continue;
          }

          let uploadResult = null;
          try {
            uploadResult = await blobService.uploadFileToEmployeeFolder(
              employee.id,
              employee.name,
              file.name,
              fileBuffer,
              file.mimetype
            );
          } catch (uploadError) {
            console.error(`Error uploading ${docType} file to Azure Blob:`, uploadError);
            uploadErrors.push(`Failed to upload ${docType} file ${file.name}: ${uploadError.message}`);
            continue;
          }

          if (!uploadResult || !uploadResult.blobName || !uploadResult.url) {
            uploadErrors.push(`Azure upload returned invalid result for ${docType} file: ${file.name}`);
            continue;
          }

          try {
            const document = await Document.create({
              employeeId: employee.id,
              fileName: file.name,
              originalFileName: file.name,
              mimeType: file.mimetype,
              fileSize: file.size,
              azureBlobName: uploadResult.blobName,
              azureBlobUrl: uploadResult.url,
              documentType: docType
            });
            uploadedDocuments.push(document);
          } catch (dbError) {
            console.error(`Error creating document record for ${docType} file:`, dbError);
            uploadErrors.push(`Failed to create document record for ${docType} file ${file.name}: ${dbError.message}`);
          }
        }
      }
    }

    if (uploadErrors.length > 0) {
      console.warn('Some files failed to upload:', uploadErrors);
    }

    const employeeWithDocs = await Employee.findOne({
      where: { id: employee.id },
      include: [{
        model: All_Models.Document,
        as: 'documents',
        attributes: ['id', 'fileName', 'originalFileName', 'mimeType', 'fileSize', 'azureBlobUrl', 'documentType', 'createdAt']
      }]
    });

    res.status(201).json({
      success: true,
      data: employeeWithDocs,
      message: 'Employee created successfully'
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating employee',
      error: error.message
    });
  }
};

employeeController.updateEmployee = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }
    const { name, phoneNumber, mobile, dateOfBirth, uan, remark } = req.body;

    const employee = await Employee.findOne({ where: { id } });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (name) employee.name = name;
    if (phoneNumber || mobile) {
      employee.phoneNumber = phoneNumber || mobile;
    }
    if (dateOfBirth !== undefined) {
      employee.dateOfBirth = dateOfBirth || null;
    }
    if (uan !== undefined) employee.uan = uan || null;
    if (remark !== undefined) employee.remark = remark || null;

    await employee.save();

    const employeeWithDocs = await Employee.findOne({
      where: { id },
      include: [{
        model: All_Models.Document,
        as: 'documents',
        attributes: ['id', 'fileName', 'originalFileName', 'mimeType', 'fileSize', 'azureBlobUrl', 'documentType', 'createdAt']
      }]
    });

    res.status(200).json({
      success: true,
      data: employeeWithDocs,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating employee',
      error: error.message
    });
  }
};

employeeController.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    const employee = await Employee.findOne({ where: { id } });
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await Document.destroy({
      where: { employeeId: id }
    });

    await employee.destroy();

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting employee',
      error: error.message
    });
  }
};

export default employeeController;