// bookRoutes.js

const express = require("express");
const jwt = require("jsonwebtoken");
const Books = require("../models/Books");
const User = require("../models/User");
const router = express.Router();
const jwtSecret = "thisIsARandomStringForTheJWTToken";
const { transliterate } = require("transliteration");
const mongoose = require("mongoose");

router.post("/books", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    title,
    author,
    releaseYear,
    genre,
    pages,
    addedPhotos,
    description,
    rating,
    hasBeenRatedBy,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const bookDoc = await Books.create({
      owner: userData._id,
      title,
      author,
      releaseYear,
      genre,
      pages,
      photos: addedPhotos,
      description,
      rating,
      hasBeenRatedBy,
      translatedTitle: transliterate(title),
    });
    res.json(bookDoc);
  });
});

// /user-books should be made admin specific :O
router.get("/admin-books", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    res.json(await Books.find());
  });
});

router.get("/books/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Books.findById(id));
});

router.put("/books", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    id,
    title,
    author,
    releaseYear,
    genre,
    pages,
    addedPhotos,
    description,
    rating,
    hasBeenRatedBy,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const bookDoc = await Books.findById(id);
    if (bookDoc.owner === userData._id) {
      bookDoc.set({
        title,
        author,
        releaseYear,
        genre,
        pages,
        photos: addedPhotos,
        description,
        rating,
        hasBeenRatedBy,
      });
      bookDoc.save();
      res.json("ok");
    } else {
      res.status(401).json("not your book to edit");
    }
  });
});

router.get("/books", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Books.find());
});

router.get("/search/:searchTerm?", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  let { searchTerm } = req.params;
  // Build your query conditionally based on the presence of searchTerm
  let query = searchTerm ? { translatedTitle: searchTerm } : {};

  try {
    const books = await Books.find(query);
    res.json(books);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/books/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const bookDoc = await Books.findById(id);
    if (userData._id === userData.admin) {
      await Books.findByIdAndDelete(id);
      res.json("Book deleted successfully");
    } else {
      res.status(401).json("Not authorized to delete this book");
    }
  });
});

router.put("/:id/toWatch", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.id; // Extract user ID from the URL parameter
    const bookId = req.body.showId; // Extract book ID from the request body

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the book ID to the user's "toReadBooks" array
    user.toReadBooks.push(bookId);

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Book added to watchlist successfully" });
  } catch (error) {
    console.error("Error adding book to watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:userId/toWatch/:showId", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.userId; // Extract user ID from the URL parameter
    const bookId = req.params.showId; // Extract show ID from the URL parameter

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the book ID from the user's "toReadBooks" array
    user.toReadBooks = user.toReadBooks.filter((id) => id !== bookId);

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({ message: "Book removed from watchlist successfully" });
  } catch (error) {
    console.error("Error removing book from watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/books/toWatch/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.id; // Assuming user ID is available in the request parameters
    const user = await User.findById(userId);

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const toReadBooks = user.toReadBooks || [];
    const books = await Books.find({ _id: { $in: toReadBooks } }); // Assuming "Book" is your Mongoose model for books
    res.json(books);
  } catch (error) {
    console.error("Error fetching to-watch books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//watched
router.put("/:id/watched", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.id; // Extract user ID from the URL parameter
    const bookId = req.body.showId; // Extract book ID from the request body

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the book ID to the user's "readBooks" array
    user.readBooks.push(bookId);

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Book added to watched successfully" });
  } catch (error) {
    console.error("Error adding book to watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:userId/watched/:mediaId", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.userId; // Extract user ID from the URL parameter
    const bookId = req.params.mediaId; // Extract book ID from the URL parameter

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the book ID from the user's "readBooks" array
    user.readBooks = user.readBooks.filter((id) => id !== bookId);

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({ message: "Books removed from watchlist successfully" });
  } catch (error) {
    console.error("Error removing book from watchlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/books/watched/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    // If user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const readBooks = user.readBooks || [];
    const books = await Books.find({ _id: { $in: readBooks } }); // Assuming "Book" is your Mongoose model for books
    res.json(books);
  } catch (error) {
    console.error("Error fetching to-watch books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/books/:id/rate", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const { id } = req.params;
    const { rating, userId } = req.body;

    // Check if the user has already rated the book
    const book = await Books.findById(id);
    if (book.hasBeenRatedBy.includes(userId)) {
      return res.status(400).json({
        message: "You have already rated this book",
        averageRating: book.averageRating,
      });
    }

    // Add the user's ID to the hasBeenRatedBy array
    book.hasBeenRatedBy.push(userId);

    // Update the book's rating array
    book.rating.push(rating);

    // Calculate the average rating
    const averageRating =
      book.rating.reduce((acc, curr) => acc + curr, 0) / book.rating.length;
    book.averageRating = averageRating;

    // Save the updated book
    await book.save();

    res.json({ ...book.toObject(), averageRating });
  } catch (error) {
    console.error("Error rating the book:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
