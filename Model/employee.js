import { DataTypes } from '@sequelize/core';
import { sequelize } from '../Utils/dbConnection.js';

export const Employee = sequelize.define('Employee', {
  name: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(),
    allowNull: false,
  },
  driveFolderId: {
    type: DataTypes.STRING(),
    allowNull: true
  }
});


