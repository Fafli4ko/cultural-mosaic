// showRoutes.js

const express = require("express");
const jwt = require("jsonwebtoken");
const Shows = require("../models/Shows");
const User = require("../models/User");
const router = express.Router();
const jwtSecret = "thisIsARandomStringForTheJWTToken";
const { transliterate } = require("transliteration");
const mongoose = require("mongoose");

router.post("/shows", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    title,
    director,
    releaseYear,
    genre,
    seasons,
    addedPhotos,
    description,
    rating,
    hasBeenRatedBy,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const showDoc = await Shows.create({
      owner: userData._id,
      title,
      director,
      releaseYear,
      genre,
      seasons,
      photos: addedPhotos,
      description,
      rating,
      hasBeenRatedBy,
      translatedTitle: transliterate(title),
    });
    res.json(showDoc);
  });
});

// /user-shows should be made admin specific :O
router.get("/admin-shows", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    res.json(await Shows.find());
  });
});

router.get("/shows/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Shows.findById(id));
});

router.put("/shows", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    id,
    title,
    director,
    releaseYear,
    genre,
    seasons,
    addedPhotos,
    description,
    rating,
    hasBeenRatedBy,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const showDoc = await Shows.findById(id);
    if (showDoc.owner === userData._id) {
      showDoc.set({
        title,
        director,
        releaseYear,
        genre,
        seasons,
        photos: addedPhotos,
        description,
        rating,
        hasBeenRatedBy,
      });
      showDoc.save();
      res.json("ok");
    } else {
      res.status(401).json("not your show to edit");
    }
  });
});

router.get("/shows", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Shows.find());
});

router.get("/search/:searchTerm", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  let { searchTerm } = req.params;
  try {
    if (searchTerm === "undefined") {
      res.json(await Shows.find());
    } else {
      res.json(
        await Shows.find({
          translatedTitle: searchTerm,
        })
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/shows/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const showDoc = await Shows.findById(id);
    if (userData._id === userData.admin) {
      await Shows.findByIdAndDelete(id);
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
    const showId = req.body.showId; // Extract show ID from the request body

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the show ID to the user's "toWatchShows" array
    user.toWatchShows.push(showId);

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Show added to watchlist successfully" });
  } catch (error) {
    console.error("Error adding show to watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:userId/toWatch/:showId", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.userId; // Extract user ID from the URL parameter
    const showId = req.params.showId; // Extract show ID from the URL parameter

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the show ID from the user's "toWatchShows" array
    user.toWatchShows = user.toWatchShows.filter((id) => id !== showId);

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({ message: "Show removed from watchlist successfully" });
  } catch (error) {
    console.error("Error removing show from watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/shows/toWatch/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.id; // Assuming user ID is available in the request parameters
    const user = await User.findById(userId);

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const toWatchShows = user.toWatchShows || []; // Assuming watchedMovies is an array of movie IDs
    const shows = await Shows.find({ _id: { $in: toWatchShows } }); // Assuming "Movie" is your Mongoose model for movies
    res.json(shows);
  } catch (error) {
    console.error("Error fetching to-watch shows:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//watched
router.put("/:id/watched", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.id; // Extract user ID from the URL parameter
    const showId = req.body.showId; // Extract show ID from the request body

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the show ID to the user's "toWatchShows" array
    user.watchedShows.push(showId);

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Show added to watched successfully" });
  } catch (error) {
    console.error("Error adding show to watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:userId/watched/:showId", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.userId; // Extract user ID from the URL parameter
    const showId = req.params.showId; // Extract show ID from the URL parameter

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the show ID from the user's "toWatchShows" array
    user.watchedShows = user.watchedShows.filter((id) => id !== showId);

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({ message: "Show removed from watchlist successfully" });
  } catch (error) {
    console.error("Error removing show from watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/shows/watched/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.id; // Assuming user ID is available in the request parameters
    const user = await User.findById(userId);

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const watchedShows = user.watchedShows || []; // Assuming toWatchShows is an array of show IDs
    const shows = await Shows.find({ _id: { $in: watchedShows } }); // Assuming "Show" is your Mongoose model for shows
    res.json(shows);
  } catch (error) {
    console.error("Error fetching to-watch shows:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/shows/:id/rate", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const { id } = req.params;
    const { rating, userId } = req.body;

    // Check if the user has already rated the show
    const show = await Shows.findById(id);
    if (show.hasBeenRatedBy.includes(userId)) {
      return res.status(400).json({
        message: "You have already rated this show",
        averageRating: show.averageRating,
      });
    }

    // Add the user's ID to the hasBeenRatedBy array
    show.hasBeenRatedBy.push(userId);

    // Update the show's rating array
    show.rating.push(rating);

    // Calculate the average rating
    const averageRating =
      show.rating.reduce((acc, curr) => acc + curr, 0) / show.rating.length;
    show.averageRating = averageRating;

    // Save the updated show
    await show.save();

    res.json({ ...show.toObject(), averageRating });
  } catch (error) {
    console.error("Error rating the show:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
