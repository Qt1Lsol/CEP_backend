const Author = require("../models/Author");

const isAuthenticated = async (req, res, next) => {

  console.log("isAuthenticated OK");

  // req.headers.authorization
  if (req.headers.authorization) {
    // console.log(req.headers.authorization);
    const token = req.headers.authorization.replace("Bearer ", "");
    // Chercher dans la BDD un user qui a ce token
    console.log("token ==>",token);
    const author = await Author.findOne({ token: token }).select("_id");
    console.log("author ? ==>",author);
    // console.log(user);
    if (author) {
      req.author = author;
      next();
    } else {
      return res.status(401).json({
        message: "Unauthorized 11",
      });
    }
  } else {
    console.log("else ? ==>");
    return res.status(401).json({
      message: "Unauthorized 12",
    });
  }
};

module.exports = isAuthenticated;
