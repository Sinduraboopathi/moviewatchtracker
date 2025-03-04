import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use('/api/auth', authRoutes);

export default app;
