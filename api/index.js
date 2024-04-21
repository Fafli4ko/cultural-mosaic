const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

//Authentification routes
app.use("/api/auth", require("./routes/authRoutes"));

//Movies routes
app.use("/api/movies", require("./routes/movieRoutes"));

//Shows routes
app.use("/api/shows", require("./routes/showRoutes"));

//Books routes
app.use("/api/books", require("./routes/bookRoutes"));

//Photo routes
app.use("/api/photoUploader", require("./routes/photoUploaderRoutes"));

app.listen(4000);
