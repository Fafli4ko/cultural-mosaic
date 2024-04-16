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

//#region AuthUser stuff
app.use("/api/auth", require("./routes/authRoutes"));
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
