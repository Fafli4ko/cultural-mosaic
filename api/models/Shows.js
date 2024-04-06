const mongoose = require("mongoose");
const { Schema } = mongoose;

const ShowSchema = new Schema({
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
  seasons: {
    type: Number,
    default: 1,
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

const ShowModel = mongoose.model("Show", ShowSchema);

module.exports = ShowModel;
