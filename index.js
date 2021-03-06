const express = require("express");
const mongoose = require("mongoose");
const formidable = require("express-formidable");
const cors = require("cors");
const app = express();
const cloudinary = require("cloudinary").v2;
app.use(formidable());
app.use(cors());

// Permet l'accès aux variables d'environnement
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Connexion à l'espace de stockage cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const userRoutes = require("./routes/user");
const authorRoutes = require("./routes/author");
const questionRoutes = require("./routes/question");

const testRoutes = require("./routes/test");

app.use(userRoutes);
app.use(authorRoutes);
app.use(questionRoutes);
// console.log(userRoutes);
app.use(testRoutes);

app.get("/", (req, res) => {
  res.json("Bienvenue sur l'API de Culture En Poche");
});

app.get("*", (req, res) => {
  res.json("Page not found");
});

app.use(function (err, req, res, next) {
  res.json({ error: err.message });
});

const server = app.listen(process.env.PORT, () => {
  // const server = app.listen(4000, () => {
  console.log("Server started");
});
server.timeout = Number(process.env.SERVER_TIMEOUT) || 1000000;
