const express = require("express");
const app = express();
const authRouter = require("./src/routes/auths");
const saucesRouter = require("./src/routes/sauces");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");

require("dotenv").config();

mongoose.connect(
  process.env.API_URL,
  () => {
    console.log("CONNECTED");
  },
  (err) => console.error(err)
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(mongoSanitize());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static("images")); // Chemin pour Multer
app.use("/api/auth", authRouter);
app.use("/api/sauces", saucesRouter);

app.listen(3000);
