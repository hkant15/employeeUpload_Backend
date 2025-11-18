import { Employee } from '../../Model/employee.js';

const employeeController = {}

employeeController.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll();
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
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    
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
    const employee = await Employee.create(req.body);
    res.status(201).json({
      success: true,
      data: employee,
      message: 'Employee created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating employee',
      error: error.message
    });
  }
};

employeeController.uploadEmployeeFile = async (req, res) => {
  try {
    const file = req.files?.file;
    
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: file.name,
        mimetype: file.mimetype,
        size: file.size
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

export default employeeController;