// authRoutes.js

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");
const router = express.Router();

const jwtSecret = "thisIsARandomStringForTheJWTToken";
const bcryptSalt = bcrypt.genSaltSync(5);

// Register endpoint
router.post("/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { user, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const userDoc = await User.create({
      user,
      email,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Failed to create user" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (userDoc) {
      if (bcrypt.compareSync(password, userDoc.password)) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id },
          jwtSecret,
          {},
          (err, token) => {
            if (err) {
              console.error(err);
              res.status(500).json("Internal Server Error");
              return;
            }
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json("Invalid email or password");
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

// Profile endpoint
router.get("/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, currentUser) => {
      if (err) throw err;
      const {
        user,
        email,
        _id,
        admin,
        toWatchMovies,
        watchedMovies,
        toReadBooks,
        readBooks,
        toWatchShows,
        watchedShows,
      } = await User.findById(currentUser.id);
      console.log({
        user,
        email,
        _id,
        admin,
        toWatchShows,
        watchedShows,
        toWatchMovies,
        watchedMovies,
        toReadBooks,
        readBooks,
      });
      res.json({
        user,
        email,
        _id,
        admin,
        toWatchShows,
        watchedShows,
        toWatchMovies,
        watchedMovies,
        toReadBooks,
        readBooks,
      });
    });
  } else {
    res.json(null);
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  res.cookie("token", "").json("logged out");
});

router.get("/admin-users", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    res.json(await User.find());
  });
});

router.get("/users/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await User.findById(id));
});

router.put("/users/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const userData = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user); // Send updated user data back as response
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/users/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const { id } = req.params;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const userDoc = await User.findById(id);
    if (userData._id === userData.admin) {
      await User.findByIdAndDelete(id);
      res.json("Movie deleted successfully");
    } else {
      res.status(401).json("Not authorized to delete this movie");
    }
  });
});

module.exports = router;
