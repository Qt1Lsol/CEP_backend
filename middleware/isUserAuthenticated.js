const User = require("../models/User");

const isUserAuthenticated = async (req, res, next) => {
  console.log("isUserAuthenticated OK");

  // req.headers.authorization
  if (req.headers.authorization) {
    // console.log(req.headers.authorization);
    const token = req.headers.authorization.replace("Bearer ", "");
    // Chercher dans la BDD un user qui a ce token
    console.log("token ==>", userToken);
    const user = await User.findOne({ token: userToken }).select("_id");
    console.log("user ? ==>", user);

    if (user) {
      req.user = user;
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

module.exports = isUserAuthenticated;
