import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import authenticateToken from './middleware/authenticateToken.js';
import * as authController from './controllers/auth.controller.js';
import * as movieController from './controllers/movie.controller.js';

dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://moviewatchtracker.s3-website-us-east-1.amazonaws.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true
}));

app.options('*', cors());

app.use(express.json());

sequelize.sync()
  .then(() => console.log("✅ Database synchronized"))
  .catch(err => console.error("❌ Database sync error:", err));


app.post('/signup', authController.signup);
app.post('/login', authController.login);
app.get('/profile', authenticateToken, authController.profile);
app.post('/forgot-password', authController.forgotPassword);
app.post('/reset-password/:token', authController.resetPassword);

app.get('/movies', authenticateToken, movieController.getMovies);
app.post('/movies', authenticateToken, movieController.addMovie);
app.put('/movies/:id', authenticateToken, movieController.updateMovie);
app.delete('/movies/:id', authenticateToken, movieController.deleteMovie);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));