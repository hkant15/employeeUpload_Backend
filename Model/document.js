import { DataTypes } from '@sequelize/core';
import { sequelize } from '../Utils/dbConnection.js';

export const Document = sequelize.define('Document', {
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
    azureBlobName: {
      type: DataTypes.STRING(),
      allowNull: false
    },
    azureBlobUrl: {
      type: DataTypes.STRING(),
      allowNull: false
    },
    documentType: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
});



