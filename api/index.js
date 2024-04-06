const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Books = require("./models/Books");
const Movies = require("./models/Movies");
const Shows = require("./models/Shows");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(5);
const jwtSecret = "thisIsARandomStringForTheJWTToken";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

//mongoose.connect(process.env.MONGO_URL);
//media-admin-parola-24

//#region AuthUser stuff
app.use("/api/auth", require("./routes/authRoutes"));
//#endregion

//#region Photo Upload stuff
app.use("/api/photoUploader", require("./routes/photoUploaderRoutes"));
//#endregion

//#region Movie stuff
app.use("/api/movies", require("./routes/movieRoutes"));
//#endregion

//#region Show stuff
app.use("/api/shows", require("./routes/showRoutes"));
//#endregion

//#region Book stuff
app.use("/api/books", require("./routes/bookRoutes"));
//#endregion

app.listen(4000);
