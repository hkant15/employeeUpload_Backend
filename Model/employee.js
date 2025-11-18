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
  dateOfBirth: {
    type: DataTypes.DATE(),
    allowNull: true,
  },
  uan: {
    type: DataTypes.STRING(),
    allowNull: true,
  },
  remark: {
    type: DataTypes.TEXT(),
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING(),
    allowNull: false,
  }
});


