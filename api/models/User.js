const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  user: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  toWatchMovies: {
    type: [String],
    default: [],
  },
  watchedMovies: {
    type: [String],
    default: [],
  },
  toWatchShows: {
    type: [String],
    default: [],
  },
  watchedShows: {
    type: [String],
    default: [],
  },
  toReadBooks: {
    type: [String],
    default: [],
  },
  readBooks: {
    type: [String],
    default: [],
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
