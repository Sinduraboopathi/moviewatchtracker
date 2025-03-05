import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import authenticateToken from './middleware/authenticateToken.js';
import * as authController from './controllers/auth.controller.js';
import * as movieController from './controllers/movie.controller.js';
import { Op } from 'sequelize';
import Movie from './models/movie.model.js';

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

app.get('/movies/table', authenticateToken, async (req, res) => {
  try {
    const { offset = 0, limit = 10, search = '', sortBy = 'title_asc' } = req.query;
    const whereClause = { user_id: req.user.id };

    if (search.trim() !== '') {
      whereClause.title = { [Op.like]: `%${search}%` };
    }

    const validSortFields = ['title', 'release_year', 'rating'];
    const [sortField, sortOrderRaw] = sortBy.split('_');
    const sortOrder = sortOrderRaw === 'desc' ? 'DESC' : 'ASC';

    const finalSortField = validSortFields.includes(sortField) ? sortField : 'title';

    let finalSortOrder = sortOrder;

    if (finalSortField === 'title' && sortOrder === 'ASC') {
        finalSortOrder = 'DESC';
    } else if (finalSortField === 'title' && sortOrder === 'DESC') {
        finalSortOrder = 'ASC';
    } else if((finalSortField === 'release_year' || finalSortField === 'rating') && sortOrder === 'ASC'){
        finalSortOrder = 'DESC'
    } else if ((finalSortField === 'release_year' || finalSortField === 'rating') && sortOrder === 'DESC'){
        finalSortOrder = 'ASC'
    }

    const { count, rows } = await Movie.findAndCountAll({
      where: whereClause,
      order: [[finalSortField, finalSortOrder]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json({ movies: rows, totalMovies: count });
  } catch (err) {
    console.error('Error fetching movies for table:', err);
    res.status(500).json({ message: 'Error fetching movies for table.' });
  }
});

app.delete('/movies/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findOne({ where: { id, user_id: req.user.id } });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    await Movie.destroy({ where: { id, user_id: req.user.id } });
    res.json({ message: 'Movie deleted successfully.' });
  } catch (err) {
    console.error('Error deleting movie:', err);
    res.status(500).json({ message: 'Error deleting movie.' });
  }
});

app.put('/movies/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findOne({ where: { id, user_id: req.user.id } });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    await Movie.update(req.body, { where: { id, user_id: req.user.id } });
    res.json({ message: 'Movie updated successfully.' });
  } catch (err) {
    console.error('Error updating movie:', err);
    res.status(500).json({ message: 'Error updating movie.' });
  }
});

app.get('/movies', authenticateToken, movieController.getMovies);
app.post('/movies', authenticateToken, movieController.addMovie);
app.put('/movies/:id', authenticateToken, movieController.updateMovie);
app.delete('/movies/:id', authenticateToken, movieController.deleteMovie);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));