// movieRoutes.js

const express = require("express");
const jwt = require("jsonwebtoken");
const Movies = require("../models/Movies");
const User = require("../models/User");
const router = express.Router();
const jwtSecret = "thisIsARandomStringForTheJWTToken";
const { transliterate } = require("transliteration");
const mongoose = require("mongoose");

router.post("/movies", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    title,
    director,
    releaseYear,
    genre,
    runTime,
    addedPhotos,
    description,
    rating,
    hasBeenRatedBy,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const movieDoc = await Movies.create({
      owner: userData._id,
      title,
      director,
      releaseYear,
      genre,
      runTime,
      photos: addedPhotos,
      description,
      rating,
      hasBeenRatedBy,
      translatedTitle: transliterate(title),
    });
    res.json(movieDoc);
  });
});

// /user-movies should be made admin specific :O
router.get("/admin-movies", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    res.json(await Movies.find());
  });
});

router.get("/movies/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Movies.findById(id));
});

router.put("/movies", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    id,
    title,
    director,
    releaseYear,
    genre,
    runTime,
    addedPhotos,
    description,
    rating,
    hasBeenRatedBy,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const movieDoc = await Movies.findById(id);
    if (movieDoc.owner === userData._id) {
      movieDoc.set({
        title,
        director,
        releaseYear,
        genre,
        runTime,
        photos: addedPhotos,
        description,
        rating,
        hasBeenRatedBy,
      });
      movieDoc.save();
      res.json("ok");
    } else {
      res.status(401).json("not your movie to edit");
    }
  });
});

router.get("/movies", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Movies.find());
});

router.get("/search/:searchTerm", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  let { searchTerm } = req.params;
  try {
    if (searchTerm === "undefined") {
      res.json(await Movies.find());
    } else {
      res.json(
        await Movies.find({
          translatedTitle: searchTerm,
        })
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/movies/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const movieDoc = await Movies.findById(id);
    if (userData._id === userData.admin) {
      await Movies.findByIdAndDelete(id);
      res.json("Movie deleted successfully");
    } else {
      res.status(401).json("Not authorized to delete this movie");
    }
  });
});

router.put("/:id/toWatch", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.id; // Extract user ID from the URL parameter
    const movieId = req.body.showId; // Extract movie ID from the request body

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the movie ID to the user's "toWatchMovies" array
    user.toWatchMovies.push(movieId);

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Movie added to watchlist successfully" });
  } catch (error) {
    console.error("Error adding movie to watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:userId/toWatch/:showId", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.userId; // Extract user ID from the URL parameter
    const movieId = req.params.showId; // Extract show ID from the URL parameter

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the movie ID from the user's "toWatchMovies" array
    user.toWatchMovies = user.toWatchMovies.filter((id) => id !== movieId);

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({ message: "Movie removed from watchlist successfully" });
  } catch (error) {
    console.error("Error removing movie from watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/movies/toWatch/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.id; // Assuming user ID is available in the request parameters
    const user = await User.findById(userId);

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const toWatchMovies = user.toWatchMovies || []; // Assuming watchedMovies is an array of movie IDs
    const movies = await Movies.find({ _id: { $in: toWatchMovies } }); // Assuming "Movie" is your Mongoose model for movies
    res.json(movies);
  } catch (error) {
    console.error("Error fetching to-watch movies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//watched
router.put("/:id/watched", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.id; // Extract user ID from the URL parameter
    const movieId = req.body.showId; // Extract movie ID from the request body

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the movie ID to the user's "watchedMovies" array
    user.watchedMovies.push(movieId);

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Movie added to watched successfully" });
  } catch (error) {
    console.error("Error adding movie to watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:userId/watched/:mediaId", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.userId; // Extract user ID from the URL parameter
    const movieId = req.params.mediaId; // Extract movie ID from the URL parameter

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the movie ID from the user's "watchedMovies" array
    user.watchedMovies = user.watchedMovies.filter((id) => id !== movieId);

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({ message: "Movie removed from watchlist successfully" });
  } catch (error) {
    console.error("Error removing movie from watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/movies/watched/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.id; // Assuming user ID is available in the request parameters
    const user = await User.findById(userId);

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const watchedMovies = user.watchedMovies || []; // Assuming watchedMovies is an array of movie IDs
    const movies = await Movies.find({ _id: { $in: watchedMovies } }); // Assuming "Movie" is your Mongoose model for movies
    res.json(movies);
  } catch (error) {
    console.error("Error fetching to-watch movies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/movies/:id/rate", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const { id } = req.params;
    const { rating, userId } = req.body;

    // Check if the user has already rated the movie
    const movie = await Movies.findById(id);
    if (movie.hasBeenRatedBy.includes(userId)) {
      return res.status(400).json({
        message: "You have already rated this movie",
        averageRating: movie.averageRating,
      });
    }

    // Add the user's ID to the hasBeenRatedBy array
    movie.hasBeenRatedBy.push(userId);

    // Update the movie's rating array
    movie.rating.push(rating);

    // Calculate the average rating
    const averageRating =
      movie.rating.reduce((acc, curr) => acc + curr, 0) / movie.rating.length;
    movie.averageRating = averageRating;

    // Save the updated movie
    await movie.save();

    res.json({ ...movie.toObject(), averageRating });
  } catch (error) {
    console.error("Error rating the movie:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
