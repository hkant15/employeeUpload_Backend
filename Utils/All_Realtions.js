import {All_Models} from './All_Models.js';

const All_Relations = () => {
  All_Models.Employee.hasMany(All_Models.Document, { foreignKey: 'employeeId', as: 'documents' });
  All_Models.Document.belongsTo(All_Models.Employee, { foreignKey: 'employeeId', as: 'employee' });
}

export default All_Relations;