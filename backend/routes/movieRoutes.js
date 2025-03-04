const express = require("express");
const router = express.Router();
const { getMovies, createMovie, updateMovie, deleteMovie } = require("../controllers/movieController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getMovies);
router.post("/", authMiddleware, createMovie);
router.put("/:id", authMiddleware, updateMovie);
router.delete("/:id", authMiddleware, deleteMovie);

module.exports = router;
