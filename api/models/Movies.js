const mongoose = require("mongoose");
const { Schema } = mongoose;

const MovieSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  director: {
    type: String,
    required: true,
  },
  releaseYear: {
    type: String,
  },
  genre: {
    type: [String],
    default: [],
  },
  runTime: {
    type: String,
  },
  photos: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    default: "",
  },
  rating: {
    type: [Number],
    default: [],
  },
  hasBeenRatedBy: {
    type: [String],
    default: [],
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  translatedTitle: {
    type: String,
    default: "",
  },
});

const MovieModel = mongoose.model("Movie", MovieSchema);

module.exports = MovieModel;
