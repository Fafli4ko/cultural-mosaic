const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  releaseYear: {
    type: String,
    required: true,
  },
  genre: {
    type: [String],
    default: [],
  },
  pages: {
    type: Number,
    default: 0,
  },
  photos: {
    type: [String],
    default: [],
    required: true,
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

const BookModel = mongoose.model("Book", BookSchema);

module.exports = BookModel;
