// Import du package 'express'
const express = require("express");
// Appel à la fonction Router(), issue du package 'express'
const router = express.Router();

// uid2 et crypto-js sont des packages qui vont nous servir à encrypter le mot de passe
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// Import du package cloudinary
const cloudinary = require("cloudinary").v2;

// Import du middleware isUserAuthenticated
const isUserAuthenticated = require("../middleware/isUserAuthenticated");

// Import du model User
const User = require("../models/User");

// déclaration de la route signup
router.post("/user/signup", async (req, res) => {
  console.log("signup OK");
  console.log("email 1 ==>", req.fields.email);
  try {
    const user = await User.findOne({ email: req.fields.email });

    console.log("user ? =>", user);

    if (user) {
      res.status(409).json({ message: "This email already has an account" });
    } else {
      console.log("email==>", req.fields.email);
      console.log("password==>", req.fields.password);

      if (req.fields.email && req.fields.password) {
        const token = uid2(64);
        const salt = uid2(64);
        const hash = SHA256(req.fields.password + salt).toString(encBase64);

        const newUser = new User({
          email: req.fields.email,
          birthdate: req.fields.birthdate,
          token: token,
          hash: hash,
          salt: salt,
        });

        await newUser.save();
        res.status(200).json({
          _id: newUser._id,
          email: newUser.email,
          token: newUser.token,
        });
      } else {
        res.status(400).json({ message: "Missing parameters" });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.fields.email });

    if (user) {
      if (
        SHA256(req.fields.password + user.salt).toString(encBase64) ===
        user.hash
      ) {
        res.status(200).json({
          _id: user._id,
          token: user.token,
          email: user.email,
        });
      } else {
        res.status(401).json({ error: "Unauthorized 444" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ message: error.message });
  }
});

module.exports = router;
