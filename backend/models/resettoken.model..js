import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ResetToken = sequelize.define('ResetToken', {
  token: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false },
  expires: { type: DataTypes.DATE, allowNull: false },
}, { timestamps: false });

export default ResetToken;