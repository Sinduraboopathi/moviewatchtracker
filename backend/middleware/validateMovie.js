import { body, validationResult } from "express-validator";

export const validateMovie = [
  body("title").notEmpty().withMessage("Title is required"),
  body("genre").notEmpty().withMessage("Genre is required"),
  body("release_year").isInt().withMessage("Release year must be a number"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("status").isIn(["Watched", "Watching", "Plan to Watch"]).withMessage("Invalid status"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


