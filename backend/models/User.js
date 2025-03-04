import { DataTypes } from 'sequelize';
import sequelize from '/home/sindhu/Downloads/project/backend/config/database.js';

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true, freezeTableName: true });

export default User;