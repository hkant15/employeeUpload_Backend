import { DataTypes } from '@sequelize/core';
import { sequelize } from '../Utils/dbConnection.js';

export const Admin = sequelize.define('Admin', {
    email: {
        type: DataTypes.STRING(),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(),
        allowNull: false
    }
});
