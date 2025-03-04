const Movie = require("../models/movie.model");

export const getMovies = async (req, res) => {
    try {
      const { page = 1, limit = 5, search = "", sortBy = "title", order = "ASC" } = req.query;
      const offset = (page - 1) * limit;
  
      const movies = await Movie.findAndCountAll({
        where: {
          user_id: req.user.id,
          title: { [Op.like]: `%${search}%` }
        },
        order: [[sortBy, order]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
  
      res.json({
        total: movies.count,
        movies: movies.rows
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch movies" });
    }
  };
  
exports.createMovie = async (req, res) => {
  try {
    const { title, genre, release_year, rating, status } = req.body;
    const newMovie = await Movie.create({ title, genre, release_year, rating, status, user_id: req.user.id });
    res.json(newMovie);
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie" });
  }
};

export const deleteMovie = async (req, res) => {
    try {
      const movie = await Movie.findOne({ where: { id: req.params.id, user_id: req.user.id } });
      if (!movie) return res.status(404).json({ error: "Movie not found" });
  
      await movie.destroy(); // Soft delete
      res.json({ message: "Movie deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete movie" });
    }
  };
  
