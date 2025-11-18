import { DataTypes } from '@sequelize/core';
import { sequelize } from '../Utils/dbConnection.js';

export const Document = sequelize.define('Document', {
  employeeId: {
    type: DataTypes.INTEGER(),
    allowNull: false,
    references: {
      key: 'id'
    }
  },
  fileName: {
    type: DataTypes.STRING(),
    allowNull: false
  },
  originalFileName: {
    type: DataTypes.STRING(),
    allowNull: false
  },
  mimeType: {
    type: DataTypes.STRING(),
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER(),
    allowNull: true
  },
  driveFileId: {
    type: DataTypes.STRING(),
    allowNull: true,
    unique: false
  },
  webViewLink: {
    type: DataTypes.STRING(),
    allowNull: true
  },
  webContentLink: {
    type: DataTypes.STRING(),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT(),
    allowNull: true
  }
});



