const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const cloudinary = require("cloudinary").v2;

const Test = require("../models/Test");

// déclaration de la route signup

// router.get("/test", (req, res) => {
//   res.json("Welcome to the tests route");
// });

// route qui permet de tester
router.post("/test", async (req, res) => {
  console.log("route test OK");
  console.log("polygon=>", req.fields.polygon);
  console.log("req OK");

  try {
    if (req.fields.polygon) {
      const newTest = new Test({
        locationAround: {
          type: "Polygon",
          //   coordinates: [req.fields.polygon],
          coordinates: [
            [
              [0, 0],
              [3, 6],
              [6, 1],
              [0, 0],
            ],
          ],
        },
      });

      await newTest.save();
      res.status(200).json({ newTest });
    } else {
      res.status(401).json({ message: "Missing parameters" });
    }
  } catch (error) {
    console.log("catch=>", error.message);
    res.status(432).json({ message: error.message });
  }
});

module.exports = router;
