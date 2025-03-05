import Movie from '../models/movie.model.js';
import { Op } from 'sequelize';

export const getMovies = async (req, res) => {
  try {
    const { offset = 0, limit = 10, search = '', sortBy = 'title_asc' } = req.query;
    const whereClause = { user_id: req.user.id };

    if (search.trim() !== '') {
      whereClause.title = { [Op.like]: `%${search}%` };
    }

    const validSortFields = ['title', 'release_year', 'rating', 'createdAt', 'status'];
    const [sortField, sortOrderRaw] = sortBy.split('_');
    const sortOrder = sortOrderRaw === 'desc' ? 'DESC' : 'ASC';

    const finalSortField = validSortFields.includes(sortField) ? sortField : 'title';

    const { count, rows } = await Movie.findAndCountAll({
      where: whereClause,
      order: [[finalSortField, sortOrder]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    console.log(`Found ${count} movies`);

    res.json({
      movies: rows,
      totalMovies: count,
    });
  } catch (err) {
    console.error("Fetch Movies Error:", err);
    res.status(500).json({ message: err.message || 'Error fetching movies.' });
  }
};

export const addMovie = async (req, res) => {
  try {
    const { title, genre, release_year, rating, status } = req.body;

    if (!title || !genre || !release_year || !status) {
      return res.status(400).json({ message: "Title, genre, release year, and status are required!" });
    }

    if ((status === "Watched" || status === "Watching") && (rating === null || rating === undefined)) {
      return res.status(400).json({ message: "Rating is required for watched and watching movies!" });
    }

    const movie = await Movie.create({
      title,
      genre,
      release_year,
      rating: status === "Plan to Watch" ? null : rating,
      status,
      user_id: req.user.id,
    });

    res.status(201).json(movie);
  } catch (err) {
    console.error("Add Movie Error:", err);
    res.status(400).json({ message: err.message || "Error adding movie." });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findOne({ where: { id, user_id: req.user.id } });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found." });
    }

    await movie.update(req.body);
    res.json({ message: "Movie updated successfully.", movie });
  } catch (err) {
    console.error("Update Movie Error:", err);
    res.status(500).json({ message: err.message || 'Error updating movie.' });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Movie.destroy({ where: { id, user_id: req.user.id } });

    if (deleted === 0) {
      return res.status(404).json({ message: "Movie not found or already deleted." });
    }

    res.json({ message: "Movie deleted successfully." });
  } catch (err) {
    console.error("Delete Movie Error:", err);
    res.status(500).json({ message: err.message || 'Error deleting movie.' });
  }
};