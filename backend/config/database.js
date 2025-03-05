import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize('test_schema', 'root', process.env.DB_PASSWORD || '', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  logging: false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
});

export default sequelize;

