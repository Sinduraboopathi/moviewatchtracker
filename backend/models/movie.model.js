import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/database.js';

const Movie = sequelize.define('Movie', {
  title: { type: DataTypes.STRING, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: false },
  release_year: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0, max: 5 } },
  status: { type: DataTypes.ENUM('Watched', 'Watching', 'Plan to Watch'), allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true, freezeTableName: true, paranoid: true });

export default Movie;